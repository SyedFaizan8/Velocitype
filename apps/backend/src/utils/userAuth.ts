import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  prisma,
  ApiError,
  ACCESS_SECRET,
  REFRESH_SECRET,
  SALT_ROUNDS,
} from "./index";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAcessToken = (user_id: string) => {
  return jwt.sign({ user_id }, ACCESS_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (user_id: string) => {
  return jwt.sign({ user_id }, REFRESH_SECRET, { expiresIn: "10d" });
};

export const generateAccessAndRefereshTokens = async (user_id: string) => {
  try {
    const accessToken = generateAcessToken(user_id);
    const refreshToken = generateRefreshToken(user_id);

    const user = await prisma.user.update({
      where: { user_id },
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
