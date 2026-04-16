import "server-only";

import type { Locale } from "@/lib/i18n";

import type { AuthorDetailPageData } from "@/features/authors/schemas/authors";
import { getBookFilterOptions, getBooksByAuthor } from "@/features/books/server/books-adapter";
import { getAuthorBySlug, getRelatedAuthors } from "./authors-adapter";

export async function getAuthorDetailPageData(
  locale: Locale,
  slug: string,
): Promise<AuthorDetailPageData | null> {
  const author = await getAuthorBySlug(locale, slug);

  if (!author) {
    return null;
  }

  const [authoredBooks, relatedAuthors, filterOptions] = await Promise.all([
    getBooksByAuthor(locale, author.id, 8),
    getRelatedAuthors(locale, author.id, 6),
    getBookFilterOptions(locale),
  ]);

  return {
    author,
    authoredBooks,
    relatedAuthors,
    filterOptions,
  };
}
