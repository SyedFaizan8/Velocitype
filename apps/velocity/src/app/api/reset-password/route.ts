import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { prisma } from "@/lib/prisma";
import { resetPassword } from "@repo/zod";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { hashPassword } from "@/utils/auth";
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


        const validationResult = resetPassword.safeParse(decryptedBody);
        if (!validationResult.data?.token) {
            return NextResponse.json(
                new ApiError(400, "Token is required for password reset"),
                { status: 400 }
            );
        }
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { token, password } = validationResult.data;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(400, "Invalid or expired token"),
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password)

        await prisma.user.update({
            where: { user_id: user.user_id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return NextResponse.json(
            new ApiResponse(200, { email: user.email }, "Password has been reset successfully."),
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error
            : new ApiError(500, "Something went wrong while resetting the password"))
    }


}
