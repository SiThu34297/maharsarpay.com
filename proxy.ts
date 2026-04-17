import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, hasLocale } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").find(Boolean);

  if (firstSegment && hasLocale(firstSegment)) {
    return;
  }

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [String.raw`/((?!_next|api|.*\..*).*)`],
};
