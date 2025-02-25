import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: ""
      }
    ]
  },
  ...(process.env.NODE_ENV === "development" && { transpilePackages: ["@repo/zod"] }),
  reactStrictMode: false,
  // transpilePackages: ["@repo/zod"] //no use in prod
};

export default nextConfig;
