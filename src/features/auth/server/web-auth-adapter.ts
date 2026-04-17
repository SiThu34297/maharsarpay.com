import "server-only";

import type {
  WebAuthBackendUser,
  WebAuthLoginPayload,
  WebAuthRegisterPayload,
  WebAuthResult,
} from "@/features/auth/schemas/web-auth";

const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const REGISTER_ENDPOINT = "/api/web/users/auth/register";
const LOGIN_ENDPOINT = "/api/web/users/auth/login";

type AuthMode = "register" | "login";

type WebAuthApiResponse = {
  error?: boolean;
  message?: unknown;
  statusCode?: unknown;
  data?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function toOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toOptionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeAuthUser(input: unknown): WebAuthBackendUser | null {
  if (!isRecord(input)) {
    return null;
  }

  const id = toOptionalString(input.id);
  const email = toOptionalString(input.email);
  const authToken = toOptionalString(input.authToken);

  if (!id || !email || !authToken) {
    return null;
  }

  return {
    id,
    email,
    loginType: toOptionalString(input.loginType),
    name: toOptionalString(input.name),
    phoneNumber: toOptionalString(input.phoneNumber),
    address: toOptionalString(input.address),
    avatarUrl: toOptionalString(input.avatarUrl),
    googleId: toOptionalString(input.googleId),
    authProvider: toOptionalString(input.authProvider),
    emailVerified: toBoolean(input.emailVerified),
    active: toOptionalNumber(input.active),
    deletedStatus: toOptionalNumber(input.deletedStatus),
    authToken,
    lastLoginAt: toOptionalString(input.lastLoginAt),
    createdAt: toOptionalString(input.createdAt),
    updatedAt: toOptionalString(input.updatedAt),
  };
}

function toStatusCode(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toMessage(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function resolveErrorCode(statusCode: number, message: string, mode: AuthMode): WebAuthResult {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email already in use")) {
    return {
      ok: false,
      code: "email_in_use",
      message,
      statusCode,
    };
  }

  if (
    normalizedMessage.includes("missing") ||
    normalizedMessage.includes("required") ||
    normalizedMessage.includes("invalid payload")
  ) {
    return {
      ok: false,
      code: "missing_fields",
      message,
      statusCode,
    };
  }

  if (statusCode === 401 || statusCode === 403) {
    return {
      ok: false,
      code: mode === "login" ? "invalid_credentials" : "unauthorized",
      message,
      statusCode,
    };
  }

  if (mode === "login" && normalizedMessage.includes("invalid")) {
    return {
      ok: false,
      code: "invalid_credentials",
      message,
      statusCode,
    };
  }

  return {
    ok: false,
    code: "unknown",
    message,
    statusCode,
  };
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function sendAuthRequest(
  endpoint: string,
  payload: WebAuthLoginPayload | WebAuthRegisterPayload,
  mode: AuthMode,
): Promise<WebAuthResult> {
  try {
    const response = await fetch(`${BOOK_API_BASE_URL}${endpoint}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = (await parseJson(response)) as WebAuthApiResponse | null;
    const message = toMessage(body?.message, "Unable to complete authentication request.");
    const statusCode = toStatusCode(body?.statusCode, response.status || 500);

    if (!response.ok || body?.error) {
      return resolveErrorCode(statusCode, message, mode);
    }

    const user = normalizeAuthUser(body?.data);

    if (!user) {
      return {
        ok: false,
        code: "unknown",
        message: "Authentication response payload is invalid.",
        statusCode,
      };
    }

    return {
      ok: true,
      message,
      user,
    };
  } catch {
    return {
      ok: false,
      code: "unknown",
      message: "Unable to connect to authentication service.",
      statusCode: 500,
    };
  }
}

export async function registerWithEmail(payload: WebAuthRegisterPayload): Promise<WebAuthResult> {
  return sendAuthRequest(REGISTER_ENDPOINT, payload, "register");
}

export async function loginWithEmail(payload: WebAuthLoginPayload): Promise<WebAuthResult> {
  return sendAuthRequest(LOGIN_ENDPOINT, payload, "login");
}
