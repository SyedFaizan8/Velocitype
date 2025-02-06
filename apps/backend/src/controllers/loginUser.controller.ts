import { Request, Response } from "express";
import { loginSchema } from "@repo/zod";

import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { prisma } from "../utils/db";
import { options } from "../utils/constants";

import {
  comparePassword,
  generateAccessAndRefereshTokens,
} from "../utils/userAuth";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {

  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) throw new ApiError(400, "email and password must be required");

    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        password: true,
        fullname: true,
        username: true,
        email: true,
        bio: true,
        twitter: true,
        instagram: true,
        website: true,
        created_at: true
      }
    });
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await comparePassword(password, user.password); ``
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.user_id);
    const { password: _, ...userWithoutPassword } = user;

    return res
      .status(200)
      .cookie("user_id", userWithoutPassword.user_id, {
        ...options,
        sameSite: "strict",
      })
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: userWithoutPassword, accessToken, refreshToken },
          "User logged in successfully"
        )
      )

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal server error during login");
  }

});

