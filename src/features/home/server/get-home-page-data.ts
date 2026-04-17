import type { Locale } from "@/lib/i18n";

import { searchAuthors } from "@/features/authors";
import { searchBooks } from "@/features/books";
import { getAllCategories } from "@/features/categories";
import { getHomeHeroSlidesFromBackend } from "@/features/home/server/banner-images-adapter";
import { searchMultimedia } from "@/features/multimedia/server/multimedia-adapter";
import type {
  AuthorItem,
  BookItem,
  CategoryItem,
  HeroSlide,
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

async function getHomeAuthors(locale: Locale): Promise<AuthorItem[]> {
  const response = await searchAuthors(locale, { limit: 24 });
  return pickRandomItems(response.items, 6);
}

async function getHomeBooks(locale: Locale): Promise<BookItem[]> {
  const response = await searchBooks(locale, { limit: 24 });
  const randomBooks = pickRandomItems(response.items, 8);

  return randomBooks.map((book) => ({
    id: book.id,
    slug: book.slug,
    cartProductId: book.cartProductId,
    title: book.title,
    author: book.author,
    price: book.price,
    salePrice: book.salePrice,
    originalPrice: book.originalPrice,
    discountAmount: book.discountAmount,
    rating: book.rating,
    imageSrc: book.coverImageSrc,
    imageAlt: book.coverImageAlt,
  }));
}

async function getHomeMediaItems(locale: Locale): Promise<MediaItem[]> {
  try {
    const response = await searchMultimedia(locale, { limit: 500 });

    if (response.items.length > 0) {
      return pickRandomItems(response.items, 4).map((item) => ({
        id: item.id,
        slug: item.slug,
        mediaType: item.mediaType,
        title: item.title,
        description: item.description,
        imageSrc: item.imageSrc,
        imageAlt: item.imageAlt,
      }));
    }
  } catch {
    // Fall through to static fallback if backend is unavailable.
  }

  return pickRandomItems(mediaItemsByLocale[locale], 4);
}

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

const fallbackHeroSlidesByLocale: Record<Locale, HeroSlide[]> = {
  en: [
    {
      id: "hero-1",
      title: "Discover Books That Inspire You",
      description:
        "Browse bestsellers, standout local authors, and thoughtfully curated reading picks for every mood.",
      imageDesktopSrc: "/images/home/real/hero/hero-1.jpg",
      imageMobileSrc: "/images/home/real/hero/hero-1.jpg",
      imageAlt: "A curated stack of books for the homepage hero",
      action: {
        type: "DEEPLINK",
        href: "#books",
      },
    },
    {
      id: "hero-2",
      title: "Find Your Next Bestseller Today",
      description:
        "Browse trending picks, staff favorites, and fresh arrivals selected for fast discovery.",
      imageDesktopSrc: "/images/home/real/hero/hero-2.jpg",
      imageMobileSrc: "/images/home/real/hero/hero-2.jpg",
      imageAlt: "A colorful bestselling books composition",
      action: {
        type: "DEEPLINK",
        href: "#books",
      },
    },
    {
      id: "hero-3",
      title: "Stories Curated for Every Generation",
      description:
        "From kids books to self-growth and literary fiction, explore titles that match your pace.",
      imageDesktopSrc: "/images/home/real/hero/hero-3.jpg",
      imageMobileSrc: "/images/home/real/hero/hero-3.jpg",
      imageAlt: "A mixed genre book collection for the hero slider",
      action: {
        type: "DEEPLINK",
        href: "#categories",
      },
    },
  ],
  my: [
    {
      id: "hero-1",
      title: "သင့်ကို လှုံ့ဆော်မည့် စာအုပ်များကို ရှာဖွေလိုက်ပါ",
      description:
        "မဟာစာပေတွင် လူကြိုက်များသည့် စာအုပ်များ၊ မြန်မာစာရေးသူများနှင့် အကောင်းဆုံးစာဖတ်အကြံပြုချက်များကို တွေ့နိုင်ပါတယ်။",
      imageDesktopSrc: "/images/home/real/hero/hero-1.jpg",
      imageMobileSrc: "/images/home/real/hero/hero-1.jpg",
      imageAlt: "စာအုပ်များ တန်းစီထားသည့် Hero ပုံ",
      action: {
        type: "DEEPLINK",
        href: "#books",
      },
    },
    {
      id: "hero-2",
      title: "အရောင်းအကောင်းဆုံး စာအုပ်ကို ယနေ့ရှာပါ",
      description:
        "လတ်တလော လူကြိုက်များဆုံး title များကို အကြံပြုစာရင်းနဲ့တကွ လွယ်ကူစွာ ကြည့်ရှုနိုင်ပါတယ်။",
      imageDesktopSrc: "/images/home/real/hero/hero-2.jpg",
      imageMobileSrc: "/images/home/real/hero/hero-2.jpg",
      imageAlt: "အရောင်းရဆုံး စာအုပ်များ hero ပုံ",
      action: {
        type: "DEEPLINK",
        href: "#books",
      },
    },
    {
      id: "hero-3",
      title: "အသက်အရွယ်အားလုံးအတွက် သင့်တော်သော ပုံပြင်များ",
      description:
        "ကလေးစာပေမှ ပညာရေး၊ ကိုယ်တိုးတက်ရေးနှင့် ရသစာပေအထိ သင့်လိုအပ်ချက်အလိုက် ရွေးချယ်ပါ။",
      imageDesktopSrc: "/images/home/real/hero/hero-3.jpg",
      imageMobileSrc: "/images/home/real/hero/hero-3.jpg",
      imageAlt: "စာအုပ်အမျိုးအစားစုံ စုစည်းထားသည့် hero ပုံ",
      action: {
        type: "DEEPLINK",
        href: "#categories",
      },
    },
  ],
};

async function getHomeHeroSlides(locale: Locale): Promise<HeroSlide[]> {
  try {
    const backendSlides = await getHomeHeroSlidesFromBackend(locale);

    if (backendSlides.length > 0) {
      return backendSlides;
    }
  } catch {
    // Fall through to static fallback if backend is unavailable.
  }

  return fallbackHeroSlidesByLocale[locale];
}

export async function getHomePageData(locale: Locale): Promise<HomePageData> {
  const [heroSlides, categories, authors, books, mediaItems] = await Promise.all([
    getHomeHeroSlides(locale),
    getHomeCategories(locale),
    getHomeAuthors(locale),
    getHomeBooks(locale),
    getHomeMediaItems(locale),
  ]);

  return {
    navigation,
    heroSlides,
    categories,
    books,
    authors,
    mediaItems,
    reviews: reviewsByLocale[locale],
    promo: promoByLocale[locale],
  };
}
