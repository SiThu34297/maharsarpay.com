import { NextRequest, NextResponse } from "next/server";

import { parseMultimediaListQueryFromSearchParams, searchMultimedia } from "@/features/multimedia";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("lang") ?? defaultLocale;
  const locale = hasLocale(localeParam) ? localeParam : defaultLocale;
  const query = parseMultimediaListQueryFromSearchParams(request.nextUrl.searchParams);

  const response = await searchMultimedia(locale, query);

  return NextResponse.json(response);
}
