const DEFAULT_SITE_URL = "https://maharsarpay.com";

function normalizeSiteUrl(input: string): string {
  const trimmed = input.trim();
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export const siteConfig = {
  name: "maharsarpay.com",
  title: "Mahar Sar Pay",
  description: "Modern bookstore homepage for Mahar Sar Pay.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL),
} as const;
