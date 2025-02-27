import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ApiError } from "@/utils/apiResponse";
import redis from "@/lib/redisClient";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const cacheKey = `leaderboard:page:${page}`;

        const cachedData = await redis.json.get(cacheKey)

        if (cachedData) {
            return NextResponse.json(
                new ApiResponse(200, cachedData, "Leaderboard data found (cached)"),
                { status: 200 }
            );
        }

        const take = 50;
        const skip = (page - 1) * take;

        const leaderboard = await prisma.leaderboard.findMany({
            orderBy: {
                highest_wpm: "desc"
            },
            skip,
            take,
            select: {
                user: {
                    select: {
                        username: true,
                        imageId: true,
                    },
                },
                highest_wpm: true,
                highest_accuracy: true,
                achieved_at: true,
            },
        });

        if (leaderboard.length === 0) {
            return NextResponse.json(
                new ApiError(404, "No leaderboard data found"),
                { status: 404 }
            );
        }

        await redis.json.set(cacheKey, '$', leaderboard);
        await redis.expire(cacheKey, 60)

        return NextResponse.json(
            new ApiResponse(200, leaderboard, "Leaderboard data found"),
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError ? error
                : new ApiError(500, "Something went wrong while fetching leaderboard"),
            { status: 500 }
        );
    }
}
