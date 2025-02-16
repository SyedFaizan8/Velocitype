import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { options } from "@/utils/cookieOptions";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        await prisma.user.update({
            where: { user_id },
            data: { refreshToken: null },
        });

        const response = NextResponse.json(
            new ApiResponse(200, null, "User Logged Out"),
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
