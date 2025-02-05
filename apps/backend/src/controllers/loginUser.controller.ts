import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import {
  comparePassword,
  generateAccessAndRefereshTokens,
} from "@/utils/userAuth";
import { loginSchema } from "@repo/zod";
import { Request, Response } from "express";

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  //send cookie

  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success)
    return new ApiError(400, "email and password must be required");
  console.log(`validationResult in loginUser route ${validationResult}`);

  const { email, password } = validationResult.data;

  // TODO: find User and take userID and password out to compare
  // const user = await User.findOne({
  //   $or: [{ username }, { email }]
  // })
  // if (!user) {
  //   throw new ApiError(404, "User does not exist")
  // }

  const hashedPassword = "lskfj"; // remove this later, this is came after searching user and taking its password out
  const isMatch = await comparePassword(password, hashedPassword);
  if (!isMatch) throw new ApiError(401, "Invalid user credentials");

  const userId = "alsfd"; // remove this later
  const { accessToken, refreshToken } =
    await generateAccessAndRefereshTokens(userId);

  // TODO: find user without password and refresh token
  // const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true,
  };

  const logedInUser = "dfskljf"; // TODO: remove this later
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: logedInUser, accessToken, refreshToken },
        "User Logged In successfully",
      ),
    );
});

export default loginUser;
