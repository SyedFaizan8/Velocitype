import jwt, { JwtPayload } from "jsonwebtoken";
import {
  prisma,
  ApiError,
  ApiResponse,
  asyncHandler,
  options,
  REFRESH_SECRET,
  generateAccessAndRefereshTokens,
} from "../utils/index";

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      REFRESH_SECRET,
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { user_id: decodedToken.user_id },
    });
    if (!user) throw new ApiError(401, "User not found with the refresh token");
    if (incomingRefreshToken !== user?.refreshToken)
      throw new ApiError(401, "Refresh token is expired or used");

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user.user_id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while refreshing token");
  }
});
