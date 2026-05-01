import Image from "next/image";
import Link from "next/link";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import type { BookFilterOptions, BookListItem } from "@/features/books/schemas/books";
import type { Dictionary, Locale } from "@/lib/i18n";

import { BookPreviewModal } from "./book-preview-modal";

type PreviewBookListItem = BookListItem & {
  previewPdfSrc: string;
};

type BookPreviewPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  books: PreviewBookListItem[];
  filterOptions: BookFilterOptions;
}>;

export function BookPreviewPage({ copy, locale, books, filterOptions }: BookPreviewPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));

  return (
    <div
      id="top"
      className={`min-h-screen bg-background text-foreground ${isMyanmar ? "locale-my" : ""}`}
    >
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="bookPreview"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="section-gap">
        <div className="home-shell">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl text-foreground md:text-4xl">{copy.navigation.bookPreview}</h1>
            <p className="mt-2 text-sm text-(--color-text-muted) md:text-base">
              {copy.bookDetail.previewTitle}
            </p>
          </div>

          {books.length ? (
            <div className="book-list-grid">
              {books.map((book, index) => (
                <article
                  key={book.id}
                  className="book-list-card book-list-card-clean flex flex-col"
                >
                  <Link
                    href={`/${locale}/books/${book.slug}?from=books`}
                    className="book-list-image-wrap relative block overflow-hidden"
                  >
                    <Image
                      src={book.coverImageSrc}
                      alt={book.coverImageAlt}
                      width={360}
                      height={470}
                      className="book-list-image h-[260px] w-full object-cover sm:h-[280px]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </Link>

                  <h2 className="book-list-title mt-1.5 text-center text-base font-semibold text-[var(--color-text-main)] sm:text-[1.05rem]">
                    <Link
                      href={`/${locale}/books/${book.slug}?from=books`}
                      className="hover:text-[var(--color-brand)]"
                    >
                      {book.title}
                    </Link>
                  </h2>
                  <p className="-mt-0.5 min-h-[1.25rem] line-clamp-1 px-4 text-center text-sm text-[var(--color-text-muted)]">
                    {book.author}
                  </p>

                  <div className="book-preview-card-actions mt-1 px-4 pb-2 pt-2">
                    <BookPreviewModal
                      title={book.title}
                      pdfSrc={book.previewPdfSrc}
                      previewTitle={copy.bookDetail.previewTitle}
                      previewCtaLabel={copy.bookDetail.previewCtaLabel}
                      openPreviewLabel={copy.bookDetail.openPreviewLabel}
                      downloadPreviewLabel={copy.bookDetail.downloadPreviewLabel}
                      closePreviewLabel={copy.bookDetail.closePreviewLabel}
                      triggerVariant="inline"
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-(--color-border) bg-white p-8 text-center">
              <h2 className="text-xl text-foreground">{copy.booksList.noBooksFound}</h2>
              <p className="mt-2 text-sm text-(--color-text-muted)">
                {copy.booksList.tryDifferentFilters}
              </p>
              <Link
                href={`/${locale}/books`}
                className="mt-5 inline-flex rounded-full border border-(--color-border) px-5 py-2 text-sm font-semibold text-foreground transition hover:border-(--color-brand) hover:text-(--color-brand)"
              >
                {copy.booksList.title}
              </Link>
            </div>
          )}
        </div>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
