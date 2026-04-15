import "server-only";

import type { Locale } from "@/lib/i18n";

import type { AuthorListQuery, AuthorsPageData } from "@/features/authors/schemas/authors";
import { normalizeAuthorListQuery, searchAuthors } from "@/features/authors/server/authors-adapter";

export async function getAuthorsPageData(
  locale: Locale,
  queryInput: Partial<AuthorListQuery>,
): Promise<AuthorsPageData> {
  const initialQuery = normalizeAuthorListQuery(queryInput);
  const initialResponse = await searchAuthors(locale, initialQuery);

  return {
    initialResponse,
    initialQuery,
  };
}
