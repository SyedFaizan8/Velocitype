import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@repo/db";
import { dpSchema } from "@repo/zod";
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

        const validationResult = dpSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { imageUrl } = validationResult.data;

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: { imageUrl: imageUrl.trim() },
            select: { imageUrl: true },
        });

        return NextResponse.json(new ApiResponse(200, updatedUser, "Profile picture updated successfully"), { status: 200 });
    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while updating dp"))
    }
}
