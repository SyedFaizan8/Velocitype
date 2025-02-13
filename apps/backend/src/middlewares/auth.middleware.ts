import { NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma, ApiError, asyncHandler, ACCESS_SECRET } from "../utils/index";

export interface AuthRequest extends Request {
  user?: { user_id: string };
}

export const verifyJWT = asyncHandler(
  async (req: AuthRequest, _, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!token) throw new ApiError(401, "Unauthorized Request");

      const decodedToken = jwt.verify(token, ACCESS_SECRET) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { user_id: decodedToken.user_id },
        select: { user_id: true },
      });

      if (!user) throw new ApiError(401, "Invalid Access Token");

      req.user = { user_id: user.user_id };

      next();
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(401, "Invalid access token");
    }
  },
);
