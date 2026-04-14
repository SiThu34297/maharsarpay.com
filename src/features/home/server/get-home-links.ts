import type { HomeLink } from "@/features/home/schemas/home";

export async function getHomeLinks(): Promise<HomeLink[]> {
  return [
    {
      href: "https://nextjs.org/docs",
      label: "Read Next.js 16 docs",
      external: true,
    },
    {
      href: "https://nextjs.org/learn",
      label: "Continue with the App Router course",
      external: true,
    },
  ];
}
