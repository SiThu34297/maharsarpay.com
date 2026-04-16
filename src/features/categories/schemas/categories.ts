export type BackendCategoryRecord = {
  id: string;
  name: string;
  icon: string | null;
  status: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BackendCategoriesResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendCategoryRecord[];
};

export type CategoryListItem = {
  id: string;
  name: string;
  icon: string | null;
  status: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryListQuery = {
  q?: string;
  cursor?: string;
  limit: number;
};

export type AppliedCategoryFilters = {
  q?: string;
};

export type CategoryListResponse = {
  items: CategoryListItem[];
  total: number;
  nextCursor: string | null;
  appliedFilters: AppliedCategoryFilters;
};
