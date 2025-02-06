import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { registerSchema } from "@repo/zod";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../utils/db";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../utils/constants";
import { hashPassword } from "../utils/userAuth";

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

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser)
        throw new ApiError(409, "User with email already exists");

      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          fullname,
          username,
          email,
          password: hashedPassword,
        },
        select: {
          user_id: true,
          fullname: true,
          username: true,
          email: true,
          bio: true,
          twitter: true,
          instagram: true,
          website: true,
          created_at: true,
        },
      });

      if (!newUser)
        throw new ApiError(
          500,
          "Something went wrong while registering the user",
        );

      return res
        .status(201)
        .json(new ApiResponse(200, newUser, "User registered Successfully"));
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Internal server error during user registration");
    }
  },
);
