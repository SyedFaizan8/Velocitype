import { prisma, asyncHandler, ApiError, ApiResponse } from "../utils/index"

export const leaderboard = asyncHandler(
    async (req, res) => {
        try {
            const leaderboard = await prisma.leaderboard.findMany({
                orderBy: { highest_wpm: "desc" },
                take: 100,
                select: {
                    user: {
                        select: {
                            username: true,
                        }
                    },
                    highest_wpm: true,
                    highest_accuracy: true,
                    achieved_at: true
                }
            })
            if (leaderboard.length === 0) throw new ApiError(404, "no leaderboad data found");

            return res
                .status(200)
                .json(new ApiResponse(200, leaderboard, "Leaderboard data found"))

        } catch (error) {
            throw (error instanceof ApiError) ? error
                : new ApiError(500, "Something went wrong while fetching leaderboard");
        }
    }
)