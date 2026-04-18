import type { Locale } from "@/lib/i18n";

import type {
  AppliedAuthorFilters,
  BackendAuthorRecord,
  BackendAuthorsResponse,
  AuthorDetail,
  AuthorListItem,
  AuthorListQuery,
  AuthorListResponse,
} from "@/features/authors/schemas/authors";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const AUTHORS_ENDPOINT = "/api/web/authors";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";

type RawSearchParams = Record<string, string | string[] | undefined>;

type BackendAuthorsListRequestQuery = {
  page: number;
  limit: number;
  searchName?: string;
};

type LocalizedValue = {
  en: string;
  my: string;
};

type SeedAuthor = {
  id: string;
  slug: string;
  name: LocalizedValue;
  genreId: string;
  shortBio: LocalizedValue;
  longBio: LocalizedValue;
  createdAt: string;
  imageSrc: string;
  imageAlt: LocalizedValue;
};

type RuntimeAuthor = {
  id: string;
  slug: string;
  name: string;
  shortBio: string;
  longBio: string;
  note: string;
  bookCount: number;
  createdAt: string;
  imageSrc: string;
  imageAlt: string;
  searchText: string;
};

const seedAuthors: SeedAuthor[] = [
  {
    id: "author-moe-nadi",
    slug: "moe-nadi",
    name: { en: "Moe Nadi", my: "မိုးနဒီ" },
    genreId: "fiction",
    shortBio: {
      en: "Moe Nadi writes reflective novels about family memory and second chances.",
      my: "မိုးနဒီသည် မိသားစုမှတ်ဉာဏ်နှင့် အသစ်ပြန်စတင်မှုအကြောင်း အတွေးအမြင်ပါတဲ့ ဝတ္ထုများရေးသားသူဖြစ်သည်။",
    },
    longBio: {
      en: "Known for elegant prose and emotionally layered characters, Moe Nadi explores how ordinary people rebuild their lives after difficult seasons. Her work blends intimate family stories with contemporary social themes and has become a favorite among young urban readers.",
      my: "ချောမွေ့လှပသည့် စာသားပုံစံနှင့် စိတ်ခံစားမှုနက်ရှိုင်းသော ဇာတ်ကောင်ဖန်တီးမှုများကြောင့် လူသိများသော မိုးနဒီ၏လက်ရာများတွင် ခက်ခဲသောကာလများနောက် လူများသည် ဘဝကို မည်သို့ ပြန်လည်တည်ဆောက်သည်ကို ဖော်ပြထားသည်။ မိသားစုအတွင်းကျသော ပုံပြင်များနှင့် ခေတ်ပြိုင်လူမှုရေးအကြောင်းအရာများကို ထိရောက်စွာ ချိတ်ဆက်တင်ပြနိုင်သောကြောင့် မြို့ပြလူငယ်စာဖတ်သူများကြား လူကြိုက်များသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 31)).toISOString(),
    imageSrc: "/images/home/real/authors/author-1.jpg",
    imageAlt: { en: "Portrait of Moe Nadi", my: "မိုးနဒီ ရုပ်ပုံ" },
  },
  {
    id: "author-khin-aye",
    slug: "khin-aye",
    name: { en: "Khin Aye", my: "ခင်အေး" },
    genreId: "history",
    shortBio: {
      en: "Khin Aye brings archival history to life through vivid storytelling.",
      my: "ခင်အေးသည် သမိုင်းမှတ်တမ်းများကို အသက်ဝင်သောပုံပြင်များအဖြစ် ဖန်တီးတင်ပြနိုင်သူဖြစ်သည်။",
    },
    longBio: {
      en: "Blending field research, oral narratives, and careful historical context, Khin Aye creates stories that feel both cinematic and grounded. Her writing is often used in reading clubs that focus on Myanmar heritage and place-based memory.",
      my: "လက်တွေ့သုတေသန၊ ပါးစပ်ပြောမှတ်တမ်းများနှင့် သမိုင်းဆိုင်ရာနောက်ခံတည်ဆောက်မှုကို ပေါင်းစပ်အသုံးပြုပြီး ခင်အေးသည် ရုပ်ရှင်ဆန်သော်လည်း တည်ငြိမ်ယုံကြည်ရသော ပုံပြင်များ ဖန်တီးထားသည်။ မြန်မာ့အမွေအနှစ်နှင့် နေရာဆိုင်ရာမှတ်ဉာဏ်များကို အာရုံစိုက်သော စာဖတ်ကလပ်များတွင်လည်း ထင်ရှားစွာ ဖတ်ရှုခံရသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 30)).toISOString(),
    imageSrc: "/images/home/real/authors/author-2.jpg",
    imageAlt: { en: "Portrait of Khin Aye", my: "ခင်အေး ရုပ်ပုံ" },
  },
  {
    id: "author-sai-nay-lin",
    slug: "sai-nay-lin",
    name: { en: "Sai Nay Lin", my: "စိုင်းနေလင်း" },
    genreId: "travel",
    shortBio: {
      en: "Sai Nay Lin writes immersive travel narratives rooted in local voices.",
      my: "စိုင်းနေလင်းသည် ဒေသခံအသံများကို အခြေခံထားသော ခရီးသွားပုံပြင်များရေးသားသူဖြစ်သည်။",
    },
    longBio: {
      en: "From lakeside communities to mountain routes, Sai Nay Lin documents travel as a way of listening. His essays and letters highlight food, craft, language, and everyday rhythm, helping readers see places through people rather than postcards.",
      my: "ရေကန်ကမ်းရွာများမှ တောင်ပေါ်လမ်းကြောင်းများအထိ စိုင်းနေလင်းသည် ခရီးသွားခြင်းကို နားထောင်သိမြင်သည့် လုပ်ငန်းစဉ်တစ်ခုအဖြစ် မှတ်တမ်းတင်သည်။ အစားအစာ၊ လက်မှု၊ ဘာသာစကားနှင့် နေ့စဉ်ဘဝရစ်သမ်တို့ကို ထင်ဟပ်စေသော သူ၏စာများကြောင့် စာဖတ်သူများသည် နေရာကို postcard မဟုတ်ဘဲ လူများမှတဆင့် နားလည်နိုင်လာသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 29)).toISOString(),
    imageSrc: "/images/home/real/authors/author-3.jpg",
    imageAlt: { en: "Portrait of Sai Nay Lin", my: "စိုင်းနေလင်း ရုပ်ပုံ" },
  },
  {
    id: "author-thandar-win",
    slug: "thandar-win",
    name: { en: "Thandar Win", my: "သန္တာဝင်း" },
    genreId: "essays",
    shortBio: {
      en: "Thandar Win captures urban culture through clear, thoughtful essays.",
      my: "သန္တာဝင်းသည် မြို့ပြယဉ်ကျေးမှုကို ရှင်းလင်းစဉ်းစားထားသော ဆောင်းပါးများဖြင့် ဖော်ပြသည်။",
    },
    longBio: {
      en: "Her essays focus on neighborhoods, conversations, and the changing social atmosphere of contemporary Myanmar cities. Readers value her balanced tone and close observation of ordinary details that often go unnoticed.",
      my: "သန္တာဝင်း၏ ဆောင်းပါးများတွင် မြို့ရပ်ကွက်များ၊ လူမှုဆက်ဆံရေးစကားဝိုင်းများနှင့် ခေတ်ပြိုင်မြို့ပြလူမှုအခြေအနေပြောင်းလဲမှုများကို အဓိကထားရေးသားထားသည်။ သာမန်ဖြစ်စဉ်အသေးစိတ်များကို သတိထားမြင်နိုင်သော သူမ၏အသံကြောင့် စာဖတ်သူများကြား ယုံကြည်မှုမြင့်မားသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 28)).toISOString(),
    imageSrc: "/images/home/real/authors/author-4.jpg",
    imageAlt: { en: "Portrait of Thandar Win", my: "သန္တာဝင်း ရုပ်ပုံ" },
  },
  {
    id: "author-aung-min",
    slug: "aung-min",
    name: { en: "Aung Min", my: "အောင်မင်း" },
    genreId: "mystery",
    shortBio: {
      en: "Aung Min crafts suspense-driven stories set in familiar local spaces.",
      my: "အောင်မင်းသည် နေ့စဉ်ပတ်ဝန်းကျင်များအတွင်း စိတ်လှုပ်ရှားဖွယ် လျှို့ဝှက်ဇာတ်လမ်းများရေးသားသူဖြစ်သည်။",
    },
    longBio: {
      en: "Best known for tightly paced plotting and atmospheric settings, Aung Min builds mysteries around tea shops, neighborhoods, and small-town rumor networks. His books are popular with readers who enjoy fast-moving, clue-based narratives.",
      my: "မြန်ဆန်တိကျသော ဇာတ်လမ်းလှည့်ကွက်များနှင့် လေထုဖန်တီးနိုင်မှုကြောင့် လူသိများသော အောင်မင်းသည် လက်ဖက်ရည်ဆိုင်များ၊ ရပ်ကွက်များနှင့် မြို့ငယ်သတင်းလွှင့်ကွန်ယက်များကို အခြေခံ၍ လျှို့ဝှက်ဇာတ်လမ်းတည်ဆောက်သည်။ သဲလွန်စအခြေပြု စိတ်ဝင်စားဖွယ် ဇာတ်ကြောင်းများနှစ်သက်သူများအတွက် အထူးလူကြိုက်များသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 27)).toISOString(),
    imageSrc: "/images/home/real/authors/author-5.jpg",
    imageAlt: { en: "Portrait of Aung Min", my: "အောင်မင်း ရုပ်ပုံ" },
  },
  {
    id: "author-nan-hnin",
    slug: "nan-hnin",
    name: { en: "Nan Hnin", my: "နန်းနှင်း" },
    genreId: "poetry",
    shortBio: {
      en: "Nan Hnin's poetry blends mountain landscapes with intimate emotion.",
      my: "နန်းနှင်း၏ ကဗျာများတွင် တောင်တန်းရှုခင်းနှင့် အတွင်းစိတ်ခံစားချက်များ ပေါင်းစပ်လျက်ရှိသည်။",
    },
    longBio: {
      en: "Writing in both short free verse and long narrative poems, Nan Hnin explores longing, belonging, and resilience. Her readings are frequently featured in youth literary programs and community poetry circles.",
      my: "လွတ်လပ်ကဗျာတိုများနှင့် ဇာတ်ကြောင်းပါကဗျာရှည်များ နှစ်မျိုးစလုံးဖြင့် နန်းနှင်းသည် အလွမ်း၊ အမှီအခိုခံစားချက်နှင့် သန်မာမှုတို့ကို ရေးသားဖော်ထုတ်သည်။ လူငယ်စာပေအစီအစဉ်များနှင့် ရပ်ရွာကဗျာဝိုင်းများတွင်လည်း မကြာခဏ ဖိတ်ခေါ်ဖတ်ရှုခံရသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 26)).toISOString(),
    imageSrc: "/images/home/real/authors/author-6.jpg",
    imageAlt: { en: "Portrait of Nan Hnin", my: "နန်းနှင်း ရုပ်ပုံ" },
  },
  {
    id: "author-kyaw-zeya",
    slug: "kyaw-zeya",
    name: { en: "Kyaw Zeya", my: "ကျော်ဇေယျ" },
    genreId: "romance",
    shortBio: {
      en: "Kyaw Zeya writes heartfelt romance centered on river-town life.",
      my: "ကျော်ဇေယျသည် မြစ်ကမ်းမြို့ဘဝနောက်ခံပါသော အနူးညံ့အချစ်ဝတ္ထုများရေးသားသူဖြစ်သည်။",
    },
    longBio: {
      en: "His stories are known for warm dialogue, grounded relationships, and memorable supporting characters. Kyaw Zeya often writes about choices people make between duty and desire.",
      my: "သူ၏ ဝတ္ထုများတွင် အပြန်အလှန်စကားပြောသဘာဝ၊ ယုံကြည်စိတ်ချရသော ဆက်ဆံရေးများနှင့် မမေ့နိုင်သော အရန်ဇာတ်ကောင်များကြောင့် ထင်ရှားသည်။ တာဝန်နှင့် ဆန္ဒကြား ရွေးချယ်မှုများကိုလည်း မကြာခဏ ထည့်သွင်းဖော်ပြသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 25)).toISOString(),
    imageSrc: "/images/home/real/authors/author-1.jpg",
    imageAlt: { en: "Portrait of Kyaw Zeya", my: "ကျော်ဇေယျ ရုပ်ပုံ" },
  },
  {
    id: "author-may-thu",
    slug: "may-thu",
    name: { en: "May Thu", my: "မေသူ" },
    genreId: "self-development",
    shortBio: {
      en: "May Thu writes practical books on focus, habits, and resilience.",
      my: "မေသူသည် အာရုံစူးစိုက်မှု၊ အလေ့အကျင့်နှင့် သန်မာမှုဆိုင်ရာ လက်တွေ့ကျစာအုပ်များရေးသားသူဖြစ်သည်။",
    },
    longBio: {
      en: "With a background in mentoring and workplace learning, May Thu turns complex self-development concepts into simple routines readers can apply immediately. Her writing style is direct, calm, and action-oriented.",
      my: "အလုပ်ခွင်လေ့လာရေးနှင့် မျှဝေသင်ကြားမှုနောက်ခံရှိသော မေသူသည် ကိုယ်တိုးတက်ရေးအကြောင်းအရာများကို နေ့စဉ်အသုံးချနိုင်သည့် နည်းလမ်းလွယ်များအဖြစ် ပြောင်းလဲဖော်ပြသည်။ သူမ၏ရေးနည်းမှာ တိုက်ရိုက်၊ တည်ငြိမ်ပြီး လုပ်ဆောင်နိုင်မှုကို အဓိကထားသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 24)).toISOString(),
    imageSrc: "/images/home/real/authors/author-2.jpg",
    imageAlt: { en: "Portrait of May Thu", my: "မေသူ ရုပ်ပုံ" },
  },
  {
    id: "author-hnin-ei",
    slug: "hnin-ei",
    name: { en: "Hnin Ei", my: "နှင်းအိ" },
    genreId: "children",
    shortBio: {
      en: "Hnin Ei creates warm, imaginative stories for young readers.",
      my: "နှင်းအိသည် ကလေးစာဖတ်သူများအတွက် စိတ်ကူးယဉ်အပြည့်ရှိသော ပုံပြင်များရေးသားသည်။",
    },
    longBio: {
      en: "From bedtime tales to early-reader adventures, Hnin Ei focuses on kindness, curiosity, and family connection. Her books are often recommended by teachers for bilingual reading sessions.",
      my: "အိပ်ရာဝင်ပုံပြင်များမှ စာဖတ်လေ့လာစကလေးများအတွက် စွန့်စားခန်းဇာတ်လမ်းများအထိ နှင်းအိသည် ကြင်နာမှု၊ စူးစမ်းလိုစိတ်နှင့် မိသားစုချိတ်ဆက်မှုကို အဓိကထားရေးသားသည်။ နှစ်ဘာသာဖြင့် ဖတ်ရှုလေ့ကျင့်ခန်းများအတွက် ဆရာ၊ဆရာမများက မကြာခဏ အကြံပြုကြသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 23)).toISOString(),
    imageSrc: "/images/home/real/authors/author-3.jpg",
    imageAlt: { en: "Portrait of Hnin Ei", my: "နှင်းအိ ရုပ်ပုံ" },
  },
  {
    id: "author-ye-min-thu",
    slug: "ye-min-thu",
    name: { en: "Ye Min Thu", my: "ရဲမင်းသူ" },
    genreId: "biography",
    shortBio: {
      en: "Ye Min Thu profiles influential figures from arts and civic life.",
      my: "ရဲမင်းသူသည် အနုပညာနှင့် လူမှုဘဝထင်ရှားသူများအကြောင်း ရေးသားသူဖြစ်သည်။",
    },
    longBio: {
      en: "His biographies combine interviews, archival materials, and field notes to present nuanced portraits of modern Myanmar personalities. Readers appreciate the clarity and balance in his narrative approach.",
      my: "အင်တာဗျူးများ၊ မှတ်တမ်းအထောက်အထားများနှင့် လက်တွေ့မှတ်စုများကို ပေါင်းစပ်အသုံးပြုကာ ရဲမင်းသူသည် ခေတ်သစ်မြန်မာထင်ရှားသူများ၏ ဘက်စုံပုံရိပ်များကို ထင်ရှားစွာ တင်ဆက်သည်။ သူ၏ ရေးသားပုံတွင် ရှင်းလင်းမှုနှင့် ညီမျှမှုရှိသောကြောင့် စာဖတ်သူများက နှစ်သက်ကြသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 22)).toISOString(),
    imageSrc: "/images/home/real/authors/author-4.jpg",
    imageAlt: { en: "Portrait of Ye Min Thu", my: "ရဲမင်းသူ ရုပ်ပုံ" },
  },
  {
    id: "author-zar-chi",
    slug: "zar-chi",
    name: { en: "Zar Chi", my: "ဇာခြည်" },
    genreId: "contemporary-fiction",
    shortBio: {
      en: "Zar Chi explores modern relationships and identity in city life.",
      my: "ဇာခြည်သည် မြို့ပြဘဝအတွင်း ဆက်ဆံရေးနှင့် ကိုယ်ပိုင်အတ္တအကြောင်းကို ရေးသားသည်။",
    },
    longBio: {
      en: "Her contemporary fiction examines friendship, ambition, and social pressure among young professionals. Zar Chi is recognized for dialogue-rich scenes and emotionally precise character work.",
      my: "ဇာခြည်၏ ခေတ်ပြိုင်ဝတ္ထုများတွင် လူငယ်အလုပ်ခွင်ပတ်ဝန်းကျင်အတွင်း မိတ်ဆွေမှု၊ ရည်မှန်းချက်နှင့် လူမှုဖိအားများကို စူးစမ်းတင်ပြထားသည်။ စကားပြောပုံစံအသက်ဝင်မှုနှင့် ဇာတ်ကောင်စိတ်ခံစားချက်တိကျမှုအတွက် လူသိများသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 21)).toISOString(),
    imageSrc: "/images/home/real/authors/author-5.jpg",
    imageAlt: { en: "Portrait of Zar Chi", my: "ဇာခြည် ရုပ်ပုံ" },
  },
  {
    id: "author-phyo-sandar",
    slug: "phyo-sandar",
    name: { en: "Phyo Sandar", my: "ဖြိုးစန္ဒာ" },
    genreId: "social-commentary",
    shortBio: {
      en: "Phyo Sandar writes sharp commentary on social change and culture.",
      my: "ဖြိုးစန္ဒာသည် လူမှုရေးပြောင်းလဲမှုနှင့် ယဉ်ကျေးမှုအကြောင်း ချွန်ထက်စွာ သုံးသပ်ရေးသားသည်။",
    },
    longBio: {
      en: "Covering education, media, and civic participation, Phyo Sandar's essays connect daily headlines with long-term social patterns. Her pieces are widely shared in discussion groups and reading communities.",
      my: "ပညာရေး၊ မီဒီယာနှင့် လူမှုဝင်ရောက်ပါဝင်မှုအကြောင်းကို လေ့လာရေးသားသည့် ဖြိုးစန္ဒာ၏ ဆောင်းပါးများသည် နေ့စဉ်သတင်းများကို ရေရှည်လူမှုရုပ်ပုံများနှင့် ချိတ်ဆက်တင်ပြနိုင်သည်။ စာဖတ်အသိုင်းအဝိုင်းနှင့် ဆွေးနွေးဝိုင်းများတွင် အများအပြား မျှဝေဖတ်ရှုကြသည်။",
    },
    createdAt: new Date(Date.UTC(2026, 2, 20)).toISOString(),
    imageSrc: "/images/home/real/authors/author-6.jpg",
    imageAlt: { en: "Portrait of Phyo Sandar", my: "ဖြိုးစန္ဒာ ရုပ်ပုံ" },
  },
];

const seedAuthorImagePool = seedAuthors.map((author) => author.imageSrc);

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

function normalizeQuery(query: Partial<AuthorListQuery>): AuthorListQuery {
  const limit = clamp(query.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);

  return {
    q: query.q?.trim() || undefined,
    cursor: query.cursor || undefined,
    limit,
  };
}

function normalizeSlug(value: string) {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function normalizeAuthorName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBackendImageAlt(locale: Locale, name: string) {
  return locale === "my" ? `${name} ရုပ်ပုံ` : `Portrait of ${name}`;
}

function toAuthorListItem(author: RuntimeAuthor): AuthorListItem {
  return {
    id: author.id,
    slug: author.slug,
    name: author.name,
    imageSrc: author.imageSrc,
    imageAlt: author.imageAlt,
    note: author.note,
    bookCount: author.bookCount,
  };
}

function toAuthorDetail(author: RuntimeAuthor): AuthorDetail {
  return {
    ...toAuthorListItem(author),
    shortBio: author.shortBio,
    longBio: author.longBio,
  };
}

function toFallbackRuntimeAuthor(locale: Locale, author: SeedAuthor): RuntimeAuthor {
  const name = normalizeAuthorName(author.name[locale]);
  const note = author.shortBio[locale];
  const searchText = normalizeSearchText(`${author.name.en} ${author.name.my}`);

  return {
    id: author.id,
    slug: author.slug,
    name,
    shortBio: author.shortBio[locale],
    longBio: author.longBio[locale],
    note,
    bookCount: 0,
    createdAt: author.createdAt,
    imageSrc: author.imageSrc,
    imageAlt: author.imageAlt[locale],
    searchText,
  };
}

function toBackendRuntimeAuthor(
  locale: Locale,
  author: BackendAuthorRecord,
  slug: string,
  index: number,
): RuntimeAuthor {
  const name = normalizeAuthorName(author.name);
  const safeName = name || `Author ${author.id.slice(0, 8)}`;
  const note = author.note?.trim() || "";
  const fallbackImage = seedAuthorImagePool[index % seedAuthorImagePool.length];
  const searchText = normalizeSearchText(
    [author.name, author.alias, author.nameTag].filter(Boolean).join(" "),
  );

  return {
    id: author.id,
    slug,
    name: safeName,
    shortBio: note || safeName,
    longBio: note || safeName,
    note,
    bookCount: Number.isFinite(author.bookCount) ? Math.max(0, author.bookCount) : 0,
    createdAt: author.createdAt,
    imageSrc: author.authorImage ?? fallbackImage,
    imageAlt: formatBackendImageAlt(locale, safeName),
    searchText,
  };
}

function toBackendAuthorSlugTuples(authors: BackendAuthorRecord[]) {
  const seenSlugs = new Set<string>();

  return authors.map((author) => {
    const baseSlug =
      toSlug(author.name) || toSlug(author.alias ?? "") || `author-${author.id.slice(0, 8)}`;
    let slug = baseSlug;

    if (seenSlugs.has(slug)) {
      slug = `${baseSlug}-${author.id.slice(0, 6).toLowerCase()}`;
    }

    seenSlugs.add(slug);

    return {
      author,
      slug,
    };
  });
}

function sortAuthorsByCreatedAt(authors: RuntimeAuthor[]) {
  return [...authors].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function toFallbackRuntimeAuthors(locale: Locale) {
  return seedAuthors.map((author) => toFallbackRuntimeAuthor(locale, author));
}

async function fetchRuntimeAuthorsFromBackend(locale: Locale): Promise<RuntimeAuthor[]> {
  const response = await fetch(`${BOOK_API_BASE_URL}${AUTHORS_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Authors API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendAuthorsResponse>;

  if (payload.error || payload.authorized === false) {
    throw new Error(payload.message || "Authors API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Authors API returned an invalid response payload");
  }

  const activeAuthors = payload.data.filter((author) => author.status === 1);

  return toBackendAuthorSlugTuples(activeAuthors).map(({ author, slug }, index) =>
    toBackendRuntimeAuthor(locale, author, slug, index),
  );
}

async function fetchRuntimeAuthorsFromBackendWithQuery(
  locale: Locale,
  query: BackendAuthorsListRequestQuery,
): Promise<RuntimeAuthor[]> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  if (query.searchName) {
    params.set("searchName", query.searchName);
  }

  const response = await fetch(`${BOOK_API_BASE_URL}${AUTHORS_ENDPOINT}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Authors API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendAuthorsResponse>;

  if (payload.error || payload.authorized === false) {
    throw new Error(payload.message || "Authors API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Authors API returned an invalid response payload");
  }

  const activeAuthors = payload.data.filter((author) => author.status === 1);

  return toBackendAuthorSlugTuples(activeAuthors).map(({ author, slug }, index) =>
    toBackendRuntimeAuthor(locale, author, slug, index),
  );
}

async function getRuntimeAuthors(locale: Locale) {
  try {
    const backendAuthors = await fetchRuntimeAuthorsFromBackend(locale);
    return sortAuthorsByCreatedAt(backendAuthors);
  } catch {
    // Fallback to local seed data if backend is unavailable.
  }

  return sortAuthorsByCreatedAt(toFallbackRuntimeAuthors(locale));
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

function buildAppliedFilters(query: AuthorListQuery): AppliedAuthorFilters {
  return {
    q: query.q,
  };
}

export function parseAuthorListQueryFromSearchParams(
  searchParams: URLSearchParams,
): AuthorListQuery {
  const normalizedLimit = parsePositiveInteger(searchParams.get("limit")) ?? DEFAULT_LIMIT;
  const page = parsePositiveInteger(searchParams.get("page"));

  return normalizeQuery({
    q: searchParams.get("q") ?? searchParams.get("searchName") ?? undefined,
    cursor:
      searchParams.get("cursor") ??
      (page === undefined ? undefined : String((page - 1) * normalizedLimit)),
    limit: normalizedLimit,
  });
}

export function parseAuthorListQueryFromObject(raw: RawSearchParams): AuthorListQuery {
  return parseAuthorListQueryFromSearchParams(toUrlSearchParams(raw));
}

export function normalizeAuthorListQuery(query: Partial<AuthorListQuery>): AuthorListQuery {
  return normalizeQuery(query);
}

export async function getAuthorBySlug(locale: Locale, slug: string): Promise<AuthorDetail | null> {
  const normalizedSlug = normalizeSlug(slug);
  const authors = await getRuntimeAuthors(locale);
  const author = authors.find(
    (item) =>
      normalizeSlug(item.slug) === normalizedSlug || normalizeSlug(item.id) === normalizedSlug,
  );

  if (!author) {
    return null;
  }

  return toAuthorDetail(author);
}

export async function getRelatedAuthors(
  locale: Locale,
  currentAuthorId: string,
  limit = 6,
): Promise<AuthorListItem[]> {
  const authors = await getRuntimeAuthors(locale);
  const currentAuthor = authors.find((author) => author.id === currentAuthorId);

  if (!currentAuthor) {
    return [];
  }

  const safeLimit = clamp(limit, 1, 12);
  const related = authors
    .filter((author) => author.id !== currentAuthor.id)
    .slice(0, safeLimit)
    .map((author) => toAuthorListItem(author));

  return related;
}

export async function searchAuthors(
  locale: Locale,
  queryInput: Partial<AuthorListQuery>,
): Promise<AuthorListResponse> {
  const query = normalizeQuery(queryInput);
  const offset = Number(query.cursor ?? "0");
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0;
  const page = Math.floor(safeOffset / query.limit) + 1;

  try {
    const backendAuthors = await fetchRuntimeAuthorsFromBackendWithQuery(locale, {
      page,
      limit: query.limit,
      searchName: query.q,
    });

    const items = backendAuthors.map((author) => toAuthorListItem(author));
    const nextOffset = safeOffset + items.length;
    const nextCursor = items.length < query.limit ? null : String(nextOffset);

    return {
      items,
      total: nextOffset,
      nextCursor,
      appliedFilters: buildAppliedFilters(query),
    };
  } catch {
    // Fall back to local seed search when backend is unavailable.
  }

  const keyword = query.q ? normalizeSearchText(query.q) : undefined;
  const authors = await getRuntimeAuthors(locale);
  const filtered = authors.filter((author) => {
    if (!keyword) {
      return true;
    }

    return author.searchText.includes(keyword);
  });

  const pageItems = filtered.slice(safeOffset, safeOffset + query.limit);
  const items = pageItems.map((author) => toAuthorListItem(author));
  const nextOffset = safeOffset + items.length;
  const nextCursor = nextOffset < filtered.length ? String(nextOffset) : null;

  return {
    items,
    total: filtered.length,
    nextCursor,
    appliedFilters: buildAppliedFilters(query),
  };
}
