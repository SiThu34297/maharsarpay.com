import { NextRequest, NextResponse } from "next/server";

import { parseAuthorListQueryFromSearchParams, searchAuthors } from "@/features/authors";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("lang") ?? defaultLocale;
  const locale = hasLocale(localeParam) ? localeParam : defaultLocale;
  const query = parseAuthorListQueryFromSearchParams(request.nextUrl.searchParams);

  const response = await searchAuthors(locale, query);

  return NextResponse.json(response);
}
