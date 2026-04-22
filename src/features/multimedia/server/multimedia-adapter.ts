import { getBooksByAuthor, searchBooks } from "@/features/books/server/books-adapter";
import type { BookListItem } from "@/features/books/schemas/books";
import type { Locale } from "@/lib/i18n";

import type {
  AppliedMediaFilters,
  BackendMultimediaRecord,
  BackendMultimediaResponse,
  MediaDetail,
  MediaListItem,
  MediaListQuery,
  MediaListResponse,
  MediaType,
} from "@/features/multimedia/schemas/multimedia";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 500;
const MULTIMEDIA_ENDPOINT = "/api/web/multimedia";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const DEFAULT_MEDIA_CREATOR = "မဟာစာပေ";
const FALLBACK_VIDEO_IMAGE = "/images/home/real/media/media-1.jpg";
const FALLBACK_PHOTO_IMAGE = "/images/home/real/media/media-3.jpg";

const MEDIA_TYPES = new Set<MediaType>(["video", "photo"]);

type RawSearchParams = Record<string, string | string[] | undefined>;

type BackendMultimediaListRequestQuery = {
  page: number;
  limit: number;
  type?: MediaType;
  searchName?: string;
};

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

function normalizeWhitespace(value: string) {
  return value.trim().replaceAll(/\s+/g, " ");
}

function stripHtmlToText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll(/&nbsp;/gi, " ")
    .replaceAll(/&amp;/gi, "&")
    .replaceAll(/&quot;/gi, '"')
    .replaceAll(/&#39;/gi, "'")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function toSafeInteger(value: number | null | undefined, fallback = 0) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.round(value);
}

function toMediaType(value: string | null | undefined): MediaType {
  return value === "video" ? "video" : "photo";
}

function toSafeStringArray(values: string[] | null | undefined) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function resolveBackendPublishedAt(media: BackendMultimediaRecord) {
  const candidates = [media.uploadedTime, media.createdAt, media.updatedAt];

  for (const candidate of candidates) {
    const timestamp = Date.parse(candidate ?? "");

    if (Number.isFinite(timestamp)) {
      return new Date(timestamp).toISOString();
    }
  }

  return new Date(0).toISOString();
}

function resolveBackendPublishedTimestamp(media: BackendMultimediaRecord) {
  return Date.parse(resolveBackendPublishedAt(media));
}

function sortBackendMediaDescending(left: BackendMultimediaRecord, right: BackendMultimediaRecord) {
  const timestampDiff =
    resolveBackendPublishedTimestamp(right) - resolveBackendPublishedTimestamp(left);

  if (timestampDiff !== 0) {
    return timestampDiff;
  }

  return left.id.localeCompare(right.id);
}

function makeSlugPart(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");

  return normalized;
}

function buildBackendMediaSlug(media: BackendMultimediaRecord) {
  const titlePart = makeSlugPart(media.title || "");
  const idPart =
    media.id
      .toLowerCase()
      .replaceAll(/[^a-z0-9]/g, "")
      .slice(0, 12) || "media";

  if (!titlePart) {
    return `media-${idPart}`;
  }

  return `${titlePart}-${idPart}`;
}

function extractContentParagraphs(content: string) {
  const paragraphMatches = content.match(/<p[^>]*>[\s\S]*?<\/p>/gi) ?? [];
  const paragraphs = paragraphMatches
    .map((paragraph) => stripHtmlToText(paragraph))
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const plainText = stripHtmlToText(content);

  if (!plainText) {
    return [];
  }

  return [plainText];
}

