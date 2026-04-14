import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, hasLocale } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && hasLocale(firstSegment)) {
    if (firstSegment === defaultLocale) {
      return;
    }

    const remainderPath = segments.slice(1).join("/");
    request.nextUrl.pathname = remainderPath
      ? `/${defaultLocale}/${remainderPath}`
      : `/${defaultLocale}`;
    return NextResponse.redirect(request.nextUrl);
  }

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
