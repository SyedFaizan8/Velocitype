import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { emailSchema } from "@repo/zod";
import { NextRequest, NextResponse } from "next/server";
import { decryptBackend } from "@/utils/decryptBackend";

export async function POST(req: NextRequest) {

    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

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

        const existingEmail = await prisma.user.findUnique({ where: { email: email.trim() } });
        if (existingEmail) return NextResponse.json(new ApiError(400, "Email already exists"), { status: 400 });

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: { email: email.trim() },
            select: { email: true },
        });

        return NextResponse.json(new ApiResponse(200, updatedUser, "Email updated successfully"), { status: 200 });
    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while updating email"))
    }
}
