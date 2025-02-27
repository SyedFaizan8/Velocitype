import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ApiError } from "@/utils/apiResponse";

export async function GET(
    req: NextRequest
) {

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json(new ApiError(404, "Provide username"), { status: 404 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                imageId: true,
                fullname: true,
                username: true,
                created_at: true,
                bio: true,
                website: true,
                stats: {
                    select: {
                        total_tests_taken: true,
                        total_letters_typed: true,
                        total_words_typed: true,
                    },
                },
                leaderboard: {
                    select: {
                        highest_wpm: true,
                        highest_accuracy: true,
                        achieved_at: true,
                    },
                },
                history: {
                    orderBy: { date: "desc" },
                    take: 100,
                    select: {
                        wpm: true,
                        date: true,
                    }
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "User not found while fetching profile"),
                { status: 404 }
            );
        }

        const userRank = user.leaderboard
            ? (await prisma.leaderboard.count({
                where: {
                    OR: [
                        { highest_wpm: { gt: user.leaderboard.highest_wpm } },
                        {
                            highest_wpm: user.leaderboard.highest_wpm,
                            highest_accuracy: { gt: user.leaderboard.highest_accuracy }
                        },
                        {
                            highest_wpm: user.leaderboard.highest_wpm,
                            highest_accuracy: user.leaderboard.highest_accuracy,
                            achieved_at: { gt: user.leaderboard.achieved_at }
                        }
                    ]
                },
            })) + 1
            : null;

        return NextResponse.json(
            new ApiResponse(200, { user, userRank }, "Profile found successfully"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError
                ? error
                : new ApiError(500, "Something went wrong while fetching profile"),
            { status: 500 }
        );
    }
}
