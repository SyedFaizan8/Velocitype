import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";

export async function GET(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const userData = await prisma.user.findUnique({
            where: { user_id },
            select: { user_id: true, username: true, imageId: true },
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
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong"), {
            status: 500,
        });
    }
}
