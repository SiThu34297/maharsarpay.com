import { NextRequest, NextResponse } from "next/server";

import {
  parseBookReviewListQueryFromSearchParams,
  searchBookReviews,
} from "@/features/book-reviews";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("lang") ?? defaultLocale;
  const locale = hasLocale(localeParam) ? localeParam : defaultLocale;
  const query = parseBookReviewListQueryFromSearchParams(request.nextUrl.searchParams);

  const response = await searchBookReviews(locale, query);

  return NextResponse.json(response);
}
