import ImageKit from "imagekit";
import { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PRIVATE_KEY } from "@/utils/constants"

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
