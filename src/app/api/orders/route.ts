import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createBookOrder, type CreateOrderItemPayload } from "@/features/cart-server";

type OrderRequestBody = {
  items?: unknown;
  customerPhone?: unknown;
  customerName?: unknown;
  customerEmail?: unknown;
  province?: unknown;
  city?: unknown;
  township?: unknown;
  shippingAddress?: unknown;
  note?: unknown;
  recaptchaToken?: unknown;
};

type OrderLocationPayload = {
  id: string;
  name: string;
};

function toOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toOrderLocation(value: unknown): OrderLocationPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    id?: unknown;
    name?: unknown;
  };

  const id = toOptionalString(candidate.id);
  const name = toOptionalString(candidate.name);

  if (!id || !name) {
    return null;
  }

  return { id, name };
}

function toOrderLocationOrLegacyString(value: unknown): OrderLocationPayload | null {
  const location = toOrderLocation(value);

  if (location) {
    return location;
  }

  const legacyValue = toOptionalString(value);
  return legacyValue ? { id: legacyValue, name: legacyValue } : null;
}

function toBookId(cartProductId: string): string {
  const normalized = cartProductId.startsWith("book:") ? cartProductId.slice(5) : cartProductId;
  const [bookId] = normalized.split(":");
  return bookId?.trim() ?? "";
}

function toOrderItems(input: unknown): CreateOrderItemPayload[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((rawItem) => {
      if (!rawItem || typeof rawItem !== "object") {
        return null;
      }

      const candidate = rawItem as {
        bookId?: unknown;
        cartProductId?: unknown;
        qty?: unknown;
        quantity?: unknown;
      };

      const bookIdValue =
        toOptionalString(candidate.bookId) ??
        (toOptionalString(candidate.cartProductId)
          ? toBookId(toOptionalString(candidate.cartProductId)!)
          : null);
      const qtyValue =
        typeof candidate.qty === "number" && Number.isInteger(candidate.qty) && candidate.qty > 0
          ? candidate.qty
          : typeof candidate.quantity === "number" &&
              Number.isInteger(candidate.quantity) &&
              candidate.quantity > 0
            ? candidate.quantity
            : null;

      if (!bookIdValue || !qtyValue) {
        return null;
      }

      return {
        bookId: bookIdValue,
        qty: qtyValue,
      } satisfies CreateOrderItemPayload;
    })
    .filter((item): item is CreateOrderItemPayload => Boolean(item));
}

export async function POST(request: NextRequest) {
  const session = await auth();

  let body: OrderRequestBody;

  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const items = toOrderItems(body.items);
  const customerName = toOptionalString(body.customerName) ?? toOptionalString(session?.user?.name);
  const customerPhone =
    toOptionalString(body.customerPhone) ?? toOptionalString(session?.user?.phoneNumber);
  const customerEmail =
    toOptionalString(body.customerEmail) ?? toOptionalString(session?.user?.email);
  const province = toOrderLocationOrLegacyString(body.province);
  const city = toOrderLocationOrLegacyString(body.city);
  const township = toOrderLocationOrLegacyString(body.township);
  const shippingAddress = toOptionalString(body.shippingAddress);
  const note = toOptionalString(body.note) ?? undefined;
  const recaptchaToken = toOptionalString(body.recaptchaToken);

  if (!recaptchaToken) {
    return NextResponse.json(
      {
        error: true,
        code: "captcha",
        message: "Human verification is required.",
      },
      { status: 400 },
    );
  }

  if (!items.length || !customerName || !customerPhone || !province || !city || !shippingAddress) {
    return NextResponse.json(
      {
        error: true,
        message: "Missing required order fields.",
      },
      { status: 400 },
    );
  }

  const orderResult = await createBookOrder(session?.user?.authToken, {
    userId: session?.user?.id,
    items,
    customerPhone,
    customerName,
    customerEmail: customerEmail ?? undefined,
    province,
    city,
    township: township ?? undefined,
    shippingAddress,
    note,
    recaptchaToken,
  });

  if (!orderResult.ok) {
    return NextResponse.json(
      {
        error: true,
        code: orderResult.code,
        message: orderResult.message,
      },
      { status: orderResult.statusCode },
    );
  }

  return NextResponse.json({
    error: false,
    message: orderResult.message,
    data: orderResult.data,
  });
}
