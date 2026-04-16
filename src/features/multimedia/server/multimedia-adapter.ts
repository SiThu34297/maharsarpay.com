import { getBooksByAuthor, searchBooks } from "@/features/books/server/books-adapter";
import type { BookListItem } from "@/features/books/schemas/books";
import type { Locale } from "@/lib/i18n";

import type {
  AppliedMediaFilters,
  MediaDetail,
  MediaListItem,
  MediaListQuery,
  MediaListResponse,
  MediaType,
} from "@/features/multimedia/schemas/multimedia";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

const MEDIA_TYPES: MediaType[] = ["video", "photo"];

type RawSearchParams = Record<string, string | string[] | undefined>;

type LocalizedValue = {
  en: string;
  my: string;
};

type MediaTemplate = {
  slug: string;
  title: LocalizedValue;
  description: LocalizedValue;
  lead: LocalizedValue;
  storyParagraphs: LocalizedValue[];
  creator: LocalizedValue;
  creatorId: string;
  mediaType: MediaType;
  durationLabel?: LocalizedValue;
  photoCount?: number;
  tags: LocalizedValue[];
  imageSrc: string;
  imageAlt: LocalizedValue;
};

type SeedMedia = {
  id: string;
  slug: string;
  title: LocalizedValue;
  description: LocalizedValue;
  lead: LocalizedValue;
  storyParagraphs: LocalizedValue[];
  creator: LocalizedValue;
  creatorId: string;
  mediaType: MediaType;
  publishedAt: string;
  durationLabel?: LocalizedValue;
  photoCount?: number;
  tags: LocalizedValue[];
  imageSrc: string;
  imageAlt: LocalizedValue;
  galleryImages: Array<{
    src: string;
    alt: LocalizedValue;
  }>;
};

