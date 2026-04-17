import "server-only";

const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const ORDERS_ENDPOINT = "/api/web/orders";

export type CreateOrderItemPayload = {
  bookId: string;
  qty: number;
};

export type CreateOrderPayload = {
  userId: string;
  items: CreateOrderItemPayload[];
  customerPhone: string;
  customerName: string;
  shippingAddress: string;
  note?: string;
};

type CreateOrderResult =
  | {
      ok: true;
      message: string;
      data: unknown;
    }
  | {
      ok: false;
      statusCode: number;
      message: string;
    };

type BackendOrderResponse = {
  error?: boolean;
  message?: unknown;
  statusCode?: unknown;
  data?: unknown;
};

function toMessage(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function toStatusCode(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function createBookOrder(
  authToken: string,
  payload: CreateOrderPayload,
): Promise<CreateOrderResult> {
  try {
    const response = await fetch(`${BOOK_API_BASE_URL}${ORDERS_ENDPOINT}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const body = (await parseJson(response)) as BackendOrderResponse | null;
    const message = toMessage(body?.message, "Unable to place order.");
    const statusCode = toStatusCode(body?.statusCode, response.status || 500);

    if (!response.ok || body?.error) {
      return {
        ok: false,
        statusCode,
        message,
      };
    }

    return {
      ok: true,
      message,
      data: body?.data ?? null,
    };
  } catch {
    return {
      ok: false,
      statusCode: 500,
      message: "Unable to connect to order service.",
    };
  }
}
