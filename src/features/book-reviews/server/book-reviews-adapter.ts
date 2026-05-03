import "server-only";

import sanitizeHtml from "sanitize-html";

import type {
  AppliedBookReviewFilters,
  BackendBookReviewRecord,
  BackendBookReviewResponse,
  BackendBookReviewsResponse,
  BookReviewDetail,
  BookReviewListItem,
  BookReviewListQuery,
  BookReviewListResponse,
} from "@/features/book-reviews/schemas/book-reviews";
import type { Locale } from "@/lib/i18n";

const BOOK_REVIEWS_ENDPOINT = "/api/web/book-reviews";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const FALLBACK_BOOK_COVER_SRC = "/images/home/real/books/book-1.jpg";
type RawSearchParams = Record<string, string | string[] | undefined>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseTotalCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.floor(value));
}

function extractTotalCount(payload: Partial<BackendBookReviewsResponse>): number | null {
  const candidateTotals: unknown[] = [
    payload.total,
    payload.totalCount,
    payload.count,
    payload.recordsTotal,
    payload.pagination?.total,
    payload.meta?.total,
  ];

  for (const candidate of candidateTotals) {
    const parsed = parseTotalCount(candidate);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}

function normalizeWhitespace(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.replaceAll(/\s+/g, " ").trim();
}

function toOptionalString(value: string | null | undefined): string | null {
  const normalized = normalizeWhitespace(value);
  return normalized || null;
}

function toSafeInteger(value: number | null | undefined, fallback = 0) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.round(value));
}

