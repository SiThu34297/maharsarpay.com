import "server-only";

import type { Locale } from "@/lib/i18n";

import type { MediaListQuery, MultimediaPageData } from "@/features/multimedia/schemas/multimedia";
import {
  normalizeMultimediaListQuery,
  searchMultimedia,
} from "@/features/multimedia/server/multimedia-adapter";

export async function getMultimediaPageData(
  locale: Locale,
  queryInput: Partial<MediaListQuery>,
): Promise<MultimediaPageData> {
  const initialQuery = normalizeMultimediaListQuery(queryInput);
  const initialResponse = await searchMultimedia(locale, initialQuery);

  return {
    initialResponse,
    initialQuery,
  };
}