const mediaTemplates: MediaTemplate[] = [
  {
    slug: "behind-the-shelves",
    title: { en: "Behind the Shelves", my: "စာအုပ်စင်နောက်ကွယ်" },
    description: {
      en: "A visual walk through this month’s standout picks and reader favorites.",
      my: "ဒီလအတွင်း လူကြိုက်များသော စာအုပ်များကို ပုံရိပ်များဖြင့် အနီးကပ် တင်ဆက်ထားသည်။",
    },
    lead: {
      en: "Our editorial team follows the shelves from first-arrival stacks to weekend bestsellers.",
      my: "တည်းဖြတ်အဖွဲ့က စာအုပ်အသစ်ရောက်သည့်နေရာမှ ပိတ်ရက်လူကြိုက်များမှုအထိ လိုက်လံမှတ်တမ်းတင်ထားသည်။",
    },
    storyParagraphs: [
      {
        en: "Every month, readers shape a living map of curiosity. In this episode, we trace which titles move fastest and why they resonate across different age groups.",
        my: "လစဉ်တိုင်း စာဖတ်သူများက စိတ်ဝင်စားမှုမြေပုံအသစ်ကို ဖန်တီးနေကြသည်။ ဤဗီဒီယိုတွင် မည်သည့်စာအုပ်များ လူကြိုက်များလာသည်နှင့် ဘာကြောင့်ဆိုသည်ကို အသက်အရွယ်အလိုက် လေ့လာထားသည်။",
      },
      {
        en: "From fiction corners to history shelves, booksellers explain subtle patterns in demand and how they curate titles for returning customers.",
        my: "ဝတ္ထုအခန်းမှ သမိုင်းအခန်းအထိ စာအုပ်ရောင်းချသူများက ဖောက်သည်ပြန်လည်လာရောက်မှုအပေါ် မူတည်ပြီး စာအုပ်ရွေးချယ်ပုံကို ရှင်းပြထားသည်။",
      },
      {
        en: "The result is a warm portrait of reading culture in motion, where each recommendation reflects both trust and community memory.",
        my: "နောက်ဆုံးရလဒ်မှာ အကြံပြုချက်တစ်ခုချင်းစီတွင် ယုံကြည်မှုနှင့် အသိုင်းအဝိုင်းမှတ်ဉာဏ်ပါဝင်သည့် စာဖတ်ယဉ်ကျေးမှုပုံရိပ်တစ်ခုဖြစ်သည်။",
      },
    ],
    creator: { en: "Mahar Studio", my: "မဟာစတူဒီယို" },
    creatorId: "author-moe-nadi",
    mediaType: "video",
    durationLabel: { en: "12 min", my: "၁၂ မိနစ်" },
    tags: [
      { en: "Editorial", my: "တည်းဖြတ်" },
      { en: "Book Discovery", my: "စာအုပ်ရှာဖွေမှု" },
      { en: "Readers", my: "စာဖတ်သူ" },
    ],
    imageSrc: "/images/home/real/media/media-1.jpg",
    imageAlt: { en: "Behind the shelves video thumbnail", my: "စာအုပ်စင်နောက်ကွယ် ဗီဒီယိုနမူနာ" },
  },
  {
    slug: "meet-the-author",
    title: { en: "Meet the Author", my: "စာရေးသူနှင့် တွေ့ဆုံမှု" },
    description: {
      en: "Short interviews with writers shaping modern Myanmar storytelling.",
      my: "ခေတ်သစ်မြန်မာဇာတ်လမ်းရေးသားမှုကို ပုံဖော်နေသူများနှင့် အင်တာဗျူးတိုများ။",
    },
    lead: {
      en: "A candid studio conversation on process, language, and how stories find their first readers.",
      my: "ရေးသားသည့်လုပ်ငန်းစဉ်၊ ဘာသာစကားအသုံးနှင့် ပထမဦးဆုံးစာဖတ်သူကို ဘယ်လိုတွေ့သလဲဆိုသည်တို့အပေါ် ပွင့်လင်းဆွေးနွေးထားသည်။",
    },
    storyParagraphs: [
      {
        en: "In each interview, authors discuss where ideas begin and how drafts evolve through feedback from editors and community readers.",
        my: "အင်တာဗျူးတိုင်းတွင် စာရေးသူများက အကြောင်းအရာစတင်ပုံနှင့် တည်းဖြတ်အဖွဲ့၊ အသိုင်းအဝိုင်းစာဖတ်သူများ၏ အကြံပြုချက်ဖြင့် မူကြမ်းများပြောင်းလဲလာပုံကို ပြောပြထားသည်။",
      },
      {
        en: "The format is intentionally intimate: fewer questions, longer answers, and room for reflection on craft.",
        my: "မေးခွန်းနည်းနည်း၊ အဖြေရှည်ရှည်၊ လက်ရာဖန်တီးမှုအပေါ် စဉ်းစားချိန်ပေးသည့် နီးကပ်အင်တာဗျူးပုံစံကို ရွေးထားသည်။",
      },
      {
        en: "This episode highlights how literary voices stay grounded in place while still speaking to universal themes.",
        my: "ဤအပိုင်းသည် ဒေသနောက်ခံနှင့် နီးစပ်နေသော်လည်း လူတိုင်းနှင့်ဆက်စပ်နိုင်သော အကြောင်းအရာများကို စာပေအသံများက မည်သို့ဖော်ပြသည်ကို ထင်ဟပ်စေသည်။",
      },
    ],
    creator: { en: "Editorial Team", my: "တည်းဖြတ်အဖွဲ့" },
    creatorId: "author-khin-aye",
    mediaType: "video",
    durationLabel: { en: "9 min", my: "၉ မိနစ်" },
    tags: [
      { en: "Interview", my: "အင်တာဗျူး" },
      { en: "Writers", my: "စာရေးသူ" },
      { en: "Craft", my: "လက်ရာ" },
    ],
    imageSrc: "/images/home/real/media/media-2.jpg",
    imageAlt: { en: "Meet the author video thumbnail", my: "စာရေးသူနှင့်တွေ့ဆုံမှု ဗီဒီယိုနမူနာ" },
  },
  {
    slug: "weekend-reading-guide",
    title: { en: "Weekend Reading Guide", my: "စနေတနင်္ဂနွေ ဖတ်ရှုလမ်းညွှန်" },
    description: {
      en: "Photo stories built around calm, reflective weekend reads.",
      my: "တိတ်ဆိတ်သော ပိတ်ရက်ဖတ်ရှုချိန်အတွက် ဓာတ်ပုံပုံပြင်စုစည်းမှုများ။",
    },
    lead: {
      en: "A curated photo narrative pairing places, moods, and books for a slower weekend rhythm.",
      my: "နေရာ၊ ခံစားမှုနှင့် စာအုပ်များကို ပိတ်ရက်နှေးကွေးစွာဖတ်ရှုနိုင်ရန် ဓာတ်ပုံပုံပြင်အဖြစ် ချိတ်ဆက်တင်ဆက်ထားသည်။",
    },
    storyParagraphs: [
      {
        en: "Each frame is built around a reading moment: sunlight, silence, and pages that invite longer attention.",
        my: "ဓာတ်ပုံတစ်ပုံချင်းစီသည် နေရောင်၊ တိတ်ဆိတ်မှုနှင့် စာမျက်နှာများပေါ် အာရုံထားဖတ်ရှုနိုင်သော အချိန်များကို အခြေခံထားသည်။",
      },
      {
        en: "Our editors map where readers pause, annotate, and revisit lines that stay with them through the week.",
        my: "တည်းဖြတ်အဖွဲ့က စာဖတ်သူများ ရပ်နားဖတ်ရှုသည့်နေရာ၊ မှတ်စုရေးသည့်အပိုင်းနှင့် တစ်ပတ်လုံး ပြန်ဖတ်ချင်သည့်စာကြောင်းများကို စုစည်းပြထားသည်။",
      },
      {
        en: "The gallery invites readers to build a personal weekend ritual around books, tea, and reflection.",
        my: "ဤဓာတ်ပုံစုစည်းမှုက စာအုပ်၊ လက်ဖက်ရည်နှင့် စဉ်းစားမှတ်သားမှုကို ပေါင်းစပ်ထားသော ကိုယ်ပိုင်ပိတ်ရက်ရိုးရာတစ်ခု ဖန်တီးရန် ဖိတ်ခေါ်နေသည်။",
      },
    ],
    creator: { en: "Photo Desk", my: "ဓာတ်ပုံအဖွဲ့" },
    creatorId: "author-sai-nay-lin",
    mediaType: "photo",
    photoCount: 16,
    tags: [
      { en: "Photo Essay", my: "ဓာတ်ပုံဆောင်းပါး" },
      { en: "Weekend", my: "ပိတ်ရက်" },
      { en: "Reading Ritual", my: "ဖတ်ရှုရိုးရာ" },
    ],
    imageSrc: "/images/home/real/media/media-3.jpg",
    imageAlt: {
      en: "Weekend reading guide photo story cover",
      my: "ပိတ်ရက်ဖတ်ရှုလမ်းညွှန် ဓာတ်ပုံပုံပြင်မျက်နှာဖုံး",
    },
  },
  {
    slug: "bookstore-stories",
    title: { en: "Bookstore Stories", my: "စာအုပ်ဆိုင်ပုံပြင်များ" },
    description: {
      en: "Reader snapshots and reading rituals from across Myanmar.",
      my: "မြန်မာနိုင်ငံအနှံ့မှ စာဖတ်သူတွေရဲ့ ဖတ်ရှုဓလေ့များနှင့် ရုပ်ပုံမှတ်တမ်းများ။",
    },
    lead: {
      en: "A community photo feature following readers in Yangon, Mandalay, and beyond.",
      my: "ရန်ကုန်၊ မန္တလေးနှင့် အခြားမြို့များရှိ စာဖတ်သူများ၏ ဖတ်ရှုဘဝကို လိုက်လံမှတ်တမ်းတင်ထားသော အသိုင်းအဝိုင်းဓာတ်ပုံစုစည်းမှု။",
    },
    storyParagraphs: [
      {
        en: "The project started as a simple open call: share where you read and what keeps you returning to books.",
        my: "ဤပရောဂျက်သည် 'ဘယ်နေရာမှာဖတ်သလဲ၊ ဘာကြောင့်စာအုပ်ကို ပြန်ရွေးသလဲ' ဟု မေးသည့် ဖိတ်ခေါ်ချက်မှ စတင်ခဲ့သည်။",
      },
      {
        en: "Contributors sent photos from tea shops, buses, libraries, and dorm rooms, each with a short personal note.",
        my: "လက်ဖက်ရည်ဆိုင်၊ ဘတ်စ်ကား၊ စာကြည့်တိုက်နှင့် ကျောင်းသားအိပ်ဆောင်များမှ ဓာတ်ပုံများနှင့် ကိုယ်ပိုင်မှတ်ချက်တိုများကို ပေးပို့ခဲ့ကြသည်။",
      },
      {
        en: "Together, these images form a map of reading culture that is local, social, and deeply personal.",
        my: "ဤပုံများပေါင်းစပ်မှုက ဒေသခံ၊ လူမှုဆက်သွယ်မှုရှိပြီး ကိုယ်ပိုင်အနက်ပါသော စာဖတ်ယဉ်ကျေးမှုမြေပုံတစ်ခုကို ဖော်ပြနေသည်။",
      },
    ],
    creator: { en: "Community Team", my: "အသိုင်းအဝိုင်းအဖွဲ့" },
    creatorId: "author-thandar-win",
    mediaType: "photo",
    photoCount: 20,
    tags: [
      { en: "Community", my: "အသိုင်းအဝိုင်း" },
      { en: "Reading Culture", my: "စာဖတ်ယဉ်ကျေးမှု" },
      { en: "Myanmar", my: "မြန်မာ" },
    ],
    imageSrc: "/images/home/real/media/media-4.jpg",
    imageAlt: {
      en: "Bookstore stories photo feature cover",
      my: "စာအုပ်ဆိုင်ပုံပြင်များ ဓာတ်ပုံမျက်နှာဖုံး",
    },
  },
];

