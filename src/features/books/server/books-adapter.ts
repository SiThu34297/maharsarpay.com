import type { Locale } from "@/lib/i18n";

import type {
  AppliedBookFilters,
  BookFilterOptions,
  BookListItem,
  BookListQuery,
  BookListResponse,
} from "@/features/books/schemas/books";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

type RawSearchParams = Record<string, string | string[] | undefined>;

type LocalizedValue = {
  en: string;
  my: string;
};

type BookTemplate = {
  slug: string;
  title: LocalizedValue;
  author: LocalizedValue;
  authorId: string;
  category: LocalizedValue;
  categoryId: string;
  basePrice: number;
  baseRating: number;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

type SeedBook = {
  id: string;
  title: LocalizedValue;
  author: LocalizedValue;
  authorId: string;
  category: LocalizedValue;
  categoryId: string;
  price: number;
  rating: number;
  createdAt: string;
  coverImageSrc: string;
  coverImageAlt: LocalizedValue;
};

const bookTemplates: BookTemplate[] = [
  {
    slug: "quiet-orchard",
    title: { en: "The Quiet Orchard", my: "တိတ်ဆိတ်သော သစ်ဥယျာဉ်" },
    author: { en: "Moe Nadi", my: "မိုးနဒီ" },
    authorId: "author-moe-nadi",
    category: { en: "Fiction", my: "ဝတ္ထု" },
    categoryId: "fiction",
    basePrice: 21000,
    baseRating: 4.8,
    imageSrc: "/images/home/real/books/book-1.jpg",
    imageAlt: { en: "The Quiet Orchard book cover", my: "တိတ်ဆိတ်သော သစ်ဥယျာဉ် စာအုပ်အဖုံး" },
  },
  {
    slug: "golden-rain-in-bagan",
    title: { en: "Golden Rain in Bagan", my: "ပုဂံမိုးရွာရွှေ" },
    author: { en: "Khin Aye", my: "ခင်အေး" },
    authorId: "author-khin-aye",
    category: { en: "History", my: "သမိုင်း" },
    categoryId: "history",
    basePrice: 18500,
    baseRating: 4.7,
    imageSrc: "/images/home/real/books/book-2.jpg",
    imageAlt: { en: "Golden Rain in Bagan book cover", my: "ပုဂံမိုးရွာရွှေ စာအုပ်အဖုံး" },
  },
  {
    slug: "letters-from-inle",
    title: { en: "Letters from Inle", my: "အင်းလေးမှ စာတိုများ" },
    author: { en: "Sai Nay Lin", my: "စိုင်းနေလင်း" },
    authorId: "author-sai-nay-lin",
    category: { en: "Travel", my: "ခရီးသွား" },
    categoryId: "travel",
    basePrice: 19800,
    baseRating: 4.9,
    imageSrc: "/images/home/real/books/book-3.jpg",
    imageAlt: { en: "Letters from Inle book cover", my: "အင်းလေးမှ စာတိုများ စာအုပ်အဖုံး" },
  },
  {
    slug: "stories-of-mandalay",
    title: { en: "Stories of Mandalay", my: "မန္တလေးပုံပြင်များ" },
    author: { en: "Thandar Win", my: "သန္တာဝင်း" },
    authorId: "author-thandar-win",
    category: { en: "Essays", my: "ဆောင်းပါး" },
    categoryId: "essays",
    basePrice: 17200,
    baseRating: 4.6,
    imageSrc: "/images/home/real/books/book-4.jpg",
    imageAlt: { en: "Stories of Mandalay book cover", my: "မန္တလေးပုံပြင်များ စာအုပ်အဖုံး" },
  },
  {
    slug: "midnight-tea-house",
    title: { en: "Midnight Tea House", my: "သန်းခေါင်လက်ဖက်ရည်ဆိုင်" },
    author: { en: "Aung Min", my: "အောင်မင်း" },
    authorId: "author-aung-min",
    category: { en: "Mystery", my: "လျှို့ဝှက်ဆန်းကြယ်" },
    categoryId: "mystery",
    basePrice: 23000,
    baseRating: 4.8,
    imageSrc: "/images/home/real/books/book-5.jpg",
    imageAlt: { en: "Midnight Tea House book cover", my: "သန်းခေါင်လက်ဖက်ရည်ဆိုင် စာအုပ်အဖုံး" },
  },
  {
    slug: "shan-hills-journal",
    title: { en: "The Shan Hills Journal", my: "ရှမ်းတောင်တန်း မှတ်တမ်း" },
    author: { en: "Nan Hnin", my: "နန်းနှင်း" },
    authorId: "author-nan-hnin",
    category: { en: "Poetry", my: "ကဗျာ" },
    categoryId: "poetry",
    basePrice: 20400,
    baseRating: 4.7,
    imageSrc: "/images/home/real/books/book-6.jpg",
    imageAlt: {
      en: "The Shan Hills Journal book cover",
      my: "ရှမ်းတောင်တန်း မှတ်တမ်း စာအုပ်အဖုံး",
    },
  },
  {
    slug: "river-of-fireflies",
    title: { en: "River of Fireflies", my: "မီးပိုးတောင်မြစ်" },
    author: { en: "Kyaw Zeya", my: "ကျော်ဇေယျ" },
    authorId: "author-kyaw-zeya",
    category: { en: "Romance", my: "အချစ်ဝတ္ထု" },
    categoryId: "romance",
    basePrice: 19100,
    baseRating: 4.5,
    imageSrc: "/images/home/real/books/book-7.jpg",
    imageAlt: { en: "River of Fireflies book cover", my: "မီးပိုးတောင်မြစ် စာအုပ်အဖုံး" },
  },
  {
    slug: "after-the-monsoon",
    title: { en: "After the Monsoon", my: "မိုးကာလပြီးနောက်" },
    author: { en: "May Thu", my: "မေသူ" },
    authorId: "author-may-thu",
    category: { en: "Self Development", my: "ကိုယ်တိုးတက်ရေး" },
    categoryId: "self-development",
    basePrice: 21900,
    baseRating: 4.9,
    imageSrc: "/images/home/real/books/book-8.jpg",
    imageAlt: { en: "After the Monsoon book cover", my: "မိုးကာလပြီးနောက် စာအုပ်အဖုံး" },
  },
];

const seedBooks: SeedBook[] = Array.from({ length: 48 }, (_, index) => {
  const template = bookTemplates[index % bookTemplates.length];
  const cycle = Math.floor(index / bookTemplates.length);
  const volume = cycle > 0 ? cycle + 1 : null;

  return {
    id: `book-list-${index + 1}`,
    title: {
      en: volume ? `${template.title.en} Vol. ${volume}` : template.title.en,
      my: volume ? `${template.title.my} အပိုင်း ${volume}` : template.title.my,
    },
    author: template.author,
    authorId: template.authorId,
    category: template.category,
    categoryId: template.categoryId,
    price: template.basePrice + cycle * 850 + (index % 3) * 250,
    rating: Math.max(3.5, Math.min(5, template.baseRating - cycle * 0.08 + (index % 4) * 0.03)),
    createdAt: new Date(Date.UTC(2026, 2, 31 - index)).toISOString(),
    coverImageSrc: template.imageSrc,
    coverImageAlt: template.imageAlt,
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

function normalizeQuery(query: Partial<BookListQuery>): BookListQuery {
  const limit = clamp(query.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);

  return {
    q: query.q?.trim() || undefined,
    category: query.category || undefined,
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

function toLocalizedBook(locale: Locale, book: SeedBook): BookListItem {
  return {
    id: book.id,
    title: book.title[locale],
    author: book.author[locale],
    authorId: book.authorId,
    category: book.category[locale],
    categoryId: book.categoryId,
    price: book.price,
    rating: Number(book.rating.toFixed(1)),
    coverImageSrc: book.coverImageSrc,
    coverImageAlt: book.coverImageAlt[locale],
  };
}

function buildAppliedFilters(query: BookListQuery): AppliedBookFilters {
  return {
    q: query.q,
    category: query.category,
  };
}

export function parseBookListQueryFromSearchParams(searchParams: URLSearchParams): BookListQuery {
  return normalizeQuery({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: parseNumber(searchParams.get("limit")) ?? DEFAULT_LIMIT,
  });
}

export function parseBookListQueryFromObject(raw: RawSearchParams): BookListQuery {
  return parseBookListQueryFromSearchParams(toUrlSearchParams(raw));
}

export function normalizeBookListQuery(query: Partial<BookListQuery>): BookListQuery {
  return normalizeQuery(query);
}

export async function getBookFilterOptions(locale: Locale): Promise<BookFilterOptions> {
  const localizedBooks = seedBooks.map((book) => toLocalizedBook(locale, book));
  const categoriesMap = new Map<string, string>();

  for (const book of localizedBooks) {
    categoriesMap.set(book.categoryId, book.category);
  }

  const categories = [...categoriesMap.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label));

  return { categories };
}

export async function searchBooks(
  locale: Locale,
  queryInput: Partial<BookListQuery>,
): Promise<BookListResponse> {
  const query = normalizeQuery(queryInput);
  const keyword = query.q?.toLowerCase();

  const filtered = seedBooks.filter((book) => {
    if (query.category && book.categoryId !== query.category) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const haystack =
      `${book.title[locale]} ${book.author[locale]} ${book.category[locale]}`.toLowerCase();
    return haystack.includes(keyword);
  });

  const sorted = [...filtered].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const pageItems = sorted.slice(safeOffset, safeOffset + query.limit);
  const items = pageItems.map((book) => toLocalizedBook(locale, book));
  const nextOffset = safeOffset + items.length;
  const nextCursor = nextOffset < sorted.length ? String(nextOffset) : null;

  return {
    items,
    total: sorted.length,
    nextCursor,
    appliedFilters: buildAppliedFilters(query),
  };
}
