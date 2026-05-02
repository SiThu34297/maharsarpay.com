export type BackendBookAuthor = {
  id: string;
  name: string;
  authorImage: string | null;
};

export type BackendBookCategory = {
  id: string;
  name: string;
};

export type BackendBookRecord = {
  id: string;
  bookTitle: string;
  edition: string | null;
  release: number | null;
  serial: string | null;
  units: number | null;
  salePrice: number | null;
  reviewLink: string | null;
  bookReleaseDate: string | null;
  status: number | null;
  outOfStock: number | null;
  authors: BackendBookAuthor[];
  categories: BackendBookCategory[];
  bookImageFront: string | null;
  bookImageBack: string | null;
  coverImage: string | null;
  sideImage: string | null;
  pages: number | null;
  originalPrice: number | null;
  size: string | null;
  about: string | null;
  preview: string | null;
};

export type BackendBooksResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendBookRecord[];
};

export type BookListItem = {
  id: string;
  slug: string;
  cartProductId: string;
  bookReleaseDate?: string | null;
  title: string;
  author: string;
  authorId: string;
  authorImageSrc?: string | null;
  authorImageAlt?: string | null;
  authors: Array<{
    id: string;
    name: string;
    imageSrc?: string | null;
    imageAlt?: string | null;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  category: string;
  categoryId: string;
  price: number;
  salePrice?: number | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
  rating: number;
  coverImageSrc: string;
  coverImageAlt: string;
  previewPdfSrc?: string | null;
};

export type BookDetail = BookListItem & {
  description: string;
  edition: string;
  previewPdfSrc: string | null;
  publishYear: number;
  pageCount: number;
  language: string;
  format: string;
  isbn: string;
  inStock: boolean;
  galleryImages: Array<{
    src: string;
    alt: string;
  }>;
};

export type BookListQuery = {
  q?: string;
  category?: string;
  cursor?: string;
  limit: number;
};

export type AppliedBookFilters = {
  q?: string;
  category?: string;
};

export type BookListResponse = {
  items: BookListItem[];
  total: number;
  nextCursor: string | null;
  appliedFilters: AppliedBookFilters;
};

export type BookFilterOption = {
  value: string;
  label: string;
};

export type BookFilterOptions = {
  categories: BookFilterOption[];
};

export type BooksPageData = {
  initialResponse: BookListResponse;
  filterOptions: BookFilterOptions;
  initialQuery: BookListQuery;
};

export type BookDetailPageData = {
  book: BookDetail;
  bookReviews: Array<{
    id: string;
    reviewerName: string;
    excerpt: string;
    createdAt: string;
    viewCount: number;
  }>;
  relatedBooks: BookListItem[];
  filterOptions: BookFilterOptions;
};
