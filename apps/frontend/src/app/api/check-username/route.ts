import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { usernameSchema } from "@repo/zod";
import { ApiResponse, ApiError } from "@/utils/backend/apiResponse";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        const validation = usernameSchema.safeParse({ username });
        if (!validation.success) {
            return NextResponse.json(new ApiError(400, "Validation failed"), { status: 400 });
        }

        const trimmedUsername = validation.data.username.trim();

        const user = await prisma.user.findUnique({
            where: { username: trimmedUsername },
        });

        return NextResponse.json(
            new ApiResponse(200, { available: user === null }, "Username availability check successful"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(new ApiError(500, "Internal server error while checking username"), {
            status: 500,
        });
    }
}
