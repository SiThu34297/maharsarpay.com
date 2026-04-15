export type BookListItem = {
  id: string;
  cartProductId: string;
  title: string;
  author: string;
  authorId: string;
  category: string;
  categoryId: string;
  price: number;
  rating: number;
  coverImageSrc: string;
  coverImageAlt: string;
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
