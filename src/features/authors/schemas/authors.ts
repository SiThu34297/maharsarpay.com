import type { BookFilterOptions, BookListItem } from "@/features/books/schemas/books";

export type AuthorListItem = {
  id: string;
  slug: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
};

export type AuthorDetail = AuthorListItem & {
  shortBio: string;
  longBio: string;
};

export type AuthorListQuery = {
  q?: string;
  cursor?: string;
  limit: number;
};

export type AppliedAuthorFilters = {
  q?: string;
};

export type AuthorListResponse = {
  items: AuthorListItem[];
  total: number;
  nextCursor: string | null;
  appliedFilters: AppliedAuthorFilters;
};

export type AuthorsPageData = {
  initialResponse: AuthorListResponse;
  initialQuery: AuthorListQuery;
};

export type AuthorDetailPageData = {
  author: AuthorDetail;
  authoredBooks: BookListItem[];
  relatedAuthors: AuthorListItem[];
  filterOptions: BookFilterOptions;
};
