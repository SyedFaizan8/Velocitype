import { ApiError } from "./ApiError"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "src/utils/db"
import { ACCESS_SECRET, REFRESH_SECRET, SALT_ROUNDS } from "./constants";

// TODO: hashing password
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })
// PRISMA
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateAcessToken = (userId: string) => {
    return jwt.sign(
        { userId },
        ACCESS_SECRET,
        { expiresIn: "1d" }
    );
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign(
        { userId },
        REFRESH_SECRET,
        { expiresIn: "10d" }
    );
}


export const generateAccessAndRefereshTokens = async (userId: string) => {

    try {
        const accessToken = generateAcessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        // TODO: push in users database of refreshToken 
        // user.refreshToken = refreshToken
        // await user.save({ validateBeforeSave: false })
        // PRISMA
        // await prisma.user.update({
        //     where: { id: userId },
        //     data: { refreshToken },
        // });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }

}