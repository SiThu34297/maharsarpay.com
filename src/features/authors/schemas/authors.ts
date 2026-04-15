export type AuthorListItem = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
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