function normalizeId(value: string) {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function stripHtmlToText(value: string | null | undefined): string {
  return sanitizeHtml(value ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replaceAll(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function normalizeQuery(query: Partial<BookReviewListQuery>): BookReviewListQuery {
  const limit = clamp(query.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);

  return {
    q: query.q?.trim() || undefined,
    bookId: query.bookId?.trim() || undefined,
    cursor: query.cursor || undefined,
    limit,
  };
}

function toUrlSearchParams(raw: RawSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "undefined") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
      continue;
    }

    params.set(key, value);
  }

  return params;
}

function buildAppliedFilters(query: BookReviewListQuery): AppliedBookReviewFilters {
  return {
    q: query.q,
    bookId: query.bookId,
  };
}

function formatBookCoverAlt(locale: Locale, title: string) {
  return locale === "my" ? `${title} စာအုပ်မျက်နှာဖုံး` : `${title} book cover`;
}

function toBookReviewListItem(locale: Locale, review: BackendBookReviewRecord): BookReviewListItem {
  const reviewerName =
    normalizeWhitespace(review.name) || (locale === "my" ? "အမည်မဖော်ပြထားသူ" : "Anonymous");
  const originalContentsHtml = (review.contents ?? "").trim();
  const excerptSource = stripHtmlToText(originalContentsHtml) || reviewerName;
  const bookTitle =
    normalizeWhitespace(review.book?.bookTitle) ||
    (locale === "my" ? "စာအုပ်အမည်မသိ" : "Untitled book");

  return {
    id: review.id,
    bookId: normalizeWhitespace(review.bookId) || review.book?.id || "",
    reviewerName,
    reviewImageSrc: toOptionalString(review.image),
    contentsHtml: originalContentsHtml,
    excerpt: truncateText(excerptSource, 220),
    viewCount: toSafeInteger(review.viewCount),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    book: {
      id: normalizeWhitespace(review.book?.id) || normalizeWhitespace(review.bookId) || "",
      title: bookTitle,
      coverImageSrc: toOptionalString(review.book?.coverImage) ?? FALLBACK_BOOK_COVER_SRC,
      coverImageAlt: formatBookCoverAlt(locale, bookTitle),
    },
  };
}

function parseListPayload(payload: Partial<BackendBookReviewsResponse>): {
  records: BackendBookReviewRecord[];
  totalCount: number | null;
} {
  if (payload.error || payload.authorized === false) {
    throw new Error(payload.message || "Book reviews API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Book reviews API returned an invalid response payload");
  }

  return {
    records: payload.data,
    totalCount: extractTotalCount(payload),
  };
}

function parseDetailPayload(
  payload: Partial<BackendBookReviewResponse>,
): BackendBookReviewRecord | null {
  if (payload.error || payload.authorized === false) {
    throw new Error(payload.message || "Book review detail API returned an error");
  }

  if (!payload.data) {
    return null;
  }

  return payload.data;
}

async function fetchBookReviewsFromBackend(
  locale: Locale,
  query: {
    page: number;
    limit: number;
    q?: string;
    bookId?: string;
  },
): Promise<{
  records: BackendBookReviewRecord[];
  totalCount: number | null;
}> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  if (query.q) {
    // Send generic query for backend-side matching (author/reviewer/book name).
    params.set("q", query.q);
    // Keep legacy key for backward compatibility with older backend handlers.
    params.set("searchName", query.q);
  }

  if (query.bookId) {
    params.set("bookId", query.bookId);
  }

  const response = await fetch(
    `${BOOK_API_BASE_URL}${BOOK_REVIEWS_ENDPOINT}?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Book reviews API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendBookReviewsResponse>;
  return parseListPayload(payload);
}

async function fetchBookReviewDetailFromBackend(
  locale: Locale,
  id: string,
): Promise<BackendBookReviewRecord | null> {
  const response = await fetch(
    `${BOOK_API_BASE_URL}${BOOK_REVIEWS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Book review detail API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendBookReviewResponse>;
  return parseDetailPayload(payload);
}

export function parseBookReviewListQueryFromSearchParams(
  searchParams: URLSearchParams,
): BookReviewListQuery {
  return normalizeQuery({
    q: searchParams.get("q") ?? searchParams.get("searchName") ?? undefined,
    bookId: searchParams.get("bookId") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: parseNumber(searchParams.get("limit")) ?? DEFAULT_LIMIT,
  });
}

export function parseBookReviewListQueryFromObject(raw: RawSearchParams): BookReviewListQuery {
  return parseBookReviewListQueryFromSearchParams(toUrlSearchParams(raw));
}

export function normalizeBookReviewListQuery(
  query: Partial<BookReviewListQuery>,
): BookReviewListQuery {
  return normalizeQuery(query);
}

export async function searchBookReviews(
  locale: Locale,
  queryInput: Partial<BookReviewListQuery>,
): Promise<BookReviewListResponse> {
  const query = normalizeQuery(queryInput);
  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0;
  const page = Math.floor(safeOffset / query.limit) + 1;

  try {
    const { records, totalCount } = await fetchBookReviewsFromBackend(locale, {
      page,
      limit: query.limit,
      q: query.q,
      bookId: query.bookId,
    });

    const items = records.map((record) => toBookReviewListItem(locale, record));
    const nextOffset = safeOffset + items.length;
    const resolvedTotal = totalCount ?? nextOffset;
    const nextCursor = nextOffset < resolvedTotal ? String(nextOffset) : null;

    return {
      items,
      total: resolvedTotal,
      nextCursor,
      appliedFilters: buildAppliedFilters(query),
    };
  } catch {
    return {
      items: [],
      total: safeOffset,
      nextCursor: null,
      appliedFilters: buildAppliedFilters(query),
    };
  }
}

export async function getBookReviewById(
  locale: Locale,
  id: string,
): Promise<BookReviewDetail | null> {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    return null;
  }

  try {
    const record = await fetchBookReviewDetailFromBackend(locale, normalizedId);

    if (!record) {
      return null;
    }

    return toBookReviewListItem(locale, record);
  } catch {
    return null;
  }
}

export async function getBookReviewsByBookId(
  locale: Locale,
  bookId: string,
  limit = 4,
): Promise<BookReviewListItem[]> {
  const normalizedBookId = normalizeId(bookId);

  if (!normalizedBookId) {
    return [];
  }

  const safeLimit = clamp(limit, 1, 24);

  try {
    const { records } = await fetchBookReviewsFromBackend(locale, {
      page: 1,
      limit: safeLimit,
      bookId: normalizedBookId,
    });

    return records.map((record) => toBookReviewListItem(locale, record));
  } catch {
    return [];
  }
}
