import { NextRequest, NextResponse } from "next/server";

import { fetchTownships } from "@/features/cart-server";

export async function GET(request: NextRequest) {
  const provinceId = request.nextUrl.searchParams.get("provinceId") ?? undefined;
  const cityId = request.nextUrl.searchParams.get("cityId") ?? undefined;

  try {
    const data = await fetchTownships({ provinceId, cityId });
    return NextResponse.json({ items: data });
  } catch {
    return NextResponse.json(
      {
        items: [],
        message: "Unable to fetch townships.",
      },
      { status: 500 },
    );
  }
}
