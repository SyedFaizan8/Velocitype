import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@repo/zod";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ApiError } from "@/utils/apiResponse";
import { hashPassword } from "@/utils/auth";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const validationResult = registerSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(new ApiError(400, validationResult.error.errors[0].message), {
                status: 400,
            });
        }

        const { fullname, username, email, password, confirmPassword } = validationResult.data;

        if (password !== confirmPassword) {
            return NextResponse.json(new ApiError(400, "Passwords do not match"), { status: 400 });
        }

        const existingUserwithEmail = await prisma.user.findUnique({ where: { email } });
        if (existingUserwithEmail) {
            return NextResponse.json(new ApiError(409, "User with email already exists"), { status: 409 });
        }

        const existingUserwithUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUserwithUsername) {
            return NextResponse.json(new ApiError(409, "User with username already exists"), { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: { fullname, username, email, password: hashedPassword },
            select: { user_id: true },
        });

        if (!newUser) {
            return NextResponse.json(new ApiError(500, "Something went wrong while registering the user in database"), {
                status: 500,
            });
        }

        const dataCreated = await prisma.totalStatistics.create({
            data: {
                user_id: newUser.user_id,
                total_tests_taken: 0,
                total_letters_typed: 0,
                total_words_typed: 0,
            },
        });

        if (!dataCreated) {
            return NextResponse.json(
                new ApiError(500, "Something went wrong when creating a data while registering user"),
                { status: 500 }
            );
        }

        return NextResponse.json(new ApiResponse(201, null, "User registered successfully"), {
            status: 201,
        });
    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError
                ? error
                : new ApiError(500, "Internal server error during user registration"),
            { status: 500 }
        );
    }
}
