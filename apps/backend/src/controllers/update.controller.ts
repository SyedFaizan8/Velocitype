import {
  prisma,
  ApiError,
  ApiResponse,
  asyncHandler,
  comparePassword,
  hashPassword,
  options,
} from "../utils/index";
import { AuthRequest } from "../middlewares/auth.middleware";

export const updateFullname = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { fullname } = req.body;

  if (!fullname) throw new ApiError(400, `fullname is required`);

  const updatedFullname = await prisma.user.update({
    where: { user_id },
    data: { fullname },
    select: { fullname: true },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedFullname, "Fullname updated successfully"),
    );
});

export const updateUsername = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { username } = req.body;

  if (!username) throw new ApiError(400, `username is required`);

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) throw new ApiError(400, "Username already exists");

  const updatedUsername = await prisma.user.update({
    where: { user_id },
    data: { username },
    select: { username: true },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUsername, "Username updated successfully"),
    );
});

export const updateEmail = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { email } = req.body;

  if (!email) throw new ApiError(400, `email is required`);

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) throw new ApiError(400, "Email already exists");

  const updatedEmail = await prisma.user.update({
    where: { user_id },
    data: { email },
    select: { email: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEmail, "Email updated successfully"));
});

export const updateBio = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { bio } = req.body;

  if (!bio) throw new ApiError(400, `bio is required`);

  const updatedBio = await prisma.user.update({
    where: { user_id },
    data: { bio },
    select: { bio: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBio, "Bio updated successfully"));
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new ApiError(400, "password is required");

  const user = await prisma.user.findUnique({
    where: { user_id },
    select: { password: true },
  });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await comparePassword(oldPassword, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Incorrect old password");

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { user_id },
    data: { password: hashedPassword },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully"));
});

export const updateSocials = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { website } = req.body;

  const updatedSocials = await prisma.user.update({
    where: { user_id },
    data: { website },
    select: { website: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSocials, "Socials updated successfully"));
});

export const updateDp = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  const { imageUrl } = req.body; //zod fix

  if (!imageUrl) throw new ApiError(400, "imageUrl is required");
  const updatedImageUrl = await prisma.user.update({
    where: { user_id },
    data: { imageUrl },
    select: { imageUrl: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedImageUrl, "DP uploaded successfully"));
});

export const resetAccount = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  if (!user_id) throw new ApiError(400, "user not found and not loged in ");

  try {
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (!user) throw new ApiError(404, "User not found");

    await prisma.$transaction([
      prisma.history.deleteMany({ where: { user_id } }),
      prisma.totalStatistics.updateMany({
        where: { user_id },
        data: {
          total_letters_typed: 0,
          total_tests_taken: 0,
          total_words_typed: 0,
        },
      }),
      prisma.leaderboard.deleteMany({ where: { user_id } }),
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, "Account stats reset successfully"));
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while resetting account");
  }
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;
  if (!user_id) throw new ApiError(400, "user not found and not loged in ");

  try {
    await prisma.user.delete({ where: { user_id } });

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "User account deleted successfully"));
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while deleting account");
  }
});
