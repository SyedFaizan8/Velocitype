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
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  transpilePackages: ["@repo/zod", "@repo/db"],
};

export default nextConfig;
