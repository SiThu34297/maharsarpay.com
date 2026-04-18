import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createBookOrder, type CreateOrderItemPayload } from "@/features/cart-server";

type OrderRequestBody = {
  items?: unknown;
  customerPhone?: unknown;
  customerName?: unknown;
  shippingAddress?: unknown;
  note?: unknown;
  recaptchaToken?: unknown;
};

function toOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
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

  if (!session?.user?.id || !session.user.authToken) {
    return NextResponse.json(
      {
        error: true,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

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
  const customerName = toOptionalString(body.customerName) ?? toOptionalString(session.user.name);
  const customerPhone =
    toOptionalString(body.customerPhone) ?? toOptionalString(session.user.phoneNumber);
  const shippingAddress =
    toOptionalString(body.shippingAddress) ?? toOptionalString(session.user.address);
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

  if (!items.length || !customerName || !customerPhone || !shippingAddress) {
    return NextResponse.json(
      {
        error: true,
        message: "Missing required order fields.",
      },
      { status: 400 },
    );
  }

  const orderResult = await createBookOrder(session.user.authToken, {
    userId: session.user.id,
    items,
    customerPhone,
    customerName,
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
