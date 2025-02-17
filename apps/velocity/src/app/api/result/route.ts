import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { resultSchema } from "@repo/zod";
import { getUserIdFromRequest } from "@/utils/auth";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const body = await req.json();
        const validationResult = resultSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { wpm, accuracy, totalChars, totalWords } = validationResult.data;
        let newHighscore = false;

        const stats = await prisma.totalStatistics.upsert({
            where: { user_id },
            update: {
                total_tests_taken: { increment: 1 },
                total_letters_typed: { increment: totalChars },
                total_words_typed: { increment: totalWords },
            },
            create: {
                user_id: user_id,
                total_tests_taken: 1,
                total_letters_typed: totalChars,
                total_words_typed: totalWords,
            },
        });

        if (!stats) {
            return NextResponse.json(
                new ApiError(500, "Failed to update stats"),
                { status: 500 }
            );
        }

        const history = await prisma.history.create({
            data: { user_id, wpm, accuracy },
        });

        if (!history) {
            return NextResponse.json(
                new ApiError(500, "Failed to save history"),
                { status: 500 }
            );
        }

        const userLeaderboard = await prisma.leaderboard.findUnique({
            where: { user_id },
        });

        if (!userLeaderboard) {
            await prisma.leaderboard.create({
                data: {
                    user_id,
                    highest_wpm: wpm,
                    highest_accuracy: accuracy,
                    achieved_at: new Date(),
                },
            });
            newHighscore = true;
        } else if (wpm > userLeaderboard.highest_wpm) {
            await prisma.leaderboard.update({
                where: { user_id },
                data: {
                    highest_wpm: wpm,
                    highest_accuracy: accuracy,
                    achieved_at: new Date(),
                },
            });
            newHighscore = true;
        }

        return NextResponse.json(
            new ApiResponse(200, { newHighscore }, "Result successfully recorded"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError
                ? error : new ApiError(500, "Something went wrong while updating the result"),
            { status: 500 }
        );
    }
}
