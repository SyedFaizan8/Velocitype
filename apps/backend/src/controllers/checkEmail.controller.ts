import express, { Request, Response } from "express";
import { prisma } from "../utils/db";
import { asyncHandler } from "src/utils/asyncHandler";
import { ApiError } from "src/utils/ApiError";

const checkEmail = asyncHandler(async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;

    if (!username)
      return res.status(400).json({ message: "Username is required" });
    // throw new ApiError(400, "Username is required");

    // const existingUser = await prisma.user.findUnique({
    //     where: { username },
    // });

    // res.json({ available: !existingUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default checkEmail;
