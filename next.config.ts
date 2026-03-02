import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === "development",
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
