export type NavItem = {
  id: "home" | "books" | "authors" | "categories" | "media" | "contact";
  href: string;
};

export const homeHeroBannerDesignSpec = {
  desktop: {
    width: 1920,
    height: 900,
  },
  mobile: {
    width: 1000,
    height: 1200,
  },
} as const;

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageDesktopSrc: string;
  imageMobileSrc: string;
  imageAlt: string;
  action: HeroSlideAction | null;
};

export type HeroSlideAction =
  | {
      type: "DEEPLINK";
      href: string;
    }
  | {
      type: "EXTERNAL";
      href: string;
    };

export type CategoryItem = {
  id: string;
  name: string;
  imageSrc: string | null;
  imageAlt: string;
};

export type BookItem = {
  id: string;
  slug: string;
  cartProductId: string;
  bookReleaseDate?: string | null;
  title: string;
  author: string;
  authorId: string;
  authors: Array<{
    id: string;
    name: string;
  }>;
  price: number;
  salePrice?: number | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
  rating: number;
  imageSrc: string;
  imageAlt: string;
};

export type AuthorItem = {
  id: string;
  slug: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  bookCount: number;
};

export type MediaItem = {
  id: string;
  slug: string;
  mediaType: "video" | "photo";
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  quote: string;
};

export type PromoBanner = {
  badge: string;
  title: string;
  description: string;
  ctaHref: string;
};

export type HomePageData = {
  navigation: NavItem[];
  heroSlides: HeroSlide[];
  categories: CategoryItem[];
  books: BookItem[];
  authors: AuthorItem[];
  mediaItems: MediaItem[];
  reviews: ReviewItem[];
  promo: PromoBanner;
};
