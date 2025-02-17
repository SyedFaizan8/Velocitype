import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { comparePassword, getUserIdFromRequest, hashPassword } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { updatePasswordSchema } from "@repo/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const body = await req.json();

        const validationResult = updatePasswordSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { oldPassword, newPassword } = validationResult.data;

        const user = await prisma.user.findUnique({ where: { user_id }, select: { password: true } });
        if (!user) return NextResponse.json(new ApiError(404, "User not found"), { status: 404 });

        const isPasswordValid = await comparePassword(oldPassword.trim(), user.password);
        if (!isPasswordValid) return NextResponse.json(new ApiError(401, "Incorrect old password"), { status: 401 });

        const hashedPassword = await hashPassword(newPassword.trim());

        await prisma.user.update({ where: { user_id }, data: { password: hashedPassword } });

        return NextResponse.json(new ApiResponse(200, null, "Password updated successfully"), { status: 200 });
    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while updating password"))
    }
}
