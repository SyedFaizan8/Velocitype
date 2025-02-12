import { Request, Response } from "express";
import { prisma, asyncHandler, ApiError, ApiResponse } from "../utils/index";
import { emailSchema } from "@repo/zod";

export const checkEmail = asyncHandler(async (req: Request, res: Response) => {
  const validation = emailSchema.safeParse(req.query);

  if (!validation.success) throw new ApiError(400, "Validation failed");

  const { email } = validation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { available: user === null },
          "email availability check successful",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Internal server error while checking username");
  }
});
