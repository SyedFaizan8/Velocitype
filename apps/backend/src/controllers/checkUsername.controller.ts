import { Request, Response } from "express";
import { prisma } from "../utils/db";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { usernameSchema } from "@repo/zod";
import { ApiResponse } from "../utils/ApiResponse";

export const checkUsername = asyncHandler(async (req: Request, res: Response) => {

  const validation = usernameSchema.safeParse(req.query);

  if (!validation.success) throw new ApiError(400, 'Validation failed')

  const { username } = validation.data;

  try {
    const user = await prisma.user.findUnique({ where: { username } }); //user is null
    return res.status(200).json(new ApiResponse(200, { available: user === null }, 'Username availability check successful'));

  } catch (error) {
    throw new ApiError(500, 'Internal server error while checking username');
  }

});
