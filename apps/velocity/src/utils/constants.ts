export const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
export const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY as string;

export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY as string
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY as string
export const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT as string

export const ACCESS_SECRET = process.env.ACCESS_SECRET as string
export const REFRESH_SECRET = process.env.REFRESH_SECRET as string

export const SALT_ROUNDS = 12;

export const USERS_PER_PAGE = 50;

export const TEST_DURATION: number = 15;

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string