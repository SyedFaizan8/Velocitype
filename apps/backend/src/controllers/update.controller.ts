import { Request } from "express";
import {
  prisma,
  ApiError,
  ApiResponse,
  asyncHandler,
  comparePassword,
  hashPassword,
  options,
} from "../utils/index";

const getUserId = (req: Request) => req.cookies.user_id || req.body.user_id;

const validateRequest = (user_id: string, field: string, fieldName: string) => {
  if (!user_id) throw new ApiError(401, "Unauthorized access");
  if (!field) throw new ApiError(400, `${fieldName} is required`);
};

const updateUserField = async (
  user_id: string,
  field: object,
  select: object,
) => {
  return await prisma.user.update({
    where: { user_id },
    data: field,
    select,
  });
};

export const updateFullname = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { newFullname } = req.body;

  validateRequest(user_id, newFullname, "New fullname");

  const updatedFullname = await updateUserField(
    user_id,
    { fullname: newFullname },
    { fullname: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedFullname, "Fullname updated successfully"),
    );
});

export const updateUsername = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { newUsername } = req.body;

  validateRequest(user_id, newUsername, "New username");

  const existingUsername = await prisma.user.findUnique({
    where: { username: newUsername },
  });
  if (existingUsername) throw new ApiError(400, "Username already exists");

  const updatedUsername = await updateUserField(
    user_id,
    { username: newUsername },
    { username: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUsername, "Username updated successfully"),
    );
});

export const updateEmail = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { newEmail } = req.body;

  validateRequest(user_id, newEmail, "New email");

  const existingEmail = await prisma.user.findUnique({
    where: { email: newEmail },
  });
  if (existingEmail) throw new ApiError(400, "Email already exists");

  const updatedEmail = await updateUserField(
    user_id,
    { email: newEmail },
    { email: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEmail, "Email updated successfully"));
});

export const updateBio = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { newBio } = req.body;

  validateRequest(user_id, newBio, "New bio");

  const updatedBio = await updateUserField(
    user_id,
    { bio: newBio },
    { bio: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBio, "Bio updated successfully"));
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { oldPassword, newPassword } = req.body;

  validateRequest(user_id, oldPassword, "Old password");
  validateRequest(user_id, newPassword, "New password");

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

export const updateTwitter = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { twitter } = req.body;

  validateRequest(user_id, twitter, "Twitter username");

  const updatedTwitter = await updateUserField(
    user_id,
    { twitter },
    { twitter: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTwitter, "Twitter updated successfully"));
});

export const updateInstagram = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { instagram } = req.body;

  validateRequest(user_id, instagram, "Instagram username");

  const updatedInstagram = await updateUserField(
    user_id,
    { instagram },
    { instagram: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedInstagram, "Instagram updated successfully"),
    );
});

export const updateWebsite = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  const { website } = req.body;

  validateRequest(user_id, website, "Website URL");

  const updatedWebsite = await updateUserField(
    user_id,
    { website },
    { website: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedWebsite, "Website updated successfully"));
});

// update this later
export const updateDp = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  validateRequest(user_id, user_id, "User ID");
  // uplaod to cloudinary
  // then upload link to prisma dp

  return res.status(200).json(new ApiResponse(200, "DP uploaded successfully"));
});

export const resetAccount = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  validateRequest(user_id, user_id, "User ID");

  try {
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (!user) throw new ApiError(404, "User not found");

    await prisma.$transaction([
      prisma.history.deleteMany({ where: { user_id } }),
      prisma.totalStatistics.update({
        where: { user_id },
        data: {
          total_letters_typed: 0,
          total_tests_taken: 0,
          total_words_typed: 0,
        },
      }),
      prisma.leaderboard.delete({ where: { user_id } }),
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

export const deleteAccount = asyncHandler(async (req, res) => {
  const user_id = getUserId(req);
  validateRequest(user_id, user_id, "User ID");

  try {
    await prisma.user.delete({ where: { user_id } });

    return res
      .status(200)
      .clearCookie("user_id", options)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "User account deleted successfully"));
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while deleting account");
  }
});
