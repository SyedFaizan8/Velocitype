import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ApiError, ApiResponse } from "@/utils/backend/apiResponse";
import { authMiddleware } from "@/middlewares/authMiddleware";

export async function GET(req: NextRequest) {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const userData = await prisma.user.findUnique({
            where: { user_id: user.user_id },
            select: { user_id: true, username: true, imageUrl: true },
        });

        if (!userData) {
            return NextResponse.json(new ApiError(404, "User not found"), {
                status: 404,
            });
        }

        return NextResponse.json(
            new ApiResponse(200, userData, "User fetched successfully"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(new ApiError(500, "Something went wrong"), {
            status: 500,
        });
    }
}
