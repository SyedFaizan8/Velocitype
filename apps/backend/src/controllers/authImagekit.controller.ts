import { asyncHandler, ApiError, ApiResponse } from "../utils/index";
import imagekit from "../utils/imagekit";

export const authImagekit = asyncHandler(async (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res
      .status(200)
      .json(
        new ApiResponse(200, authParams, "Imagekit authentication successfull"),
      );
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while ImageKit authentication");
  }
});
