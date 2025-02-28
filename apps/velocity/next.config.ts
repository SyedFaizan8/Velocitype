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
  reactStrictMode: false,
  ...(process.env.NODE_ENV === "development" && { transpilePackages: ["@repo/zod"] }),
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
