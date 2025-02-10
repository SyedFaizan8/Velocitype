import { Request, Response } from "express";
import { loginSchema } from "@repo/zod";

import {
  prisma,
  ApiError,
  ApiResponse,
  asyncHandler,
  options,
  comparePassword,
  generateAccessAndRefereshTokens,
} from "../utils/index";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success)
      throw new ApiError(400, "email and password must be required");

    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        password: true,
        username: true,
        imageUrl: true,
      },
    });
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user.user_id,
    );
    const { password: _, ...userIdFullname } = user;

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, userIdFullname, "User logged in successfully"),
      );
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while login user");
  }
});
