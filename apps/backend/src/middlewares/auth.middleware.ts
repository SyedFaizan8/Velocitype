import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { ACCESS_SECRET } from "../utils/constants";
import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/db";

const verifyJWT = asyncHandler(async (req: Request, _, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized Request");

    const decodedToken: any = jwt.verify(token, ACCESS_SECRET);

    const user = await prisma.user.findUnique({
      where: { user_id: decodedToken.user_id },
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

    if (!user) throw new ApiError(401, "Invalid Access Token");

    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid access token");
  }
});

export default verifyJWT;
