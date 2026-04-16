import { NextRequest, NextResponse } from "next/server";

import { parseCategoryListQueryFromSearchParams, searchCategories } from "@/features/categories";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("lang") ?? defaultLocale;
  const locale = hasLocale(localeParam) ? localeParam : defaultLocale;
  const query = parseCategoryListQueryFromSearchParams(request.nextUrl.searchParams);

  const response = await searchCategories(locale, query);

  return NextResponse.json(response);
}
