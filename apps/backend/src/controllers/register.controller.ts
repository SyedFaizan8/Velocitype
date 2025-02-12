import { Request, Response } from "express";
import { registerSchema } from "@repo/zod";

import {
  prisma,
  ApiError,
  asyncHandler,
  ApiResponse,
  hashPassword,
} from "../utils/index";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success)
        throw new ApiError(400, validationResult.error.errors[0].message);

      const { fullname, username, email, password, confirmPassword } =
        validationResult.data;
      if (password !== confirmPassword)
        throw new ApiError(400, "Passwords do not match");

      const existingUserwithEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUserwithEmail)
        throw new ApiError(409, "User with email already exists");
      const existingUserwithUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUserwithUsername)
        throw new ApiError(409, "User with username already exists");

      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          fullname,
          username,
          email,
          password: hashedPassword,
        },
        select: { user_id: true },
      });

      if (!newUser)
        throw new ApiError(
          500,
          "Something went wrong while registering the user",
        );

      const dataCreated = await prisma.totalStatistics.create({
        data: {
          user_id: newUser.user_id,
          total_tests_taken: 0,
          total_letters_typed: 0,
          total_words_typed: 0,
        },
      });

      if (!dataCreated)
        throw new ApiError(
          500,
          "Something went wrong when creating a data while registering user",
        );

      return res
        .status(201)
        .json(new ApiResponse(200, "User registered Successfully"));
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, "Internal server error during user registration");
    }
  },
);
