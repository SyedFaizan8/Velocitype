import { prisma, asyncHandler, ApiError, ApiResponse } from "../utils/index";

export const leaderboard = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const take = 50;
  const skip = (page - 1) * take;

  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { highest_wpm: "desc" },
      skip: skip,
      take: take,
      select: {
        user: {
          select: {
            username: true,
            imageUrl: true,
          },
        },
        highest_wpm: true,
        highest_accuracy: true,
        achieved_at: true,
      },
    });

    if (leaderboard.length === 0)
      throw new ApiError(404, "No leaderboard data found");

    return res
      .status(200)
      .json(new ApiResponse(200, leaderboard, "Leaderboard data found"));
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while fetching leaderboard");
  }
});
