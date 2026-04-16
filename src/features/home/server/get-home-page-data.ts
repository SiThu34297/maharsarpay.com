import type { Locale } from "@/lib/i18n";

import { getAllCategories } from "@/features/categories";
import type {
  AuthorItem,
  BookItem,
  CategoryItem,
  HomePageData,
  MediaItem,
  NavItem,
  PromoBanner,
  ReviewItem,
} from "@/features/home/schemas/home";

const navigation: NavItem[] = [
  { id: "home", href: "#top" },
  { id: "books", href: "#books" },
  { id: "authors", href: "#authors" },
  { id: "categories", href: "#categories" },
  { id: "media", href: "#media" },
  { id: "contact", href: "#contact" },
];

const cartProductIdByHomeBookId: Record<string, string> = {
  "book-1": "book:quiet-orchard",
  "book-2": "book:golden-rain-in-bagan",
  "book-3": "book:letters-from-inle",
  "book-4": "book:stories-of-mandalay",
  "book-5": "book:midnight-tea-house",
  "book-6": "book:shan-hills-journal",
  "book-7": "book:river-of-fireflies",
  "book-8": "book:after-the-monsoon",
};

const slugByHomeBookId: Record<string, string> = {
  "book-1": "quiet-orchard",
  "book-2": "golden-rain-in-bagan",
  "book-3": "letters-from-inle",
  "book-4": "stories-of-mandalay",
  "book-5": "midnight-tea-house",
  "book-6": "shan-hills-journal",
  "book-7": "river-of-fireflies",
  "book-8": "after-the-monsoon",
};

type HomeBookSeedItem = Omit<BookItem, "cartProductId" | "slug">;

const booksByLocale: Record<Locale, HomeBookSeedItem[]> = {
  en: [
    {
      id: "book-1",
      title: "The Quiet Orchard",
      author: "Moe Nadi",
      price: 21000,
      rating: 4.8,
      imageSrc: "/images/home/real/books/book-1.jpg",
      imageAlt: "The Quiet Orchard book cover",
    },
    {
      id: "book-2",
      title: "Golden Rain in Bagan",
      author: "Khin Aye",
      price: 18500,
      rating: 4.7,
      imageSrc: "/images/home/real/books/book-2.jpg",
      imageAlt: "Golden Rain in Bagan book cover",
    },
    {
      id: "book-3",
      title: "Letters from Inle",
      author: "Sai Nay Lin",
      price: 19800,
      rating: 4.9,
      imageSrc: "/images/home/real/books/book-3.jpg",
      imageAlt: "Letters from Inle book cover",
    },
    {
      id: "book-4",
      title: "Stories of Mandalay",
      author: "Thandar Win",
      price: 17200,
      rating: 4.6,
      imageSrc: "/images/home/real/books/book-4.jpg",
      imageAlt: "Stories of Mandalay book cover",
    },
    {
      id: "book-5",
      title: "Midnight Tea House",
      author: "Aung Min",
      price: 23000,
      rating: 4.8,
      imageSrc: "/images/home/real/books/book-5.jpg",
      imageAlt: "Midnight Tea House book cover",
    },
    {
      id: "book-6",
      title: "The Shan Hills Journal",
      author: "Nan Hnin",
      price: 20400,
      rating: 4.7,
      imageSrc: "/images/home/real/books/book-6.jpg",
      imageAlt: "The Shan Hills Journal book cover",
    },
    {
      id: "book-7",
      title: "River of Fireflies",
      author: "Kyaw Zeya",
      price: 19100,
      rating: 4.5,
      imageSrc: "/images/home/real/books/book-7.jpg",
      imageAlt: "River of Fireflies book cover",
    },
    {
      id: "book-8",
      title: "After the Monsoon",
      author: "May Thu",
      price: 21900,
      rating: 4.9,
      imageSrc: "/images/home/real/books/book-8.jpg",
      imageAlt: "After the Monsoon book cover",
    },
  ],
  my: [
    {
      id: "book-1",
      title: "တိတ်ဆိတ်သော သစ်ဥယျာဉ်",
      author: "မိုးနဒီ",
      price: 21000,
      rating: 4.8,
      imageSrc: "/images/home/real/books/book-1.jpg",
      imageAlt: "တိတ်ဆိတ်သော သစ်ဥယျာဉ် စာအုပ်အဖုံး",
    },
    {
      id: "book-2",
      title: "ပုဂံမိုးရွာရွှေ",
      author: "ခင်အေး",
      price: 18500,
      rating: 4.7,
      imageSrc: "/images/home/real/books/book-2.jpg",
      imageAlt: "ပုဂံမိုးရွာရွှေ စာအုပ်အဖုံး",
    },
    {
      id: "book-3",
      title: "အင်းလေးမှ စာတိုများ",
      author: "စိုင်းနေလင်း",
      price: 19800,
      rating: 4.9,
      imageSrc: "/images/home/real/books/book-3.jpg",
      imageAlt: "အင်းလေးမှ စာတိုများ စာအုပ်အဖုံး",
    },
    {
      id: "book-4",
      title: "မန္တလေးပုံပြင်များ",
      author: "သန္တာဝင်း",
      price: 17200,
      rating: 4.6,
      imageSrc: "/images/home/real/books/book-4.jpg",
      imageAlt: "မန္တလေးပုံပြင်များ စာအုပ်အဖုံး",
    },
    {
      id: "book-5",
      title: "သန်းခေါင်လက်ဖက်ရည်ဆိုင်",
      author: "အောင်မင်း",
      price: 23000,
      rating: 4.8,
      imageSrc: "/images/home/real/books/book-5.jpg",
      imageAlt: "သန်းခေါင်လက်ဖက်ရည်ဆိုင် စာအုပ်အဖုံး",
    },
    {
      id: "book-6",
      title: "ရှမ်းတောင်တန်း မှတ်တမ်း",
      author: "နန်းနှင်း",
      price: 20400,
      rating: 4.7,
      imageSrc: "/images/home/real/books/book-6.jpg",
      imageAlt: "ရှမ်းတောင်တန်း မှတ်တမ်း စာအုပ်အဖုံး",
    },
    {
      id: "book-7",
      title: "မီးပိုးတောင်မြစ်",
      author: "ကျော်ဇေယျ",
      price: 19100,
      rating: 4.5,
      imageSrc: "/images/home/real/books/book-7.jpg",
      imageAlt: "မီးပိုးတောင်မြစ် စာအုပ်အဖုံး",
    },
    {
      id: "book-8",
      title: "မိုးကာလပြီးနောက်",
      author: "မေသူ",
      price: 21900,
      rating: 4.9,
      imageSrc: "/images/home/real/books/book-8.jpg",
      imageAlt: "မိုးကာလပြီးနောက် စာအုပ်အဖုံး",
    },
  ],
};

