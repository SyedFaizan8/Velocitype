import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@repo/db";
import { usernameSchema } from "@repo/zod";
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

        const validationResult = usernameSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { username } = validationResult.data;

        const existingUsername = await prisma.user.findUnique({ where: { username: username.trim() } });
        if (existingUsername) return NextResponse.json(new ApiError(400, "Username already exists"), { status: 400 });

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: { username: username.trim() },
            select: { username: true },
        });

        return NextResponse.json(new ApiResponse(200, updatedUser, "Username updated successfully"), { status: 200 });

    } catch {
        return NextResponse.json(new ApiError(500, "Something went wrong while updating username"))
    }
}
