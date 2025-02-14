import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ApiResponse, ApiError } from "@/utils/backend/apiResponse";

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        const { username } = params;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                imageUrl: true,
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
                    },
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
                where: { highest_wpm: { gt: user.leaderboard?.highest_wpm } },
            })) + 1
            : null;

        return NextResponse.json(
            new ApiResponse(200, { user, userRank }, "Profile found successfully"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            new ApiError(500, "Something went wrong while fetching profile"),
            { status: 500 }
        );
    }
}
