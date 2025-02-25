import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { baseUrl, FORGOT_PASSWORD_TOKEN_EXPIRATION } from '@/utils/constants';
import { emailSchema } from "@repo/zod";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { decryptBackend } from "@/utils/decryptBackend";

export async function POST(req: NextRequest) {

    try {

        const { error, status, decryptedBody } = await decryptBackend(req)
        if (error) {
            return NextResponse.json(
                new ApiError(status, error),
                { status: status }
            );
        }

        const validationResult = emailSchema.safeParse(decryptedBody);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { email } = validationResult.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json(new ApiError(400, "User does not exists with the email"), { status: 400 });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const tokenExpiry = new Date(Date.now() + FORGOT_PASSWORD_TOKEN_EXPIRATION);

        await prisma.user.update({
            where: { user_id: user.user_id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: tokenExpiry,
            },
        });

        const resetUrl = `${baseUrl}/velocity/reset-password?token=${token}`;

        const emailResponse = await sendVerificationEmail(user.fullname, email, resetUrl)

        if (!emailResponse.success) {
            return NextResponse.json(new ApiError(500, emailResponse.message), { status: 500 });
        }

        return NextResponse.json(new ApiResponse(200, {}, "The reset link has been sent."), { status: 200 });

    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error
            : new ApiError(500, "Something went wrong while sending a link email"))
    }
}
