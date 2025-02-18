import { ApiError } from "./apiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const SALT_ROUNDS = 12;

const ACCESS_SECRET = process.env.ACCESS_SECRET as string
const REFRESH_SECRET = process.env.REFRESH_SECRET as string

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
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


export const generateAccessAndRefreshToken = async (user_id: string) => {
    try {
        const accessToken = generateAcessToken(user_id);
        const refreshToken = generateRefreshToken(user_id);

        const user = await prisma.user.update({
            where: { user_id },
            data: { refreshToken },
        });
        if (!user) throw new ApiError(500, "user didnt find to add refresh token");

        return { accessToken, refreshToken };
    } catch {
        throw new ApiError(
            500,
            "Something went wrong while generating referesh and access token",
        );
    }
};


export const getUserIdFromRequest = async (request: NextRequest): Promise<string | null> => {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        if (typeof decoded !== 'object' || decoded === null || !('user_id' in decoded)) {
            return null;
        }

        const user_id = String((decoded as JwtPayload).user_id);

        const user = await prisma.user.findUnique({
            where: { user_id },
            select: { user_id: true },
        });

        return user ? user.user_id : null;

    } catch {
        return null;
    }
}