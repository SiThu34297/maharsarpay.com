import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["192.168.1.37"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sabahnapublishers.sgp1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "maharsarpay.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
