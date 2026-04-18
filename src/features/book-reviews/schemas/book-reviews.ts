import type { BookFilterOptions } from "@/features/books/schemas/books";

export type BackendBookReviewBook = {
  id: string;
  bookTitle: string;
  coverImage: string | null;
};

export type BackendBookReviewRecord = {
  id: string;
  bookId: string;
  name: string | null;
  image: string | null;
  contents: string | null;
  viewCount: number | null;
  createdAt: string;
  updatedAt: string;
  book: BackendBookReviewBook | null;
};

export type BackendBookReviewsResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendBookReviewRecord[];
};

export type BackendBookReviewResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendBookReviewRecord | null;
};

export type BookReviewBookContext = {
  id: string;
  title: string;
  coverImageSrc: string;
  coverImageAlt: string;
};

export type BookReviewListItem = {
  id: string;
  bookId: string;
  reviewerName: string;
  reviewImageSrc: string | null;
  contentsHtml: string;
  excerpt: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  book: BookReviewBookContext;
};

export type BookReviewDetail = BookReviewListItem;

export type BookReviewListQuery = {
  q?: string;
  bookId?: string;
  cursor?: string;
  limit: number;
};

export type AppliedBookReviewFilters = {
  q?: string;
  bookId?: string;
};

export type BookReviewListResponse = {
  items: BookReviewListItem[];
  total: number;
  nextCursor: string | null;
  appliedFilters: AppliedBookReviewFilters;
};

export type BookReviewsPageData = {
  initialResponse: BookReviewListResponse;
  initialQuery: BookReviewListQuery;
  filterOptions: BookFilterOptions;
};

export type BookReviewDetailPageData = {
  review: BookReviewDetail;
  filterOptions: BookFilterOptions;
};
