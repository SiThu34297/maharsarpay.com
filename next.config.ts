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
    ],
  },
};

export default nextConfig;
