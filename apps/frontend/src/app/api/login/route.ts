import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@repo/zod";
import { prisma } from "@/utils/db";
import { ApiResponse, ApiError } from "@/utils/backend/apiResponse";
import { comparePassword, generateAccessAndRefereshToken } from "@/utils/backend/auth";
import { cookies } from "next/headers";
import { options } from "@/utils/cookieOptions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input
        const validationResult = loginSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(new ApiError(400, "Email and password must be required"), {
                status: 400,
            });
        }

        const { email, password } = validationResult.data;

        // Find user by email
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
            return NextResponse.json(new ApiError(404, "User not found"), { status: 404 });
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(new ApiError(401, "Invalid credentials"), { status: 401 });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.user_id);
        const { password: _, ...userData } = user;

        // Set cookies
        cookies().set("accessToken", accessToken, options);
        cookies().set("refreshToken", refreshToken, options);

        return NextResponse.json(new ApiResponse(200, userData, "User logged in successfully"), {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json(
            new ApiError(500, "Something went wrong while logging in the user"),
            { status: 500 }
        );
    }
}
