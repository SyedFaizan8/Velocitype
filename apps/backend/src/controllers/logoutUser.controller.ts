import {
  prisma,
  ApiError,
  ApiResponse,
  asyncHandler,
  options,
} from "../utils/index";

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const user_id = req.cookies?.user_id;
    if (!user_id) throw new ApiError(401, "Unauthorized");

    await prisma.user.update({
      where: { user_id },
      data: { refreshToken: null },
    });

    return res
      .status(200)
      .clearCookie("user_id", options)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Loged Out"));
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while logout");
  }
});
