import { ApiError } from "./ApiError";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/db";
import { ACCESS_SECRET, REFRESH_SECRET, SALT_ROUNDS } from "./constants";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAcessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "10d" });
};

export const generateAccessAndRefereshTokens = async (userId: number) => {
  try {
    const accessToken = generateAcessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const user = await prisma.user.update({
      where: { user_id: userId },
      data: { refreshToken },
    });

    if (!user) throw new ApiError(500, "user didnt find to add refresh token");

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
    );
  }
};
