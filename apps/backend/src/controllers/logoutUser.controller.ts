import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { options } from "../utils/constants";
import { prisma } from "../utils/db"

export const logoutUser = asyncHandler(async (req, res) => {

  try {
    const user_id = req.cookies?.user_id;
    if (user_id) throw new ApiError(401, "Unauthorized");

    await prisma.user.update({
      where: { user_id: Number(user_id) },
      data: { refreshToken: null },
    });

    return res
      .status(200)
      .clearCookie("user_id", options)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Loged Out"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal server error during logout")
  }
});

