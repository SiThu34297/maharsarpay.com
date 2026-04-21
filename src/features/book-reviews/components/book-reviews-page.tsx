import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import type { BookReviewsPageData } from "@/features/book-reviews/schemas/book-reviews";
import type { Dictionary, Locale } from "@/lib/i18n";

import { BookReviewsListClient } from "./book-reviews-list-client";

type BookReviewsPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: BookReviewsPageData;
}>;

export function BookReviewsPage({ copy, locale, data }: BookReviewsPageProps) {
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
        activeNavId="bookReviews"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main>
        <BookReviewsListClient
          copy={copy.bookReviewsList}
          locale={locale}
          initialResponse={data.initialResponse}
          initialQuery={data.initialQuery}
        />
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