const galleryPool = mediaTemplates.map((template) => ({
  src: template.imageSrc,
  alt: template.imageAlt,
}));

const seedMediaItems: SeedMedia[] = Array.from({ length: 40 }, (_, index) => {
  const template = mediaTemplates[index % mediaTemplates.length];
  const cycle = Math.floor(index / mediaTemplates.length);
  const edition = cycle > 0 ? cycle + 1 : null;
  const slug = edition ? `${template.slug}-edition-${edition}` : template.slug;
  const galleryImages = Array.from({ length: 4 }, (_, galleryIndex) => {
    const item = galleryPool[(index + galleryIndex) % galleryPool.length];

    return {
      src: item.src,
      alt: item.alt,
    };
  });

  return {
    id: `media-list-${index + 1}`,
    slug,
    title: {
      en: edition ? `${template.title.en} Edition ${edition}` : template.title.en,
      my: edition ? `${template.title.my} အပိုင်း ${edition}` : template.title.my,
    },
    description: template.description,
    lead: template.lead,
    storyParagraphs: template.storyParagraphs,
    creator: template.creator,
    creatorId: template.creatorId,
    mediaType: template.mediaType,
    publishedAt: new Date(Date.UTC(2026, 2, 31 - index)).toISOString(),
    durationLabel: template.durationLabel,
    photoCount: template.photoCount ? template.photoCount + cycle : undefined,
    tags: template.tags,
    imageSrc: template.imageSrc,
    imageAlt: template.imageAlt,
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

function parseMediaType(value: string | null): MediaType | undefined {
  if (!value) {
    return undefined;
  }

  if (!MEDIA_TYPES.includes(value as MediaType)) {
    return undefined;
  }

  return value as MediaType;
}

function normalizeQuery(query: Partial<MediaListQuery>): MediaListQuery {
  const limit = clamp(query.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);

  return {
    q: query.q?.trim() || undefined,
    mediaType: query.mediaType,
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

function toLocalizedMediaListItem(locale: Locale, item: SeedMedia): MediaListItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title[locale],
    description: item.description[locale],
    creator: item.creator[locale],
    mediaType: item.mediaType,
    publishedAt: item.publishedAt,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt[locale],
  };
}

function toLocalizedMediaDetail(locale: Locale, item: SeedMedia): MediaDetail {
  return {
    ...toLocalizedMediaListItem(locale, item),
    lead: item.lead[locale],
    storyParagraphs: item.storyParagraphs.map((paragraph) => paragraph[locale]),
    tags: item.tags.map((tag) => tag[locale]),
    durationLabel: item.durationLabel?.[locale],
    photoCount: item.photoCount,
    galleryImages: item.galleryImages.map((image) => ({
      src: image.src,
      alt: image.alt[locale],
    })),
    relatedBookAuthorId: item.creatorId,
  };
}

function buildAppliedFilters(query: MediaListQuery): AppliedMediaFilters {
  return {
    q: query.q,
    mediaType: query.mediaType,
  };
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

export function parseMultimediaListQueryFromSearchParams(
  searchParams: URLSearchParams,
): MediaListQuery {
  return normalizeQuery({
    q: searchParams.get("q") ?? undefined,
    mediaType: parseMediaType(searchParams.get("mediaType")),
    cursor: searchParams.get("cursor") ?? undefined,
    limit: parseNumber(searchParams.get("limit")) ?? DEFAULT_LIMIT,
  });
}

export function parseMultimediaListQueryFromObject(raw: RawSearchParams): MediaListQuery {
  return parseMultimediaListQueryFromSearchParams(toUrlSearchParams(raw));
}

export function normalizeMultimediaListQuery(query: Partial<MediaListQuery>): MediaListQuery {
  return normalizeQuery(query);
}

export async function getMediaBySlug(locale: Locale, slug: string): Promise<MediaDetail | null> {
  const normalizedSlug = normalizeSlug(slug);
  const media = seedMediaItems.find((seedMedia) => seedMedia.slug === normalizedSlug);

  if (!media) {
    return null;
  }

  return toLocalizedMediaDetail(locale, media);
}

export async function getRelatedMedia(
  locale: Locale,
  currentMedia: Pick<MediaDetail, "id" | "mediaType">,
  limit = 4,
): Promise<MediaListItem[]> {
  const safeLimit = clamp(limit, 1, 12);
  const sameType = seedMediaItems
    .filter(
      (seedMedia) =>
        seedMedia.id !== currentMedia.id && seedMedia.mediaType === currentMedia.mediaType,
    )
    .sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    )
    .map((seedMedia) => toLocalizedMediaListItem(locale, seedMedia));

  if (sameType.length >= safeLimit) {
    return sameType.slice(0, safeLimit);
  }

  const excludedIds = new Set([currentMedia.id, ...sameType.map((media) => media.id)]);
  const fallbackMedia = seedMediaItems
    .filter((seedMedia) => !excludedIds.has(seedMedia.id))
    .sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    )
    .map((seedMedia) => toLocalizedMediaListItem(locale, seedMedia));

  return [...sameType, ...fallbackMedia].slice(0, safeLimit);
}

export async function getMediaRelatedBooks(
  locale: Locale,
  currentMedia: Pick<MediaDetail, "relatedBookAuthorId">,
  limit = 4,
): Promise<BookListItem[]> {
  const safeLimit = clamp(limit, 1, 12);
  const pickedBooks = new Map<string, BookListItem>();

  if (currentMedia.relatedBookAuthorId) {
    const authoredBooks = await getBooksByAuthor(
      locale,
      currentMedia.relatedBookAuthorId,
      safeLimit + 4,
    );

    for (const book of authoredBooks) {
      pickedBooks.set(book.id, book);

      if (pickedBooks.size >= safeLimit) {
        break;
      }
    }
  }

  if (pickedBooks.size < safeLimit) {
    const fallbackBooks = await searchBooks(locale, { limit: 24 });

    for (const book of fallbackBooks.items) {
      if (!pickedBooks.has(book.id)) {
        pickedBooks.set(book.id, book);
      }

      if (pickedBooks.size >= safeLimit) {
        break;
      }
    }
  }

  return [...pickedBooks.values()].slice(0, safeLimit);
}

export async function searchMultimedia(
  locale: Locale,
  queryInput: Partial<MediaListQuery>,
): Promise<MediaListResponse> {
  const query = normalizeQuery(queryInput);
  const keyword = query.q?.toLowerCase();

  const filtered = seedMediaItems.filter((item) => {
    if (query.mediaType && item.mediaType !== query.mediaType) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const haystack =
      `${item.title[locale]} ${item.description[locale]} ${item.creator[locale]}`.toLowerCase();
    return haystack.includes(keyword);
  });

  const sorted = [...filtered].sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );

  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const pageItems = sorted.slice(safeOffset, safeOffset + query.limit);
  const items = pageItems.map((item) => toLocalizedMediaListItem(locale, item));
  const nextOffset = safeOffset + items.length;
  const nextCursor = nextOffset < sorted.length ? String(nextOffset) : null;

  return {
    items,
    total: sorted.length,
    nextCursor,
    appliedFilters: buildAppliedFilters(query),
  };
}
