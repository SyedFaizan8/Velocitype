import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@repo/zod";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ApiError } from "@/utils/apiResponse";
import { comparePassword, generateAccessAndRefreshToken } from "@/utils/auth";
import { accessTokenOptions, refreshTokenOptions } from "@/utils/cookieOptions";
import { decryptBackend } from "@/utils/decryptBackend";

export async function POST(req: NextRequest) {
    try {

        const { error, status, decryptedBody } = await decryptBackend(req)
        if (error) {
            return NextResponse.json(
                new ApiError(status, error),
                { status: status }
            );
        }

        const validationResult = loginSchema.safeParse(decryptedBody);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Email and password must be provided"),
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                user_id: true,
                password: true,
                username: true,
                imageId: true,
            },
        });

        if (!user) {
            return NextResponse.json(new ApiError(404, "User not found"), {
                status: 404,
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(new ApiError(401, "Invalid credentials"), {
                status: 401,
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.user_id);
        const { password: _ignored, ...userData } = user;
        void _ignored;

        const response = NextResponse.json(
            new ApiResponse(200, userData, "User logged in successfully"),
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, accessTokenOptions);
        response.cookies.set("refreshToken", refreshToken, refreshTokenOptions);

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            error instanceof ApiError
                ? error
                : new ApiError(500, "Something went wrong while logging in the user"),
            { status: 500 }
        );
    }
}