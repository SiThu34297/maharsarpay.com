export type MediaType = "video" | "photo";

export type MediaListItem = {
  id: string;
  title: string;
  description: string;
  creator: string;
  mediaType: MediaType;
  publishedAt: string;
  imageSrc: string;
  imageAlt: string;
};

export type MediaListQuery = {
  q?: string;
  mediaType?: MediaType;
  cursor?: string;
  limit: number;
};

export type AppliedMediaFilters = {
  q?: string;
  mediaType?: MediaType;
};

export type MediaListResponse = {
  items: MediaListItem[];
  total: number;
  nextCursor: string | null;
  appliedFilters: AppliedMediaFilters;
};

export type MultimediaPageData = {
  initialResponse: MediaListResponse;
  initialQuery: MediaListQuery;
};
