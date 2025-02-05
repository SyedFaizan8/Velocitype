import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { REFRESH_SECRET } from "@/utils/constants";
import { generateAccessAndRefereshTokens } from "@/utils/userAuth";
import jwt from "jsonwebtoken";

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_SECRET);

    //TODO: find user by decoded.userId
    // if(!userId) throw new ApiError(401, "Invalid refresh token")

    // if (incomingRefreshToken !== user?.refreshToken) {
    //     throw new ApiError(401, "Refresh token is expired or used")
    // }

    const options = {
      httpOnly: true,
      secure: true,
    };
    // TODO: user.id is userId remove this later;
    const userId = "fjlsjfl";
    const { accessToken, refreshToken } =
      await generateAccessAndRefereshTokens(userId);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed",
        ), // refreshToken is new Refresh token
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token"); //TODO: fix error.message
  }
});

export default refreshAccessToken;