function resolveYouTubeVideoId(value: string) {
  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (!url.hostname.includes("youtube.com")) {
      return null;
    }

    const watchId = url.searchParams.get("v");

    if (watchId) {
      return watchId;
    }

    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (pathSegments.length >= 2 && ["embed", "shorts", "live"].includes(pathSegments[0])) {
      return pathSegments[1] ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

function resolveYouTubeThumbnailFromUrls(urls: string[]) {
  for (const url of urls) {
    const videoId = resolveYouTubeVideoId(url);

    if (videoId) {
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  return null;
}

function resolveBackendPrimaryImage(media: BackendMultimediaRecord) {
  const images = toSafeStringArray(media.imageUrl);

  if (images.length > 0) {
    return images[0];
  }

  if (toMediaType(media.mediaType) === "video") {
    const youtubeThumbnail = resolveYouTubeThumbnailFromUrls(toSafeStringArray(media.youtubeUrl));

    if (youtubeThumbnail) {
      return youtubeThumbnail;
    }
  }

  return toMediaType(media.mediaType) === "video" ? FALLBACK_VIDEO_IMAGE : FALLBACK_PHOTO_IMAGE;
}

function getActiveBackendMedia(mediaItems: BackendMultimediaRecord[]) {
  return mediaItems.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    return toSafeInteger(item.active, 0) === 1 && toSafeInteger(item.deletedStatus, 0) === 0;
  });
}

function resolveBackendNarrative(media: BackendMultimediaRecord, title: string) {
  const storyParagraphs = extractContentParagraphs(media.content);
  const plainContent = stripHtmlToText(media.content);
  const lead = storyParagraphs[0] ?? truncateText(plainContent || title, 260);
  const description = truncateText((storyParagraphs[0] ?? plainContent) || title, 200);

  return {
    lead,
    description,
    storyParagraphs: storyParagraphs.length > 0 ? storyParagraphs : [lead],
  };
}

function toBackendMediaListItem(media: BackendMultimediaRecord): MediaListItem {
  const title = normalizeWhitespace(media.title || "") || "Untitled Multimedia";
  const narrative = resolveBackendNarrative(media, title);

  return {
    id: media.id,
    slug: buildBackendMediaSlug(media),
    title,
    description: narrative.description,
    creator: DEFAULT_MEDIA_CREATOR,
    mediaType: toMediaType(media.mediaType),
    publishedAt: resolveBackendPublishedAt(media),
    imageSrc: resolveBackendPrimaryImage(media),
    imageAlt: `${title} media`,
  };
}

function toBackendMediaDetail(media: BackendMultimediaRecord): MediaDetail {
  const base = toBackendMediaListItem(media);
  const narrative = resolveBackendNarrative(media, base.title);
  const imageUrls = toSafeStringArray(media.imageUrl);
  const youtubeUrls = toSafeStringArray(media.youtubeUrl);
  const uploadedVideoUrls = toSafeStringArray(media.videoUrl);
  const gallerySources = imageUrls.length > 0 ? imageUrls : [base.imageSrc];

  return {
    ...base,
    lead: narrative.lead,
    storyParagraphs: narrative.storyParagraphs,
    tags: [],
    durationLabel: undefined,
    photoCount: base.mediaType === "photo" ? gallerySources.length : undefined,
    youtubeUrls,
    uploadedVideoUrls,
    primaryVideoUrl: youtubeUrls[0] ?? uploadedVideoUrls[0],
    galleryImages: gallerySources.map((src, index) => ({
      src,
      alt: `${base.title} ${index + 1}`,
    })),
    relatedBookAuthorId: undefined,
  };
}

async function fetchMultimediaFromBackend(locale: Locale): Promise<BackendMultimediaRecord[]> {
  const response = await fetch(`${BOOK_API_BASE_URL}${MULTIMEDIA_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Multimedia API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendMultimediaResponse>;

  if (payload.error) {
    throw new Error(payload.message || "Multimedia API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Multimedia API returned an invalid response payload");
  }

  return payload.data.filter((item): item is BackendMultimediaRecord => {
    return Boolean(item && typeof item === "object" && typeof item.id === "string");
  });
}

async function fetchMultimediaFromBackendWithQuery(
  locale: Locale,
  query: BackendMultimediaListRequestQuery,
): Promise<BackendMultimediaRecord[]> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.type) {
    params.set("type", query.type);
  }

  if (query.searchName) {
    params.set("searchName", query.searchName);
  }

  const response = await fetch(`${BOOK_API_BASE_URL}${MULTIMEDIA_ENDPOINT}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Multimedia API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendMultimediaResponse>;

  if (payload.error) {
    throw new Error(payload.message || "Multimedia API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Multimedia API returned an invalid response payload");
  }

  return payload.data.filter((item): item is BackendMultimediaRecord => {
    return Boolean(item && typeof item === "object" && typeof item.id === "string");
  });
}

function matchesBackendMediaKeyword(media: BackendMultimediaRecord, keyword: string) {
  const narrative = resolveBackendNarrative(media, normalizeWhitespace(media.title || ""));
  const haystack = `${media.title} ${narrative.description} ${DEFAULT_MEDIA_CREATOR}`.toLowerCase();

  return haystack.includes(keyword);
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

function parsePositiveInteger(value: string | null): number | undefined {
  const parsed = parseNumber(value);

  if (parsed === undefined) {
    return undefined;
  }

  const integer = Math.floor(parsed);

  if (!Number.isFinite(integer) || integer < 1) {
    return undefined;
  }

  return integer;
}

function parseMediaType(value: string | null): MediaType | undefined {
  if (!value) {
    return undefined;
  }

  if (!MEDIA_TYPES.has(value as MediaType)) {
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
    youtubeUrls: [],
    uploadedVideoUrls: [],
    primaryVideoUrl: undefined,
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
  const normalizedLimit = parsePositiveInteger(searchParams.get("limit")) ?? DEFAULT_LIMIT;
  const page = parsePositiveInteger(searchParams.get("page"));
  const typeParam = searchParams.get("type") ?? searchParams.get("mediaType");

  return normalizeQuery({
    q: searchParams.get("q") ?? searchParams.get("searchName") ?? undefined,
    mediaType: parseMediaType(typeParam),
    cursor:
      searchParams.get("cursor") ??
      (page === undefined ? undefined : String((page - 1) * normalizedLimit)),
    limit: normalizedLimit,
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

  try {
    const backendMedia = getActiveBackendMedia(await fetchMultimediaFromBackend(locale));
    const matchedMedia = backendMedia.find((media) => {
      return (
        normalizeSlug(media.id) === normalizedSlug ||
        normalizeSlug(buildBackendMediaSlug(media)) === normalizedSlug
      );
    });

    if (matchedMedia) {
      return toBackendMediaDetail(matchedMedia);
    }
  } catch {
    // Fall through to seed fallback.
  }

  const media = seedMediaItems.find(
    (seedMedia) => normalizeSlug(seedMedia.slug) === normalizedSlug,
  );

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

  try {
    const backendMedia = getActiveBackendMedia(await fetchMultimediaFromBackend(locale));
    const sameType = backendMedia
      .filter(
        (media) =>
          media.id !== currentMedia.id && toMediaType(media.mediaType) === currentMedia.mediaType,
      )
      .sort(sortBackendMediaDescending)
      .map((media) => toBackendMediaListItem(media));

    if (sameType.length >= safeLimit) {
      return sameType.slice(0, safeLimit);
    }

    const excludedIds = new Set([currentMedia.id, ...sameType.map((media) => media.id)]);
    const fallbackMedia = backendMedia
      .filter((media) => !excludedIds.has(media.id))
      .sort(sortBackendMediaDescending)
      .map((media) => toBackendMediaListItem(media));

    const merged = [...sameType, ...fallbackMedia].slice(0, safeLimit);

    if (merged.length > 0) {
      return merged;
    }
  } catch {
    // Fall through to seed fallback.
  }

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
  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0;
  const page = Math.floor(safeOffset / query.limit) + 1;

  try {
    const backendMedia = getActiveBackendMedia(
      await fetchMultimediaFromBackendWithQuery(locale, {
        page,
        limit: query.limit,
        type: query.mediaType,
        searchName: query.q,
      }),
    )
      .filter((media) => {
        if (!query.mediaType) {
          return true;
        }

        return toMediaType(media.mediaType) === query.mediaType;
      })
      .sort(sortBackendMediaDescending)
      .map((media) => toBackendMediaListItem(media));
    const nextOffset = safeOffset + backendMedia.length;
    const hasNextPage = backendMedia.length >= query.limit;
    const nextCursor = hasNextPage ? String(nextOffset) : null;
    const total = hasNextPage ? nextOffset + 1 : nextOffset;

    return {
      items: backendMedia,
      total,
      nextCursor,
      appliedFilters: buildAppliedFilters(query),
    };
  } catch {
    // Fall through to existing backend and seed fallback paths.
  }

  try {
    const backendMedia = getActiveBackendMedia(await fetchMultimediaFromBackend(locale));
    const filtered = backendMedia.filter((media) => {
      if (query.mediaType && toMediaType(media.mediaType) !== query.mediaType) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return matchesBackendMediaKeyword(media, keyword);
    });

    const sorted = [...filtered].sort(sortBackendMediaDescending);

    const pageItems = sorted.slice(safeOffset, safeOffset + query.limit);
    const items = pageItems.map((media) => toBackendMediaListItem(media));
    const nextOffset = safeOffset + items.length;
    const nextCursor = nextOffset < sorted.length ? String(nextOffset) : null;

    return {
      items,
      total: sorted.length,
      nextCursor,
      appliedFilters: buildAppliedFilters(query),
    };
  } catch {
    // Fall through to seed fallback.
  }

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
