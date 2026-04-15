import type { Locale } from "@/lib/i18n";

import type {
  AppliedAuthorFilters,
  AuthorListItem,
  AuthorListQuery,
  AuthorListResponse,
} from "@/features/authors/schemas/authors";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

type RawSearchParams = Record<string, string | string[] | undefined>;

type LocalizedValue = {
  en: string;
  my: string;
};

type AuthorTemplate = {
  name: LocalizedValue;
  genre: LocalizedValue;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

type SeedAuthor = {
  id: string;
  name: LocalizedValue;
  genre: LocalizedValue;
  createdAt: string;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

const authorTemplates: AuthorTemplate[] = [
  {
    name: { en: "Moe Nadi", my: "မိုးနဒီ" },
    genre: { en: "Literary Fiction", my: "စာပေရေးရာဝတ္ထု" },
    imageSrc: "/images/home/real/authors/author-1.jpg",
    imageAlt: { en: "Portrait of Moe Nadi", my: "မိုးနဒီ ရုပ်ပုံ" },
  },
  {
    name: { en: "Khin Aye", my: "ခင်အေး" },
    genre: { en: "Historical Fiction", my: "သမိုင်းနောက်ခံဝတ္ထု" },
    imageSrc: "/images/home/real/authors/author-2.jpg",
    imageAlt: { en: "Portrait of Khin Aye", my: "ခင်အေး ရုပ်ပုံ" },
  },
  {
    name: { en: "Sai Nay Lin", my: "စိုင်းနေလင်း" },
    genre: { en: "Travel Writing", my: "ခရီးသွားစာပေ" },
    imageSrc: "/images/home/real/authors/author-3.jpg",
    imageAlt: { en: "Portrait of Sai Nay Lin", my: "စိုင်းနေလင်း ရုပ်ပုံ" },
  },
  {
    name: { en: "Thandar Win", my: "သန္တာဝင်း" },
    genre: { en: "Essays", my: "ဆောင်းပါးများ" },
    imageSrc: "/images/home/real/authors/author-4.jpg",
    imageAlt: { en: "Portrait of Thandar Win", my: "သန္တာဝင်း ရုပ်ပုံ" },
  },
  {
    name: { en: "Aung Min", my: "အောင်မင်း" },
    genre: { en: "Mystery", my: "လျှို့ဝှက်ဆန်းကြယ်" },
    imageSrc: "/images/home/real/authors/author-5.jpg",
    imageAlt: { en: "Portrait of Aung Min", my: "အောင်မင်း ရုပ်ပုံ" },
  },
  {
    name: { en: "Nan Hnin", my: "နန်းနှင်း" },
    genre: { en: "Poetry", my: "ကဗျာ" },
    imageSrc: "/images/home/real/authors/author-6.jpg",
    imageAlt: { en: "Portrait of Nan Hnin", my: "နန်းနှင်း ရုပ်ပုံ" },
  },
  {
    name: { en: "Kyaw Zeya", my: "ကျော်ဇေယျ" },
    genre: { en: "Romance", my: "အချစ်ဝတ္ထု" },
    imageSrc: "/images/home/real/authors/author-1.jpg",
    imageAlt: { en: "Portrait of Kyaw Zeya", my: "ကျော်ဇေယျ ရုပ်ပုံ" },
  },
  {
    name: { en: "May Thu", my: "မေသူ" },
    genre: { en: "Personal Growth", my: "ကိုယ်တိုးတက်ရေး" },
    imageSrc: "/images/home/real/authors/author-2.jpg",
    imageAlt: { en: "Portrait of May Thu", my: "မေသူ ရုပ်ပုံ" },
  },
  {
    name: { en: "Hnin Ei", my: "နှင်းအိ" },
    genre: { en: "Children's Literature", my: "ကလေးစာပေ" },
    imageSrc: "/images/home/real/authors/author-3.jpg",
    imageAlt: { en: "Portrait of Hnin Ei", my: "နှင်းအိ ရုပ်ပုံ" },
  },
  {
    name: { en: "Ye Min Thu", my: "ရဲမင်းသူ" },
    genre: { en: "Biography", my: "အတ္ထုပ္ပတ္တိ" },
    imageSrc: "/images/home/real/authors/author-4.jpg",
    imageAlt: { en: "Portrait of Ye Min Thu", my: "ရဲမင်းသူ ရုပ်ပုံ" },
  },
  {
    name: { en: "Zar Chi", my: "ဇာခြည်" },
    genre: { en: "Contemporary Fiction", my: "ခေတ်ပြိုင်ဝတ္ထု" },
    imageSrc: "/images/home/real/authors/author-5.jpg",
    imageAlt: { en: "Portrait of Zar Chi", my: "ဇာခြည် ရုပ်ပုံ" },
  },
  {
    name: { en: "Phyo Sandar", my: "ဖြိုးစန္ဒာ" },
    genre: { en: "Social Commentary", my: "လူမှုရေးသုံးသပ်ချက်" },
    imageSrc: "/images/home/real/authors/author-6.jpg",
    imageAlt: { en: "Portrait of Phyo Sandar", my: "ဖြိုးစန္ဒာ ရုပ်ပုံ" },
  },
];

const seedAuthors: SeedAuthor[] = Array.from({ length: 36 }, (_, index) => {
  const template = authorTemplates[index % authorTemplates.length];

  return {
    id: `author-list-${index + 1}`,
    name: template.name,
    genre: template.genre,
    createdAt: new Date(Date.UTC(2026, 2, 31 - index)).toISOString(),
    imageSrc: template.imageSrc,
    imageAlt: template.imageAlt,
  };
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

function normalizeQuery(query: Partial<AuthorListQuery>): AuthorListQuery {
  const limit = clamp(query.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);

  return {
    q: query.q?.trim() || undefined,
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

function toLocalizedAuthor(locale: Locale, author: SeedAuthor): AuthorListItem {
  return {
    id: author.id,
    name: author.name[locale],
    imageSrc: author.imageSrc,
    imageAlt: author.imageAlt[locale],
  };
}

function buildAppliedFilters(query: AuthorListQuery): AppliedAuthorFilters {
  return {
    q: query.q,
  };
}

export function parseAuthorListQueryFromSearchParams(
  searchParams: URLSearchParams,
): AuthorListQuery {
  return normalizeQuery({
    q: searchParams.get("q") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: parseNumber(searchParams.get("limit")) ?? DEFAULT_LIMIT,
  });
}

export function parseAuthorListQueryFromObject(raw: RawSearchParams): AuthorListQuery {
  return parseAuthorListQueryFromSearchParams(toUrlSearchParams(raw));
}

export function normalizeAuthorListQuery(query: Partial<AuthorListQuery>): AuthorListQuery {
  return normalizeQuery(query);
}

export async function searchAuthors(
  locale: Locale,
  queryInput: Partial<AuthorListQuery>,
): Promise<AuthorListResponse> {
  const query = normalizeQuery(queryInput);
  const keyword = query.q?.toLowerCase();

  const filtered = seedAuthors.filter((author) => {
    if (!keyword) {
      return true;
    }

    const haystack = author.name[locale].toLowerCase();
    return haystack.includes(keyword);
  });

  const sorted = [...filtered].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const pageItems = sorted.slice(safeOffset, safeOffset + query.limit);
  const items = pageItems.map((author) => toLocalizedAuthor(locale, author));
  const nextOffset = safeOffset + items.length;
  const nextCursor = nextOffset < sorted.length ? String(nextOffset) : null;

  return {
    items,
    total: sorted.length,
    nextCursor,
    appliedFilters: buildAppliedFilters(query),
  };
}
