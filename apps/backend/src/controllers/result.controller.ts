import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma, asyncHandler, ApiError, ApiResponse } from "../utils/index";

export const result = asyncHandler(async (req: AuthRequest, res) => {
  //fix to zod
  let newHighscore: boolean = false;
  const { wpm, accuracy, totalChars, totalWords } = req.body;
  const user_id = req.user?.user_id;
  if (!user_id) throw new ApiError(400, "user id is required");

  //fix this
  try {
    const stats = await prisma.totalStatistics.upsert({
      where: { user_id },
      update: {
        total_tests_taken: { increment: 1 },
        total_letters_typed: { increment: totalChars },
        total_words_typed: { increment: totalWords },
      },
      create: {
        user_id,
        total_tests_taken: 1,
        total_letters_typed: totalChars,
        total_words_typed: totalWords,
      },
    });
    if (!stats)
      throw new ApiError(500, "Failed to update the stats after result");

    const history = await prisma.history.create({
      data: { user_id, wpm, accuracy },
    });
    if (!history) throw new ApiError(500, "Unable to push to the history");

    const userLeaderboard = await prisma.leaderboard.findUnique({
      where: { user_id },
    });

    if (!userLeaderboard) {
      const create = await prisma.leaderboard.create({
        data: {
          user_id,
          highest_wpm: wpm,
          highest_accuracy: accuracy,
          achieved_at: new Date(),
        },
      });
      if (!create)
        throw new ApiError(500, "Unable to create new leaderbaord data");
      newHighscore = true;
    } else if (wpm > userLeaderboard.highest_wpm) {
      const newRank = await prisma.leaderboard.update({
        where: { user_id },
        data: {
          highest_wpm: wpm,
          highest_accuracy: accuracy,
          achieved_at: new Date(),
        },
      });
      if (!newRank)
        throw new ApiError(500, "Unable to create new Rank in leaderboard");
      newHighscore = true;
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { newHighscore }, "Result successfully recorded"),
      );
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while updating the result");
  }
});
