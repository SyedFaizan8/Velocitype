import { ApiResponse } from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";

const logoutUser = asyncHandler(async (req, res) => {
  //TODO: find user by id and remove the refreshToken

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Loged Out"));
});

export default logoutUser;
