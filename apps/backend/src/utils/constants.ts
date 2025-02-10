export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const SALT_ROUNDS = 10;

export const options = {
  httpOnly: true,
  secure: true,
};

export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY as string;

export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY as string;

export const IMAGEKIT_URL_ENDPOINT = process.env
  .IMAGEKIT_URL_ENDPOINT as string;
