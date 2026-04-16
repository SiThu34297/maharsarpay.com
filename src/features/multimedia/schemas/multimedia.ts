import type { BookFilterOptions, BookListItem } from "@/features/books/schemas/books";

export type MediaType = "video" | "photo";

export type MediaListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  creator: string;
  mediaType: MediaType;
  publishedAt: string;
  imageSrc: string;
  imageAlt: string;
};

export type MediaDetail = MediaListItem & {
  lead: string;
  storyParagraphs: string[];
  tags: string[];
  durationLabel?: string;
  photoCount?: number;
  galleryImages: Array<{
    src: string;
    alt: string;
  }>;
  relatedBookAuthorId?: string;
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

export type MultimediaDetailPageData = {
  media: MediaDetail;
  relatedMedia: MediaListItem[];
  relatedBooks: BookListItem[];
  filterOptions: BookFilterOptions;
};