const fallbackCategoriesByLocale: Record<Locale, CategoryItem[]> = {
  en: [
    { id: "cat-1", name: "Fiction", imageSrc: null, imageAlt: "Fiction category" },
    { id: "cat-2", name: "History", imageSrc: null, imageAlt: "History category" },
    { id: "cat-3", name: "Business", imageSrc: null, imageAlt: "Business category" },
    {
      id: "cat-4",
      name: "Self Development",
      imageSrc: null,
      imageAlt: "Self Development category",
    },
    { id: "cat-5", name: "Children", imageSrc: null, imageAlt: "Children category" },
    { id: "cat-6", name: "Poetry", imageSrc: null, imageAlt: "Poetry category" },
  ],
  my: [
    { id: "cat-1", name: "ဝတ္ထု", imageSrc: null, imageAlt: "ဝတ္ထု အမျိုးအစား" },
    { id: "cat-2", name: "သမိုင်း", imageSrc: null, imageAlt: "သမိုင်း အမျိုးအစား" },
    {
      id: "cat-3",
      name: "စီးပွားရေး",
      imageSrc: null,
      imageAlt: "စီးပွားရေး အမျိုးအစား",
    },
    {
      id: "cat-4",
      name: "ကိုယ်တိုးတက်ရေး",
      imageSrc: null,
      imageAlt: "ကိုယ်တိုးတက်ရေး အမျိုးအစား",
    },
    {
      id: "cat-5",
      name: "ကလေးစာပေ",
      imageSrc: null,
      imageAlt: "ကလေးစာပေ အမျိုးအစား",
    },
    { id: "cat-6", name: "ကဗျာ", imageSrc: null, imageAlt: "ကဗျာ အမျိုးအစား" },
  ],
};

