import "server-only";

import type { Locale } from "@/lib/i18n";

import type { MultimediaPageData } from "@/features/multimedia/schemas/multimedia";
import {
  normalizeMultimediaListQuery,
  searchMultimedia,
} from "@/features/multimedia/server/multimedia-adapter";

type MultimediaPageQueryInput = {
  q?: string;
  limit?: number;
  photoPage?: number;
  blogPage?: number;
};

function toSafePage(value: number | undefined) {
  if (!Number.isFinite(value) || !value || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

export async function getMultimediaPageData(
  locale: Locale,
  queryInput: MultimediaPageQueryInput,
): Promise<MultimediaPageData> {
  const normalized = normalizeMultimediaListQuery({
    q: queryInput.q,
    limit: queryInput.limit,
  });
  const photoPage = toSafePage(queryInput.photoPage);
  const blogPage = toSafePage(queryInput.blogPage);
  const photoCursor = String((photoPage - 1) * normalized.limit);
  const blogCursor = String((blogPage - 1) * normalized.limit);

  const [initialPhotoResponse, initialBlogResponse] = await Promise.all([
    searchMultimedia(locale, {
      q: normalized.q,
      mediaType: "photo",
      limit: normalized.limit,
      cursor: photoCursor,
    }),
    searchMultimedia(locale, {
      q: normalized.q,
      mediaType: "video",
      limit: normalized.limit,
      cursor: blogCursor,
    }),
  ]);

  return {
    initialPhotoResponse,
    initialBlogResponse,
    initialQuery: {
      q: normalized.q,
      limit: normalized.limit,
      photoPage,
      blogPage,
    },
  };
}
