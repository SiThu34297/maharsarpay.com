import { NextResponse } from "next/server";

import { fetchProvinces } from "@/features/cart-server";

export async function GET() {
  try {
    const data = await fetchProvinces();
    return NextResponse.json({ items: data });
  } catch {
    return NextResponse.json(
      {
        items: [],
        message: "Unable to fetch provinces.",
      },
      { status: 500 },
    );
  }
}
