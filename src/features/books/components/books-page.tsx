import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import type { BooksPageData } from "@/features/books/schemas/books";
import type { Dictionary, Locale } from "@/lib/i18n";

import { BooksListClient } from "./books-list-client";

type BooksPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: BooksPageData;
}>;

export function BooksPage({ copy, locale, data }: BooksPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = data.filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="books"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main>
        <BooksListClient
          copy={copy.booksList}
          locale={locale}
          initialResponse={data.initialResponse}
          initialQuery={data.initialQuery}
          filterOptions={data.filterOptions}
        />
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
