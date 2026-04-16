import type { Locale } from "@/lib/i18n";

import { getAllCategories } from "@/features/categories";
import type {
  AppliedBookFilters,
  BackendBookRecord,
  BackendBooksResponse,
  BookDetail,
  BookFilterOptions,
  BookListItem,
  BookListQuery,
  BookListResponse,
} from "@/features/books/schemas/books";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const BOOKS_ENDPOINT = "/api/web/books";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const BACKEND_DEFAULT_RATING = 4.7;
const BACKEND_FALLBACK_COVER_SRC = "/images/home/real/books/book-1.jpg";

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

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeSearchValue(value: string) {
  return normalizeWhitespace(value).toLowerCase();
}

function toSafeNumber(value: number | null | undefined, fallback = 0) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
}

function toInteger(value: number | null | undefined, fallback = 0) {
  return Math.max(0, Math.round(toSafeNumber(value, fallback)));
}

function stripHtmlToText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getPrimaryAuthor(book: BackendBookRecord) {
  const author = book.authors.find((item) => normalizeWhitespace(item.name || "") !== "");

  if (!author) {
    return {
      id: "unknown-author",
      name: "Unknown Author",
    };
  }

  return {
    id: author.id,
    name: normalizeWhitespace(author.name),
  };
}

function getPrimaryCategory(book: BackendBookRecord) {
  const category = book.categories.find((item) => normalizeWhitespace(item.name || "") !== "");

  if (!category) {
    return {
      id: "uncategorized",
      name: "Uncategorized",
    };
  }

  return {
    id: category.id,
    name: normalizeWhitespace(category.name),
  };
}

function resolveBackendBookPricing(book: BackendBookRecord) {
  const rawSalePrice = toInteger(book.salePrice);
  const rawOriginalPrice = toInteger(book.originalPrice);

  if (rawSalePrice > 0 && rawOriginalPrice > rawSalePrice) {
    return {
      price: rawSalePrice,
      salePrice: rawSalePrice,
      originalPrice: rawOriginalPrice,
      discountAmount: rawOriginalPrice - rawSalePrice,
    };
  }

  if (rawSalePrice > 0) {
    return {
      price: rawSalePrice,
      salePrice: rawSalePrice,
      originalPrice: null,
      discountAmount: null,
    };
  }

  return {
    price: rawOriginalPrice,
    salePrice: rawOriginalPrice > 0 ? rawOriginalPrice : null,
    originalPrice: null,
    discountAmount: null,
  };
}

function resolveBackendBookCoverImage(book: BackendBookRecord) {
  return (
    book.coverImage?.trim() ||
    book.bookImageFront?.trim() ||
    book.bookImageBack?.trim() ||
    BACKEND_FALLBACK_COVER_SRC
  );
}

function resolveBackendBookPreviewPdfSrc(preview: string | null | undefined) {
  const rawValue = preview?.trim();

  if (!rawValue) {
    return null;
  }

  try {
    const previewUrl =
      rawValue.startsWith("http://") || rawValue.startsWith("https://")
        ? new URL(rawValue)
        : new URL(rawValue, BOOK_API_BASE_URL);

    if (previewUrl.protocol !== "http:" && previewUrl.protocol !== "https:") {
      return null;
    }

    return previewUrl.toString();
  } catch {
    return null;
  }
}

function resolveBackendBookReleaseTimestamp(book: BackendBookRecord) {
  const time = Date.parse(book.bookReleaseDate ?? "");

  if (Number.isFinite(time)) {
    return time;
  }

  return 0;
}

function sortBackendBooksDescending(left: BackendBookRecord, right: BackendBookRecord) {
  const timestampDiff =
    resolveBackendBookReleaseTimestamp(right) - resolveBackendBookReleaseTimestamp(left);

  if (timestampDiff !== 0) {
    return timestampDiff;
  }

  return left.id.localeCompare(right.id);
}

function toBackendBookListItem(book: BackendBookRecord): BookListItem {
  const author = getPrimaryAuthor(book);
  const category = getPrimaryCategory(book);
  const title = normalizeWhitespace(book.bookTitle || "Untitled Book");
  const pricing = resolveBackendBookPricing(book);

  return {
    id: book.id,
    slug: book.id,
    cartProductId: `book:${book.id}`,
    title,
    author: author.name,
    authorId: author.id,
    category: category.name,
    categoryId: category.id,
    price: pricing.price,
    salePrice: pricing.salePrice,
    originalPrice: pricing.originalPrice,
    discountAmount: pricing.discountAmount,
    rating: BACKEND_DEFAULT_RATING,
    coverImageSrc: resolveBackendBookCoverImage(book),
    coverImageAlt: `${title} cover`,
  };
}

