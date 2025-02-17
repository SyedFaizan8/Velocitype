import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { options } from "@/utils/cookieOptions";
import { generateAccessAndRefreshToken } from "@/utils/auth";

const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const incomingRefreshToken =
            req.cookies.get("refreshToken")?.value || body.refreshToken;

        if (!incomingRefreshToken) {
            return NextResponse.json(new ApiError(401, "Unauthorized request"), {
                status: 401,
            });
        }

        const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { user_id: decodedToken.user_id },
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(401, "User not found with the refresh token"),
                { status: 401 }
            );
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return NextResponse.json(
                new ApiError(401, "Refresh token is expired or used"),
                { status: 401 }
            );
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.user_id);

        const response = NextResponse.json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            ),
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, options);
        response.cookies.set("refreshToken", refreshToken, options);

        return response;
    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError
                ? error : new ApiError(500, "Something went wrong while refreshing token"),
            { status: 500 }
        );
    }
}
