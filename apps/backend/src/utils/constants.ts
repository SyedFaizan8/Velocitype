export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const SALT_ROUNDS = 10;

export const options = {
  httpOnly: true,
  secure: true,
};
