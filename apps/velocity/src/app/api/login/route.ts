import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@repo/zod";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ApiError } from "@/utils/apiResponse";
import { comparePassword, generateAccessAndRefereshToken } from "@/utils/auth";
import { options } from "@/utils/cookieOptions";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        const validationResult = loginSchema.safeParse(body);
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
                imageUrl: true,
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

        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user.user_id);
        const { password: _ignored, ...userData } = user;
        void _ignored;

        const response = NextResponse.json(
            new ApiResponse(200, userData, "User logged in successfully"),
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, options);
        response.cookies.set("refreshToken", refreshToken, options);

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