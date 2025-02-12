import { prisma, ApiError, ApiResponse, asyncHandler } from "../utils/index";

export const profile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  try {
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
    if (!user)
      throw new ApiError(404, "User not found while fetching for profile");

    const userRank = user.leaderboard
      ? (await prisma.leaderboard.count({
          where: { highest_wpm: { gt: user.leaderboard?.highest_wpm } },
        })) + 1
      : null;

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user, userRank }, "Profile found successfull"),
      );
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while fetching profile");
  }
});
