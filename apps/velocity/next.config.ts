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
  transpilePackages: ["@repo/zod"] //no use in prod
};

export default nextConfig;
