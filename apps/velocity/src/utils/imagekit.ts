import ImageKit from "imagekit";
import { IMAGEKIT_PRIVATE_KEY, NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT } from "@/utils/constants"

const imagekit = new ImageKit({
  publicKey: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
