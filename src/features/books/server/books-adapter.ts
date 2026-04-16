import type { Locale } from "@/lib/i18n";

import type {
  AppliedBookFilters,
  BookDetail,
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
  summary: LocalizedValue;
  publishYear: number;
  pageCount: number;
  language: LocalizedValue;
  format: LocalizedValue;
  basePrice: number;
  baseRating: number;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

type SeedBook = {
  id: string;
  slug: string;
  cartProductId: string;
  title: LocalizedValue;
  author: LocalizedValue;
  authorId: string;
  category: LocalizedValue;
  categoryId: string;
  description: LocalizedValue;
  publishYear: number;
  pageCount: number;
  language: LocalizedValue;
  format: LocalizedValue;
  isbn: string;
  inStock: boolean;
  price: number;
  rating: number;
  createdAt: string;
  coverImageSrc: string;
  coverImageAlt: LocalizedValue;
  galleryImages: Array<{
    src: string;
    alt: LocalizedValue;
  }>;
};

const bookTemplates: BookTemplate[] = [
  {
    slug: "quiet-orchard",
    title: { en: "The Quiet Orchard", my: "တိတ်ဆိတ်သော သစ်ဥယျာဉ်" },
    author: { en: "Moe Nadi", my: "မိုးနဒီ" },
    authorId: "author-moe-nadi",
    category: { en: "Fiction", my: "ဝတ္ထု" },
    categoryId: "fiction",
    summary: {
      en: "A lyrical story about memory, family, and the silent courage it takes to begin again.",
      my: "မှတ်ဉာဏ်၊ မိသားစု၊ အသစ်ပြန်စရန်လိုအပ်တဲ့ သတ္တိကို ကဗျာဆန်စွာ ရေးထားသည့် ဝတ္ထု။",
    },
    publishYear: 2025,
    pageCount: 304,
    language: { en: "Myanmar", my: "မြန်မာဘာသာ" },
    format: { en: "Paperback", my: "စက္ကူအုပ်" },
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
    summary: {
      en: "A vivid journey through old Bagan, combining archival records with personal travel notes.",
      my: "ရှေးဟောင်းပုဂံသမိုင်းကို မှတ်တမ်းအချက်အလက်များနှင့် ကိုယ်တွေ့ခရီးသွားမှတ်စုများဖြင့် ဖော်ပြထားသည်။",
    },
    publishYear: 2024,
    pageCount: 256,
    language: { en: "English", my: "အင်္ဂလိပ်ဘာသာ" },
    format: { en: "Hardcover", my: "ကာဗာထူအုပ်" },
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
    summary: {
      en: "Letters that capture life around Inle Lake, from dawn markets to floating gardens.",
      my: "အင်းလေးရေကန်ဝန်းကျင်ဘဝကို မနက်ခင်းဈေးများမှ ရေပေါ်ခြံများအထိ စာတိုပုံစံဖြင့် ရေးသားထားသည်။",
    },
    publishYear: 2026,
    pageCount: 220,
    language: { en: "Bilingual", my: "နှစ်ဘာသာ" },
    format: { en: "Paperback", my: "စက္ကူအုပ်" },
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
    summary: {
      en: "Thoughtful essays on neighborhoods, tea shops, and everyday culture in Mandalay.",
      my: "မန္တလေးမြို့ရပ်ကွက်များ၊ လက်ဖက်ရည်ဆိုင်ယဉ်ကျေးမှုနှင့် နေ့စဉ်ဘဝအကြောင်း ဆင်ခြင်ရှုမြင်သည့် ဆောင်းပါးများ။",
    },
    publishYear: 2023,
    pageCount: 288,
    language: { en: "Myanmar", my: "မြန်မာဘာသာ" },
    format: { en: "Paperback", my: "စက္ကူအုပ်" },
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
    summary: {
      en: "A suspenseful mystery where each cup of tea reveals another layer of hidden truth.",
      my: "လက်ဖက်ရည်ခွက်တိုင်းနောက်ကွယ်တွင် အမှန်တရားအသစ်တစ်လွှာ ပေါ်လာစေသည့် စိတ်လှုပ်ရှားဖွယ် ဝတ္ထု။",
    },
    publishYear: 2026,
    pageCount: 340,
    language: { en: "Myanmar", my: "မြန်မာဘာသာ" },
    format: { en: "Hardcover", my: "ကာဗာထူအုပ်" },
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
    summary: {
      en: "Poems written across mountain roads, blending landscape, longing, and resilience.",
      my: "တောင်တန်းလမ်းခရီးများပေါ်တွင် ရေးစပ်ထားသည့် ရှုခင်း၊ အလွမ်းနှင့် သန်မာမှုကို ချိတ်ဆက်ထားသော ကဗျာများ။",
    },
    publishYear: 2022,
    pageCount: 184,
    language: { en: "Myanmar", my: "မြန်မာဘာသာ" },
    format: { en: "Paperback", my: "စက္ကူအုပ်" },
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
    summary: {
      en: "A warm romance set by the river, where chance encounters become enduring promises.",
      my: "မြစ်ကမ်းဘေးတွင် ဖြစ်ပေါ်လာသည့် တွေ့ဆုံမှုများက အချိန်ကြာမြင့်စွာ တည်တံ့မည့် ကတိများသို့ ပြောင်းလဲသွားသော အချစ်ဝတ္ထု။",
    },
    publishYear: 2024,
    pageCount: 312,
    language: { en: "English", my: "အင်္ဂလိပ်ဘာသာ" },
    format: { en: "Paperback", my: "စက္ကူအုပ်" },
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
    summary: {
      en: "Practical reflections and routines to reset your focus and energy after difficult seasons.",
      my: "ခက်ခဲသောအချိန်များအပြီး စိတ်အာရုံစိုက်မှုနှင့် စွမ်းအင်ကို ပြန်လည်တည်ဆောက်ရန် အကောင်အထည်ဖော်နိုင်သည့် နည်းလမ်းများ။",
    },
    publishYear: 2025,
    pageCount: 272,
    language: { en: "Bilingual", my: "နှစ်ဘာသာ" },
    format: { en: "Hardcover", my: "ကာဗာထူအုပ်" },
    basePrice: 21900,
    baseRating: 4.9,
    imageSrc: "/images/home/real/books/book-8.jpg",
    imageAlt: { en: "After the Monsoon book cover", my: "မိုးကာလပြီးနောက် စာအုပ်အဖုံး" },
  },
];

const galleryPool = bookTemplates.map((template) => ({
  src: template.imageSrc,
  alt: template.imageAlt,
}));

const seedBooks: SeedBook[] = Array.from({ length: 48 }, (_, index) => {
  const template = bookTemplates[index % bookTemplates.length];
  const cycle = Math.floor(index / bookTemplates.length);
  const volume = cycle > 0 ? cycle + 1 : null;
  const slug = volume ? `${template.slug}-vol-${volume}` : template.slug;
  const cartProductId = volume ? `book:${template.slug}:vol-${volume}` : `book:${template.slug}`;
  const yearOffset = Math.max(0, cycle - 1);
  const galleryImages = Array.from({ length: 4 }, (_, galleryIndex) => {
    const item = galleryPool[(index + galleryIndex) % galleryPool.length];

    return {
      src: item.src,
      alt: item.alt,
    };
  });

  return {
    id: `book-list-${index + 1}`,
    slug,
    cartProductId,
    title: {
      en: volume ? `${template.title.en} Vol. ${volume}` : template.title.en,
      my: volume ? `${template.title.my} အပိုင်း ${volume}` : template.title.my,
    },
    author: template.author,
    authorId: template.authorId,
    category: template.category,
    categoryId: template.categoryId,
    description: {
      en: volume
        ? `${template.summary.en} Volume ${volume} expands the story with deeper character arcs and new turning points.`
        : template.summary.en,
      my: volume
        ? `${template.summary.my} အပိုင်း ${volume} တွင် ဇာတ်ကောင်ဖွဲ့စည်းမှုနှင့် အဓိကအလှည့်အပြောင်းများကို ပိုမိုနက်ရှိုင်းစွာ တင်ပြထားသည်။`
        : template.summary.my,
    },
    publishYear: template.publishYear - yearOffset,
    pageCount: template.pageCount + cycle * 16,
    language: template.language,
    format: template.format,
    isbn: `978-99937-${String(1000 + index).padStart(4, "0")}-${(index % 9) + 1}`,
    inStock: (index + 1) % 7 !== 0,
    price: template.basePrice + cycle * 850 + (index % 3) * 250,
    rating: Math.max(3.5, Math.min(5, template.baseRating - cycle * 0.08 + (index % 4) * 0.03)),
    createdAt: new Date(Date.UTC(2026, 2, 31 - index)).toISOString(),
    coverImageSrc: template.imageSrc,
    coverImageAlt: template.imageAlt,
    galleryImages,
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
    slug: book.slug,
    cartProductId: book.cartProductId,
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

function toLocalizedBookDetail(locale: Locale, book: SeedBook): BookDetail {
  return {
    ...toLocalizedBook(locale, book),
    description: book.description[locale],
    publishYear: book.publishYear,
    pageCount: book.pageCount,
    language: book.language[locale],
    format: book.format[locale],
    isbn: book.isbn,
    inStock: book.inStock,
    galleryImages: book.galleryImages.map((image) => ({
      src: image.src,
      alt: image.alt[locale],
    })),
  };
}

function buildAppliedFilters(query: BookListQuery): AppliedBookFilters {
  return {
    q: query.q,
    category: query.category,
  };
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
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

export async function getBookBySlug(locale: Locale, slug: string): Promise<BookDetail | null> {
  const normalizedSlug = normalizeSlug(slug);
  const book = seedBooks.find((seedBook) => seedBook.slug === normalizedSlug);

  if (!book) {
    return null;
  }

  return toLocalizedBookDetail(locale, book);
}

export async function getBooksByAuthor(
  locale: Locale,
  authorId: string,
  limit = 8,
): Promise<BookListItem[]> {
  const safeLimit = clamp(limit, 1, 24);

  return seedBooks
    .filter((seedBook) => seedBook.authorId === authorId)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, safeLimit)
    .map((seedBook) => toLocalizedBook(locale, seedBook));
}

export async function getRelatedBooks(
  locale: Locale,
  currentBook: Pick<BookListItem, "id" | "categoryId">,
  limit = 4,
): Promise<BookListItem[]> {
  const safeLimit = clamp(limit, 1, 12);
  const sameCategory = seedBooks
    .filter(
      (seedBook) =>
        seedBook.id !== currentBook.id && seedBook.categoryId === currentBook.categoryId,
    )
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((seedBook) => toLocalizedBook(locale, seedBook));

  if (sameCategory.length >= safeLimit) {
    return sameCategory.slice(0, safeLimit);
  }

  const excludedIds = new Set([currentBook.id, ...sameCategory.map((book) => book.id)]);
  const fallbackBooks = seedBooks
    .filter((seedBook) => !excludedIds.has(seedBook.id))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((seedBook) => toLocalizedBook(locale, seedBook));

  return [...sameCategory, ...fallbackBooks].slice(0, safeLimit);
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
