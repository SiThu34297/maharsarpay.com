import "server-only";

import type { Session } from "next-auth";

import type { Locale } from "@/lib/i18n";

import type { ProfilePageData } from "@/features/profile/schemas/profile";
import { getOrderHistory, getProfileSummary } from "@/features/profile/server/profile-adapter";

type SessionUser = Session["user"];

export async function getProfilePageData(
  locale: Locale,
  user: SessionUser,
): Promise<ProfilePageData> {
  const [profile, orders] = await Promise.all([
    getProfileSummary(locale, user),
    getOrderHistory(user),
  ]);

  return {
    profile,
    orders,
  };
}
