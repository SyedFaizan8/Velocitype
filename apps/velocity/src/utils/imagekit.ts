import ImageKit from "imagekit";
import { NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT } from "@/utils/constants"

const imagekit = new ImageKit({
  publicKey: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: "private_2zAIAzdngE7zPnioYH99n1L91uY=",
  urlEndpoint: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
