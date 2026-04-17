import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants/site";

const blockedPaths = [
  "/api/",
  "/my/login",
  "/my/register",
  "/my/profile",
  "/my/cart",
  "/en/login",
  "/en/register",
  "/en/profile",
  "/en/cart",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: blockedPaths,
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