function pickRandomItems<T>(items: T[], count: number): T[] {
  if (items.length <= count) {
    return items;
  }

  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

async function getHomeCategories(locale: Locale): Promise<CategoryItem[]> {
  try {
    const backendCategories = await getAllCategories(locale);
    const mappedCategories = backendCategories.map((category) => ({
      id: category.id,
      name: category.name,
      imageSrc: category.icon,
      imageAlt: `${category.name} category icon`,
    }));

    if (mappedCategories.length > 0) {
      return pickRandomItems(mappedCategories, 6);
    }
  } catch {
    // Fallback to static categories if backend is unavailable.
  }

  return pickRandomItems(fallbackCategoriesByLocale[locale], 6);
}

const authorsByLocale: Record<Locale, AuthorItem[]> = {
  en: [
    {
      id: "author-moe-nadi",
      slug: "moe-nadi",
      name: "Moe Nadi",
      imageSrc: "/images/home/real/authors/author-1.jpg",
      imageAlt: "Portrait of Moe Nadi",
    },
    {
      id: "author-khin-aye",
      slug: "khin-aye",
      name: "Khin Aye",
      imageSrc: "/images/home/real/authors/author-2.jpg",
      imageAlt: "Portrait of Khin Aye",
    },
    {
      id: "author-sai-nay-lin",
      slug: "sai-nay-lin",
      name: "Sai Nay Lin",
      imageSrc: "/images/home/real/authors/author-3.jpg",
      imageAlt: "Portrait of Sai Nay Lin",
    },
    {
      id: "author-thandar-win",
      slug: "thandar-win",
      name: "Thandar Win",
      imageSrc: "/images/home/real/authors/author-4.jpg",
      imageAlt: "Portrait of Thandar Win",
    },
    {
      id: "author-aung-min",
      slug: "aung-min",
      name: "Aung Min",
      imageSrc: "/images/home/real/authors/author-5.jpg",
      imageAlt: "Portrait of Aung Min",
    },
    {
      id: "author-nan-hnin",
      slug: "nan-hnin",
      name: "Nan Hnin",
      imageSrc: "/images/home/real/authors/author-6.jpg",
      imageAlt: "Portrait of Nan Hnin",
    },
  ],
  my: [
    {
      id: "author-moe-nadi",
      slug: "moe-nadi",
      name: "မိုးနဒီ",
      imageSrc: "/images/home/real/authors/author-1.jpg",
      imageAlt: "မိုးနဒီ ရုပ်ပုံ",
    },
    {
      id: "author-khin-aye",
      slug: "khin-aye",
      name: "ခင်အေး",
      imageSrc: "/images/home/real/authors/author-2.jpg",
      imageAlt: "ခင်အေး ရုပ်ပုံ",
    },
    {
      id: "author-sai-nay-lin",
      slug: "sai-nay-lin",
      name: "စိုင်းနေလင်း",
      imageSrc: "/images/home/real/authors/author-3.jpg",
      imageAlt: "စိုင်းနေလင်း ရုပ်ပုံ",
    },
    {
      id: "author-thandar-win",
      slug: "thandar-win",
      name: "သန္တာဝင်း",
      imageSrc: "/images/home/real/authors/author-4.jpg",
      imageAlt: "သန္တာဝင်း ရုပ်ပုံ",
    },
    {
      id: "author-aung-min",
      slug: "aung-min",
      name: "အောင်မင်း",
      imageSrc: "/images/home/real/authors/author-5.jpg",
      imageAlt: "အောင်မင်း ရုပ်ပုံ",
    },
    {
      id: "author-nan-hnin",
      slug: "nan-hnin",
      name: "နန်းနှင်း",
      imageSrc: "/images/home/real/authors/author-6.jpg",
      imageAlt: "နန်းနှင်း ရုပ်ပုံ",
    },
  ],
};

const mediaItemsByLocale: Record<Locale, MediaItem[]> = {
  en: [
    {
      id: "media-1",
      slug: "behind-the-shelves",
      mediaType: "video",
      title: "Behind the Shelves",
      description: "A short tour through our top picks this month.",
      imageSrc: "/images/home/real/media/media-1.jpg",
      imageAlt: "Thumbnail for Behind the Shelves",
    },
    {
      id: "media-2",
      slug: "meet-the-author",
      mediaType: "video",
      title: "Meet the Author",
      description: "Conversations with writers shaping modern Myanmar literature.",
      imageSrc: "/images/home/real/media/media-2.jpg",
      imageAlt: "Thumbnail for Meet the Author",
    },
    {
      id: "media-3",
      slug: "weekend-reading-guide",
      mediaType: "photo",
      title: "Weekend Reading Guide",
      description: "Curated picks for your quiet weekend moments.",
      imageSrc: "/images/home/real/media/media-3.jpg",
      imageAlt: "Thumbnail for Weekend Reading Guide",
    },
    {
      id: "media-4",
      slug: "bookstore-stories",
      mediaType: "photo",
      title: "Bookstore Stories",
      description: "Reader stories from Yangon, Mandalay, and beyond.",
      imageSrc: "/images/home/real/media/media-4.jpg",
      imageAlt: "Thumbnail for Bookstore Stories",
    },
  ],
  my: [
    {
      id: "media-1",
      slug: "behind-the-shelves",
      mediaType: "video",
      title: "စာအုပ်စင်နောက်ကွယ်",
      description: "ဒီလအတွက် အကြိုက်ဆုံးစာအုပ်များကို အကျဉ်းချုပ် မိတ်ဆက်ထားသည်။",
      imageSrc: "/images/home/real/media/media-1.jpg",
      imageAlt: "စာအုပ်စင်နောက်ကွယ် Thumbnail",
    },
    {
      id: "media-2",
      slug: "meet-the-author",
      mediaType: "video",
      title: "စာရေးသူနှင့် တွေ့ဆုံမှု",
      description: "ခေတ်သစ်မြန်မာစာပေကို ပုံဖော်နေသော စာရေးသူများနှင့် ဆွေးနွေးမှုများ။",
      imageSrc: "/images/home/real/media/media-2.jpg",
      imageAlt: "စာရေးသူနှင့် တွေ့ဆုံမှု Thumbnail",
    },
    {
      id: "media-3",
      slug: "weekend-reading-guide",
      mediaType: "photo",
      title: "စနေတနင်္ဂနွေ ဖတ်ရှုလမ်းညွှန်",
      description: "ငြိမ်သက်တဲ့ ပိတ်ရက်ချိန်အတွက် ရွေးချယ်ထားသော စာအုပ်အကြံပြုချက်များ။",
      imageSrc: "/images/home/real/media/media-3.jpg",
      imageAlt: "စနေတနင်္ဂနွေ ဖတ်ရှုလမ်းညွှန် Thumbnail",
    },
    {
      id: "media-4",
      slug: "bookstore-stories",
      mediaType: "photo",
      title: "စာအုပ်ဆိုင်ပုံပြင်များ",
      description: "ရန်ကုန်၊ မန္တလေးနှင့် အခြားမြို့များမှ စာဖတ်သူတို့ရဲ့ ပုံပြင်များ။",
      imageSrc: "/images/home/real/media/media-4.jpg",
      imageAlt: "စာအုပ်ဆိုင်ပုံပြင်များ Thumbnail",
    },
  ],
};

const reviewsByLocale: Record<Locale, ReviewItem[]> = {
  en: [
    {
      id: "review-1",
      name: "Ei Mon",
      rating: 5,
      quote: "The recommendations are always spot on. I found three books I now absolutely love.",
    },
    {
      id: "review-2",
      name: "Ko Aung",
      rating: 4.5,
      quote:
        "Fast delivery, beautiful editions, and thoughtful packaging. It feels premium every time.",
    },
    {
      id: "review-3",
      name: "Thiri",
      rating: 5,
      quote:
        "The author highlights and media section helped me discover voices I had never read before.",
    },
    {
      id: "review-4",
      name: "Naing Htet",
      rating: 4.8,
      quote:
        "Clean website, easy checkout, and a strong variety of local and international titles.",
    },
  ],
  my: [
    {
      id: "review-1",
      name: "ဧမွန်",
      rating: 5,
      quote: "အကြံပြုစာအုပ်တွေ အမြဲကောင်းပါတယ်။ အခု အရမ်းကြိုက်တဲ့ စာအုပ် ၃ အုပ်တွေ့ခဲ့တယ်။",
    },
    {
      id: "review-2",
      name: "ကိုအောင်",
      rating: 4.5,
      quote:
        "ပို့ဆောင်ရေးမြန်၊ edition လှလှ၊ ထုပ်ပိုးမှုလည်းသေသပ်ပါတယ်။ ဝယ်တိုင်း premium ခံစားရတယ်။",
    },
    {
      id: "review-3",
      name: "သီရိ",
      rating: 5,
      quote:
        "Author highlight နဲ့ media section ကြောင့် မဖတ်ဖူးသေးတဲ့ စာရေးသူအသစ်တွေကို ရှာတွေ့ခဲ့တယ်။",
    },
    {
      id: "review-4",
      name: "နိုင်ထက်",
      rating: 4.8,
      quote: "Website သန့်ရှင်းလွယ်ကူပြီး checkout မြန်ပါတယ်။ စာအုပ်ရွေးချယ်စရာလည်း များပါတယ်။",
    },
  ],
};

const promoByLocale: Record<Locale, PromoBanner> = {
  en: {
    badge: "Seasonal Campaign",
    title: "Save up to 20% on our curated spring collection",
    description: "Fresh arrivals, timeless classics, and staff favorites in one campaign.",
    ctaHref: "#books",
  },
  my: {
    badge: "ရာသီအလိုက် ကမ်ပိန်း",
    title: "ရွေးချယ်ထားသော နွေဦးစုစည်းမှုအတွက် ၂၀% အထိ လျှော့စျေးရယူပါ",
    description:
      "အသစ်ရောက်စာအုပ်များ၊ classic များနှင့် staff အကြိုက်စာအုပ်များကို တစ်နေရာတည်းမှာ။",
    ctaHref: "#books",
  },
};

export async function getHomePageData(locale: Locale): Promise<HomePageData> {
  const categories = await getHomeCategories(locale);

  return {
    navigation,
    heroSlides: [
      {
        id: "hero-1",
        title:
          locale === "my"
            ? "သင့်ကို လှုံ့ဆော်မည့် စာအုပ်များကို ရှာဖွေလိုက်ပါ"
            : "Discover Books That Inspire You",
        description:
          locale === "my"
            ? "မဟာစာပေတွင် လူကြိုက်များသည့် စာအုပ်များ၊ မြန်မာစာရေးသူများနှင့် အကောင်းဆုံးစာဖတ်အကြံပြုချက်များကို တွေ့နိုင်ပါတယ်။"
            : "Browse bestsellers, standout local authors, and thoughtfully curated reading picks for every mood.",
        primaryHref: "#books",
        secondaryHref: "#categories",
        imageSrc: "/images/home/real/hero/hero-1.jpg",
        imageAlt:
          locale === "my"
            ? "စာအုပ်များ တန်းစီထားသည့် Hero ပုံ"
            : "A curated stack of books for the homepage hero",
      },
      {
        id: "hero-2",
        title:
          locale === "my"
            ? "အရောင်းအကောင်းဆုံး စာအုပ်ကို ယနေ့ရှာပါ"
            : "Find Your Next Bestseller Today",
        description:
          locale === "my"
            ? "လတ်တလော လူကြိုက်များဆုံး title များကို အကြံပြုစာရင်းနဲ့တကွ လွယ်ကူစွာ ကြည့်ရှုနိုင်ပါတယ်။"
            : "Browse trending picks, staff favorites, and fresh arrivals selected for fast discovery.",
        primaryHref: "#books",
        secondaryHref: "#media",
        imageSrc: "/images/home/real/hero/hero-2.jpg",
        imageAlt:
          locale === "my"
            ? "အရောင်းရဆုံး စာအုပ်များ hero ပုံ"
            : "A colorful bestselling books composition",
      },
      {
        id: "hero-3",
        title:
          locale === "my"
            ? "အသက်အရွယ်အားလုံးအတွက် သင့်တော်သော ပုံပြင်များ"
            : "Stories Curated for Every Generation",
        description:
          locale === "my"
            ? "ကလေးစာပေမှ ပညာရေး၊ ကိုယ်တိုးတက်ရေးနှင့် ရသစာပေအထိ သင့်လိုအပ်ချက်အလိုက် ရွေးချယ်ပါ။"
            : "From kids books to self-growth and literary fiction, explore titles that match your pace.",
        primaryHref: "#categories",
        secondaryHref: "#authors",
        imageSrc: "/images/home/real/hero/hero-3.jpg",
        imageAlt:
          locale === "my"
            ? "စာအုပ်အမျိုးအစားစုံ စုစည်းထားသည့် hero ပုံ"
            : "A mixed genre book collection for the hero slider",
      },
    ],
    categories,
    books: booksByLocale[locale].map((book) => ({
      ...book,
      cartProductId: cartProductIdByHomeBookId[book.id] ?? `book:${book.id}`,
      slug: slugByHomeBookId[book.id] ?? book.id,
    })),
    authors: authorsByLocale[locale],
    mediaItems: mediaItemsByLocale[locale],
    reviews: reviewsByLocale[locale],
    promo: promoByLocale[locale],
  };
}
