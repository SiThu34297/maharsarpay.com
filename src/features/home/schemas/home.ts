export type NavItem = {
  id: "home" | "books" | "authors" | "categories" | "media" | "contact";
  href: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  primaryHref: string;
  secondaryHref: string;
  imageSrc: string;
  imageAlt: string;
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
  title: string;
  author: string;
  price: number;
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
  note: string;
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
