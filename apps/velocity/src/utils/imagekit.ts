"use server"

import ImageKit from "imagekit";
import { NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PRIVATE_KEY } from "@/utils/constants"

const imagekit = new ImageKit({
  publicKey: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
