import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ApiError, ApiResponse } from "@/utils/backend/apiResponse";
import { verifyAuth } from "@/middlewares/auth.middleware";
import { options } from "@/utils/backend/cookieOptions";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        await prisma.user.update({
            where: { user_id: user.user_id },
            data: { refreshToken: null },
        });

        const response = NextResponse.json(
            new ApiResponse(200, "User Logged Out"),
            { status: 200 }
        );

        response.cookies.set("accessToken", "", { ...options, maxAge: 0 });
        response.cookies.set("refreshToken", "", { ...options, maxAge: 0 });

        return response;
    } catch (error) {
        return NextResponse.json(
            new ApiError(500, "Something went wrong while logging out"),
            { status: 500 }
        );
    }
}