function toBackendBookDetail(locale: Locale, book: BackendBookRecord): BookDetail {
  const base = toBackendBookListItem(book);
  const description = stripHtmlToText(book.about) || base.title;
  const galleryImageSources = [
    book.bookImageFront,
    book.bookImageBack,
    book.coverImage,
    book.sideImage,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  const uniqueGallerySources = [...new Set(galleryImageSources)];
  const releaseDate = Date.parse(book.bookReleaseDate ?? "");

  return {
    ...base,
    description,
    edition: normalizeWhitespace(book.edition || "") || (locale === "my" ? "၁" : "1"),
    previewPdfSrc: resolveBackendBookPreviewPdfSrc(book.preview),
    publishYear: Number.isFinite(releaseDate) ? new Date(releaseDate).getUTCFullYear() : 0,
    pageCount: toInteger(book.pages),
    language: locale === "my" ? "မြန်မာဘာသာ" : "Myanmar",
    format: normalizeWhitespace(book.size || "") || (locale === "my" ? "မသတ်မှတ်" : "Unspecified"),
    isbn: normalizeWhitespace(book.serial || "") || book.id,
    inStock: toInteger(book.units) > 0 && toInteger(book.status) === 1,
    galleryImages: uniqueGallerySources.length
      ? uniqueGallerySources.map((src) => ({
          src,
          alt: `${base.title} preview`,
        }))
      : [
          {
            src: base.coverImageSrc,
            alt: base.coverImageAlt,
          },
        ],
  };
}

function matchesBackendBookCategory(book: BackendBookRecord, categoryQuery: string) {
  const normalizedQuery = normalizeCategoryFilterValue(categoryQuery);

  if (!normalizedQuery) {
    return true;
  }

  const candidates = book.categories
    .flatMap((category) => [category.id, category.name])
    .map(normalizeCategoryFilterValue)
    .filter(Boolean);

  if (candidates.includes(normalizedQuery)) {
    return true;
  }

  return candidates.some(
    (candidate) => candidate.includes(normalizedQuery) || normalizedQuery.includes(candidate),
  );
}

function matchesBackendBookKeyword(book: BackendBookRecord, keyword: string) {
  const haystack = [
    book.bookTitle,
    ...book.authors.map((author) => author.name),
    ...book.categories.map((category) => category.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(keyword);
}

function matchesBackendAuthor(
  book: BackendBookRecord,
  authorId: string,
  normalizedAuthorName: string,
) {
  if (book.authors.some((author) => author.id === authorId)) {
    return true;
  }

  if (!normalizedAuthorName) {
    return false;
  }

  return book.authors.some((author) => normalizeSearchValue(author.name) === normalizedAuthorName);
}

async function fetchBooksFromBackend(locale: Locale): Promise<BackendBookRecord[]> {
  const response = await fetch(`${BOOK_API_BASE_URL}${BOOKS_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Books API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendBooksResponse>;

  if (payload.error) {
    throw new Error(payload.message || "Books API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Books API returned an invalid response payload");
  }

  return payload.data.filter((item): item is BackendBookRecord => {
    return Boolean(item && typeof item === "object" && typeof item.id === "string");
  });
}

function getActiveBackendBooks(books: BackendBookRecord[]) {
  return books.filter((book) => toInteger(book.status, 1) === 1);
}

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
    salePrice: book.price,
    originalPrice: null,
    discountAmount: null,
    rating: Number(book.rating.toFixed(1)),
    coverImageSrc: book.coverImageSrc,
    coverImageAlt: book.coverImageAlt[locale],
  };
}

function toLocalizedBookDetail(locale: Locale, book: SeedBook): BookDetail {
  return {
    ...toLocalizedBook(locale, book),
    description: book.description[locale],
    edition: locale === "my" ? "၁" : "1",
    previewPdfSrc: null,
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

function normalizeCategoryFilterValue(value: string) {
  return value.trim().toLowerCase();
}

function matchesBookCategory(book: SeedBook, categoryQuery: string) {
  const normalizedQuery = normalizeCategoryFilterValue(categoryQuery);

  if (!normalizedQuery) {
    return true;
  }

  const candidates = [book.categoryId, book.category.en, book.category.my]
    .map(normalizeCategoryFilterValue)
    .filter(Boolean);

  if (candidates.includes(normalizedQuery)) {
    return true;
  }

  return candidates.some(
    (candidate) => candidate.includes(normalizedQuery) || normalizedQuery.includes(candidate),
  );
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
  try {
    const categories = await getAllCategories(locale);
    const backendCategoryMap = new Map<string, string>();

    for (const category of categories) {
      const label = category.name.trim();

      if (!label) {
        continue;
      }

      backendCategoryMap.set(label, label);
    }

    const backendCategoryOptions = [...backendCategoryMap.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((left, right) => left.label.localeCompare(right.label));

    if (backendCategoryOptions.length > 0) {
      return {
        categories: backendCategoryOptions,
      };
    }
  } catch {
    // Fallback to seed-based category options if backend is unavailable.
  }

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
  try {
    const backendBooks = await fetchBooksFromBackend(locale);
    const backendBook = getActiveBackendBooks(backendBooks).find(
      (book) => normalizeSlug(book.id) === normalizedSlug,
    );

    if (backendBook) {
      return toBackendBookDetail(locale, backendBook);
    }
  } catch {
    // Fall through to seed fallback.
  }

  const fallbackBook = seedBooks.find((seedBook) => seedBook.slug === normalizedSlug);

  if (!fallbackBook) {
    return null;
  }

  return toLocalizedBookDetail(locale, fallbackBook);
}

export async function getBooksByAuthor(
  locale: Locale,
  authorId: string,
  limit = 8,
  options?: {
    authorName?: string;
  },
): Promise<BookListItem[]> {
  const safeLimit = clamp(limit, 1, 24);
  const normalizedAuthorName = options?.authorName ? normalizeSearchValue(options.authorName) : "";

  try {
    const backendBooks = await fetchBooksFromBackend(locale);
    return getActiveBackendBooks(backendBooks)
      .filter((book) => matchesBackendAuthor(book, authorId, normalizedAuthorName))
      .sort(sortBackendBooksDescending)
      .slice(0, safeLimit)
      .map((book) => toBackendBookListItem(book));
  } catch {
    // Fall through to seed fallback.
  }

  return seedBooks
    .filter((seedBook) => {
      if (seedBook.authorId === authorId) {
        return true;
      }

      if (!normalizedAuthorName) {
        return false;
      }

      const candidateNames = [seedBook.author.en, seedBook.author.my].map(normalizeSearchValue);

      return candidateNames.includes(normalizedAuthorName);
    })
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
  try {
    const backendBooks = getActiveBackendBooks(await fetchBooksFromBackend(locale));
    const sameCategory = backendBooks
      .filter((book) => {
        if (book.id === currentBook.id) {
          return false;
        }

        const normalizedCategoryId = normalizeCategoryFilterValue(currentBook.categoryId);
        return book.categories.some((category) => {
          const categoryCandidates = [category.id, category.name]
            .map(normalizeCategoryFilterValue)
            .filter(Boolean);
          return categoryCandidates.includes(normalizedCategoryId);
        });
      })
      .sort(sortBackendBooksDescending)
      .map((book) => toBackendBookListItem(book));

    if (sameCategory.length >= safeLimit) {
      return sameCategory.slice(0, safeLimit);
    }

    const excludedIds = new Set([currentBook.id, ...sameCategory.map((book) => book.id)]);
    const fallbackBooks = backendBooks
      .filter((book) => !excludedIds.has(book.id))
      .sort(sortBackendBooksDescending)
      .map((book) => toBackendBookListItem(book));

    return [...sameCategory, ...fallbackBooks].slice(0, safeLimit);
  } catch {
    // Fall through to seed fallback.
  }

  const sameCategoryFallback = seedBooks
    .filter(
      (seedBook) =>
        seedBook.id !== currentBook.id && seedBook.categoryId === currentBook.categoryId,
    )
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((seedBook) => toLocalizedBook(locale, seedBook));

  if (sameCategoryFallback.length >= safeLimit) {
    return sameCategoryFallback.slice(0, safeLimit);
  }

  const excludedIds = new Set([currentBook.id, ...sameCategoryFallback.map((book) => book.id)]);

  const fallbackBooks = seedBooks
    .filter((seedBook) => !excludedIds.has(seedBook.id))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((seedBook) => toLocalizedBook(locale, seedBook));

  return [...sameCategoryFallback, ...fallbackBooks].slice(0, safeLimit);
}

export async function searchBooks(
  locale: Locale,
  queryInput: Partial<BookListQuery>,
): Promise<BookListResponse> {
  const query = normalizeQuery(queryInput);
  const keyword = query.q?.toLowerCase();

  try {
    const backendBooks = getActiveBackendBooks(await fetchBooksFromBackend(locale));
    const filteredBooks = backendBooks.filter((book) => {
      if (query.category && !matchesBackendBookCategory(book, query.category)) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return matchesBackendBookKeyword(book, keyword);
    });

    const sortedBooks = [...filteredBooks].sort(sortBackendBooksDescending);
    const offset = Number(query.cursor ?? "0");
    const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
    const pageItems = sortedBooks.slice(safeOffset, safeOffset + query.limit);
    const items = pageItems.map((book) => toBackendBookListItem(book));
    const nextOffset = safeOffset + items.length;
    const nextCursor = nextOffset < sortedBooks.length ? String(nextOffset) : null;

    return {
      items,
      total: sortedBooks.length,
      nextCursor,
      appliedFilters: buildAppliedFilters(query),
    };
  } catch {
    // Fall through to seed fallback.
  }

  const filtered = seedBooks.filter((book) => {
    if (query.category && !matchesBookCategory(book, query.category)) {
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
