import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { accessTokenOptions, refreshTokenOptions } from "@/utils/cookieOptions";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
        }

        await prisma.user.delete({ where: { user_id } });

        const response = NextResponse.json(new ApiResponse(200, null, "User account deleted successfully"), { status: 200 });

        response.cookies.set("accessToken", "", { ...accessTokenOptions, maxAge: 0 });
        response.cookies.set("refreshToken", "", { ...refreshTokenOptions, maxAge: 0 });

        return response;

    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while deleting account"))
    }
}
