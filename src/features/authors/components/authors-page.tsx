import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { getBookFilterOptions } from "@/features/books";
import type { AuthorsPageData } from "@/features/authors/schemas/authors";
import type { Dictionary, Locale } from "@/lib/i18n";
import { AuthorsListClient } from "./authors-list-client";

type AuthorsPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: AuthorsPageData;
}>;

export async function AuthorsPage({ copy, locale, data }: AuthorsPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookFilterOptions = await getBookFilterOptions(locale);
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
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
        activeNavId="authors"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main>
        <AuthorsListClient
          copy={copy.authorsList}
          locale={locale}
          initialResponse={data.initialResponse}
          initialQuery={data.initialQuery}
        />
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
