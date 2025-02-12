import { Request, Response } from "express";
import { prisma, asyncHandler, ApiError, ApiResponse } from "../utils/index";
import { usernameSchema } from "@repo/zod";

export const checkUsername = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = usernameSchema.safeParse(req.query);

    if (!validation.success) throw new ApiError(400, "Validation failed");

    const { username } = validation.data;

    try {
      const user = await prisma.user.findUnique({
        where: { username: username.trim() },
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { available: user === null },
            "Username availability check successful",
          ),
        );
    } catch (error) {
      throw new ApiError(500, "Internal server error while checking username");
    }
  },
);
