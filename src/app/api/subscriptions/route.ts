import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, hasLocale } from "@/lib/i18n";

const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const SUBSCRIPTIONS_ENDPOINT = "/api/web/subscriptions";

type SubscriptionRequestBody = {
  authors?: unknown;
  name?: unknown;
  phone?: unknown;
  address?: unknown;
  recaptchaToken?: unknown;
  lang?: unknown;
};

type BackendSubscriptionResponse = {
  error?: unknown;
  authorized?: unknown;
  message?: unknown;
  data?: unknown;
};

function toOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export async function POST(request: NextRequest) {
  let body: SubscriptionRequestBody;

  try {
    body = (await request.json()) as SubscriptionRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const authors = toOptionalString(body.authors);
  const phone = toOptionalString(body.phone);
  const name = toOptionalString(body.name);
  const address = toOptionalString(body.address);
  const recaptchaToken = toOptionalString(body.recaptchaToken);
  const langParam = toOptionalString(body.lang) ?? defaultLocale;
  const locale = hasLocale(langParam) ? langParam : defaultLocale;

  if (!authors || !phone || !recaptchaToken) {
    return NextResponse.json(
      {
        error: true,
        message: "authors, phone, and recaptchaToken are required.",
      },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(`${BOOK_API_BASE_URL}${SUBSCRIPTIONS_ENDPOINT}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authors,
      name: name ?? "",
      phone,
      address: address ?? "",
      recaptchaToken,
    }),
  });

  let payload: BackendSubscriptionResponse | null = null;

  try {
    payload = (await upstreamResponse.json()) as BackendSubscriptionResponse;
  } catch {
    payload = null;
  }

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        error: true,
        message:
          typeof payload?.message === "string" && payload.message.trim().length > 0
            ? payload.message
            : "Subscription request failed.",
      },
      { status: upstreamResponse.status },
    );
  }

  if (payload?.error === true || payload?.authorized === false) {
    return NextResponse.json(
      {
        error: true,
        message:
          typeof payload?.message === "string" && payload.message.trim().length > 0
            ? payload.message
            : "Subscription request failed.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message:
      typeof payload?.message === "string" && payload.message.trim().length > 0
        ? payload.message
        : "Subscription created successfully",
    data: payload?.data ?? null,
  });
}
