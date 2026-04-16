import "server-only";

import { getBookFilterOptions } from "@/features/books/server/books-adapter";
import type { MultimediaDetailPageData } from "@/features/multimedia/schemas/multimedia";
import type { Locale } from "@/lib/i18n";

import {
  getMediaBySlug,
  getMediaRelatedBooks,
  getRelatedMedia,
} from "@/features/multimedia/server/multimedia-adapter";

export async function getMultimediaDetailPageData(
  locale: Locale,
  slug: string,
): Promise<MultimediaDetailPageData | null> {
  const media = await getMediaBySlug(locale, slug);

  if (!media) {
    return null;
  }

  const [relatedMedia, relatedBooks, filterOptions] = await Promise.all([
    getRelatedMedia(locale, media),
    getMediaRelatedBooks(locale, media),
    getBookFilterOptions(locale),
  ]);

  return {
    media,
    relatedMedia,
    relatedBooks,
    filterOptions,
  };
}
