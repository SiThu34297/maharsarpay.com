import { NextRequest, NextResponse } from "next/server";

import { parseBookListQueryFromSearchParams, searchBooks } from "@/features/books";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("lang") ?? defaultLocale;
  const locale = hasLocale(localeParam) ? localeParam : defaultLocale;
  const query = parseBookListQueryFromSearchParams(request.nextUrl.searchParams);

  const response = await searchBooks(locale, query);

  return NextResponse.json(response);
}
