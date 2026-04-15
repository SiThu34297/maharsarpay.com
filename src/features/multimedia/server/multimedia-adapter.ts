import type { Locale } from "@/lib/i18n";

import type {
  AppliedMediaFilters,
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
  creator: LocalizedValue;
  mediaType: MediaType;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

type SeedMedia = {
  id: string;
  title: LocalizedValue;
  description: LocalizedValue;
  creator: LocalizedValue;
  mediaType: MediaType;
  publishedAt: string;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

const mediaTemplates: MediaTemplate[] = [
  {
    slug: "behind-the-shelves",
    title: { en: "Behind the Shelves", my: "စာအုပ်စင်နောက်ကွယ်" },
    description: {
      en: "A visual walk through this month’s standout picks and reader favorites.",
      my: "ဒီလအတွင်း လူကြိုက်များသော စာအုပ်များကို ပုံရိပ်များဖြင့် အနီးကပ် တင်ဆက်ထားသည်။",
    },
    creator: { en: "Mahar Studio", my: "မဟာစတူဒီယို" },
    mediaType: "video",
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
    creator: { en: "Editorial Team", my: "တည်းဖြတ်အဖွဲ့" },
    mediaType: "video",
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
    creator: { en: "Photo Desk", my: "ဓာတ်ပုံအဖွဲ့" },
    mediaType: "photo",
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
    creator: { en: "Community Team", my: "အသိုင်းအဝိုင်းအဖွဲ့" },
    mediaType: "photo",
    imageSrc: "/images/home/real/media/media-4.jpg",
    imageAlt: {
      en: "Bookstore stories photo feature cover",
      my: "စာအုပ်ဆိုင်ပုံပြင်များ ဓာတ်ပုံမျက်နှာဖုံး",
    },
  },
];

const seedMediaItems: SeedMedia[] = Array.from({ length: 40 }, (_, index) => {
  const template = mediaTemplates[index % mediaTemplates.length];
  const cycle = Math.floor(index / mediaTemplates.length);
  const edition = cycle > 0 ? cycle + 1 : null;

  return {
    id: `media-list-${index + 1}`,
    title: {
      en: edition ? `${template.title.en} Edition ${edition}` : template.title.en,
      my: edition ? `${template.title.my} အပိုင်း ${edition}` : template.title.my,
    },
    description: template.description,
    creator: template.creator,
    mediaType: template.mediaType,
    publishedAt: new Date(Date.UTC(2026, 2, 31 - index)).toISOString(),
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

function toLocalizedMediaItem(locale: Locale, item: SeedMedia): MediaListItem {
  return {
    id: item.id,
    title: item.title[locale],
    description: item.description[locale],
    creator: item.creator[locale],
    mediaType: item.mediaType,
    publishedAt: item.publishedAt,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt[locale],
  };
}

function buildAppliedFilters(query: MediaListQuery): AppliedMediaFilters {
  return {
    q: query.q,
    mediaType: query.mediaType,
  };
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
  const items = pageItems.map((item) => toLocalizedMediaItem(locale, item));
  const nextOffset = safeOffset + items.length;
  const nextCursor = nextOffset < sorted.length ? String(nextOffset) : null;

  return {
    items,
    total: sorted.length,
    nextCursor,
    appliedFilters: buildAppliedFilters(query),
  };
}
