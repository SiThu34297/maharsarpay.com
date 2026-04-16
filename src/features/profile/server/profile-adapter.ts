import "server-only";

import type { Session } from "next-auth";

import type { Locale } from "@/lib/i18n";

import type { ProfileOrder, ProfileSummary } from "@/features/profile/schemas/profile";

type SessionUser = Session["user"];

const defaultAvatar = "/images/home/real/authors/author-1.jpg";

const ordersByEmail: Record<string, ProfileOrder[]> = {
  "reader@maharsarpay.com": [
    {
      id: "ord-1001",
      orderNumber: "MS-1001",
      placedAt: "2026-04-11T09:30:00.000Z",
      status: "shipped",
      totalAmount: 36800,
      items: [
        { id: "book-atomic-habits", title: "Atomic Habits", quantity: 1 },
        { id: "book-midnight-library", title: "The Midnight Library", quantity: 1 },
      ],
    },
    {
      id: "ord-1002",
      orderNumber: "MS-1002",
      placedAt: "2026-04-14T12:15:00.000Z",
      status: "processing",
      totalAmount: 19800,
      items: [{ id: "book-deep-work", title: "Deep Work", quantity: 1 }],
    },
  ],
};

function getFallbackName(locale: Locale): string {
  return locale === "my" ? "စာဖတ်သူ" : "Reader";
}

export async function getProfileSummary(
  locale: Locale,
  user: SessionUser,
): Promise<ProfileSummary> {
  return {
    name: user?.name?.trim() || getFallbackName(locale),
    email: user?.email?.trim() || "unknown@maharsarpay.com",
    imageSrc: user?.image || defaultAvatar,
  };
}

export async function getOrderHistory(user: SessionUser): Promise<ProfileOrder[]> {
  const email = user?.email?.toLowerCase();

  if (!email) {
    return [];
  }

  return ordersByEmail[email] ?? [];
}
