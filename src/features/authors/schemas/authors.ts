import type { BookFilterOptions, BookListItem } from "@/features/books/schemas/books";

export type BackendAuthorRecord = {
  id: string;
  name: string;
  alias: string | null;
  registrationId: string | null;
  nameTag: string | null;
  authorImage: string | null;
  note: string | null;
  status: number;
  bookCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BackendAuthorsResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendAuthorRecord[];
};

export type AuthorListItem = {
  id: string;
  slug: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  note: string;
  bookCount: number;
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
