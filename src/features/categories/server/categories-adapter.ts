import type { Locale } from "@/lib/i18n";

import type {
  AppliedCategoryFilters,
  BackendCategoriesResponse,
  BackendCategoryRecord,
  CategoryListItem,
  CategoryListQuery,
  CategoryListResponse,
} from "@/features/categories/schemas/categories";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const CATEGORIES_ENDPOINT = "/api/web/categories";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";

type RawSearchParams = Record<string, string | string[] | undefined>;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseNumber(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeQuery(query: Partial<CategoryListQuery>): CategoryListQuery {
  const normalizedLimit =
    query.limit === undefined ? DEFAULT_LIMIT : clamp(Math.round(query.limit), 1, MAX_LIMIT);

  const normalizedQ = query.q?.trim();

  return {
    q: normalizedQ || undefined,
    cursor: query.cursor,
    limit: normalizedLimit,
  };
}

function toUrlSearchParams(raw: RawSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) {
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

function buildAppliedFilters(query: CategoryListQuery): AppliedCategoryFilters {
  return {
    q: query.q,
  };
}

function toCategoryListItem(raw: BackendCategoryRecord): CategoryListItem {
  return {
    id: raw.id,
    name: raw.name,
    icon: raw.icon ?? null,
    status: raw.status,
    parentId: raw.parentId ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

async function fetchCategoriesFromBackend(locale: Locale): Promise<CategoryListItem[]> {
  const response = await fetch(`${BOOK_API_BASE_URL}${CATEGORIES_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Categories API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendCategoriesResponse>;

  if (payload.error) {
    throw new Error(payload.message || "Categories API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Categories API returned an invalid response payload");
  }

  return payload.data.map(toCategoryListItem);
}

export function parseCategoryListQueryFromSearchParams(
  searchParams: URLSearchParams,
): CategoryListQuery {
  return normalizeQuery({
    q: searchParams.get("q") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: parseNumber(searchParams.get("limit")) ?? DEFAULT_LIMIT,
  });
}

export function parseCategoryListQueryFromObject(raw: RawSearchParams): CategoryListQuery {
  return parseCategoryListQueryFromSearchParams(toUrlSearchParams(raw));
}

export function normalizeCategoryListQuery(query: Partial<CategoryListQuery>): CategoryListQuery {
  return normalizeQuery(query);
}

export async function getAllCategories(locale: Locale): Promise<CategoryListItem[]> {
  const categories = await fetchCategoriesFromBackend(locale);

  return categories.filter((category) => category.status === 1);
}

export async function searchCategories(
  locale: Locale,
  queryInput: Partial<CategoryListQuery>,
): Promise<CategoryListResponse> {
  const query = normalizeQuery(queryInput);
  const categories = await getAllCategories(locale);
  const keyword = query.q?.toLowerCase();

  const filtered = categories.filter((category) => {
    if (!keyword) {
      return true;
    }

    return category.name.toLowerCase().includes(keyword);
  });

  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const items = filtered.slice(safeOffset, safeOffset + query.limit);
  const nextOffset = safeOffset + items.length;
  const nextCursor = nextOffset < filtered.length ? String(nextOffset) : null;

  return {
    items,
    total: filtered.length,
    nextCursor,
    appliedFilters: buildAppliedFilters(query),
  };
}
