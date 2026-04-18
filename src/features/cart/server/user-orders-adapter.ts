import "server-only";

const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const USER_ORDERS_ENDPOINT = "/api/web/orders/user";

export type UserOrderItem = {
  id: string;
  title: string;
  authors: Array<{
    id: string;
    name: string;
  }>;
  quantity: number;
  createdAt: string | null;
};

export type UserOrder = {
  id: string;
  invoiceNo: string;
  orderStatus: string;
  customerName: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  subtotalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  items: UserOrderItem[];
};

type GetUserOrdersResult =
  | {
      ok: true;
      message: string;
      data: UserOrder[];
    }
  | {
      ok: false;
      statusCode: number;
      message: string;
    };

type BackendOrderItem = {
  author?: unknown;
  authors?: unknown;
  id?: unknown;
  bookTitle?: unknown;
  qty?: unknown;
  createdAt?: unknown;
};

type BackendAuthor = {
  id?: unknown;
  name?: unknown;
};

type BackendOrder = {
  id?: unknown;
  invoiceNo?: unknown;
  orderStatus?: unknown;
  customerName?: unknown;
  customerPhone?: unknown;
  shippingAddress?: unknown;
  subtotalAmount?: unknown;
  deliveryFee?: unknown;
  discountAmount?: unknown;
  totalAmount?: unknown;
  items?: unknown;
};

type BackendUserOrdersResponse = {
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

function toString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function toPositiveInteger(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return 0;
  }

  return value;
}

function toAmount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toAuthor(value: unknown): { id: string; name: string } | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as BackendAuthor;
  const name = toString(candidate.name);

  if (!name) {
    return null;
  }

  const id = toString(candidate.id) || "unknown-author";

  return {
    id,
    name,
  };
}

function toAuthors(rawAuthor: unknown, rawAuthors: unknown): Array<{ id: string; name: string }> {
  const fromAuthorsArray = Array.isArray(rawAuthors)
    ? rawAuthors.map(toAuthor).filter((item): item is { id: string; name: string } => Boolean(item))
    : [];

  if (fromAuthorsArray.length > 0) {
    return fromAuthorsArray;
  }

  if (Array.isArray(rawAuthor)) {
    return rawAuthor
      .map(toAuthor)
      .filter((item): item is { id: string; name: string } => Boolean(item));
  }

  const singleAuthor = toAuthor(rawAuthor);
  return singleAuthor ? [singleAuthor] : [];
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function toOrderItems(value: unknown, orderId: string): UserOrderItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as BackendOrderItem;
      const id = toString(candidate.id) || `${orderId}-item-${index + 1}`;
      const title = toString(candidate.bookTitle) || "Untitled item";
      const authors = toAuthors(candidate.author, candidate.authors);
      const quantity = toPositiveInteger(candidate.qty);
      const createdAt = toString(candidate.createdAt) || null;

      return {
        id,
        title,
        authors,
        quantity,
        createdAt,
      } satisfies UserOrderItem;
    })
    .filter((item): item is UserOrderItem => Boolean(item));
}

function toOrders(value: unknown): UserOrder[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as BackendOrder;
      const id = toString(candidate.id);

      if (!id) {
        return null;
      }

      return {
        id,
        invoiceNo: toString(candidate.invoiceNo) || id,
        orderStatus: toString(candidate.orderStatus) || "UNKNOWN",
        customerName: toString(candidate.customerName) || null,
        customerPhone: toString(candidate.customerPhone) || null,
        shippingAddress: toString(candidate.shippingAddress) || null,
        subtotalAmount: toAmount(candidate.subtotalAmount),
        deliveryFee: toAmount(candidate.deliveryFee),
        discountAmount: toAmount(candidate.discountAmount),
        totalAmount: toAmount(candidate.totalAmount),
        items: toOrderItems(candidate.items, id),
      } satisfies UserOrder;
    })
    .filter((order): order is UserOrder => Boolean(order));
}

export async function fetchUserOrders(
  authToken: string,
  userId: string,
): Promise<GetUserOrdersResult> {
  try {
    const response = await fetch(
      `${BOOK_API_BASE_URL}${USER_ORDERS_ENDPOINT}/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    const body = (await parseJson(response)) as BackendUserOrdersResponse | null;
    const message = toMessage(body?.message, "Unable to fetch user orders.");
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
      data: toOrders(body?.data),
    };
  } catch {
    return {
      ok: false,
      statusCode: 500,
      message: "Unable to connect to order service.",
    };
  }
}
