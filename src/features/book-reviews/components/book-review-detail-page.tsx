import Image from "next/image";
import Link from "next/link";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import type { BookReviewDetailPageData } from "@/features/book-reviews/schemas/book-reviews";
import type { Dictionary, Locale } from "@/lib/i18n";

type BookReviewDetailPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: BookReviewDetailPageData;
}>;

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function toMyanmarDigits(value: string) {
  return value.replace(/\d/g, (digit) => String.fromCharCode(0x1040 + Number(digit)));
}

function formatDate(locale: Locale, value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = parsed.getUTCDate();
  const month = parsed.getUTCMonth() + 1;
  const year = parsed.getUTCFullYear();

  if (locale === "my") {
    return toMyanmarDigits(`${day}/${month}/${year}`);
  }

  return `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}

function formatViews(locale: Locale, views: number) {
  const grouped = String(Math.max(0, views)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return locale === "my" ? toMyanmarDigits(grouped) : grouped;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function BookReviewDetailPage({ copy, locale, data }: BookReviewDetailPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = data.filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const review = data.review;
  const bookHref = review.book.id
    ? `/${locale}/books/${review.book.id}?from=books`
    : `/${locale}/books`;
  const originalReviewHtml =
    review.contentsHtml.trim() || `<p>${escapeHtml(review.excerpt || review.reviewerName)}</p>`;

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

      <main className="section-gap">
        <div className="home-shell">
          <nav
            className="book-detail-breadcrumb"
            aria-label={copy.bookReviewDetail.breadcrumbLabel}
          >
            <Link href={`/${locale}/book-reviews`}>
              {copy.bookReviewDetail.breadcrumbBookReviews}
            </Link>
            <span>/</span>
            <span className="truncate">{review.reviewerName}</span>
          </nav>

          <section className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)] md:p-7">
            <div>
              <h1 className="text-xl font-semibold text-[var(--color-text-main)] md:text-2xl">
                {review.reviewerName}
              </h1>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {copy.bookReviewDetail.publishedOnLabel} {formatDate(locale, review.createdAt)}
                {" • "}
                {copy.bookReviewDetail.viewsLabel} {formatViews(locale, review.viewCount)}
              </p>
            </div>

            <h2 className="mt-6 text-lg font-semibold text-[var(--color-text-main)]">
              <Link href={bookHref} prefetch={false} className="hover:text-[var(--color-brand)]">
                {review.book.title}
              </Link>
            </h2>

            {review.reviewImageSrc ? (
              <div className="mt-4 mx-auto max-w-6xl overflow-hidden">
                <Image
                  src={review.reviewImageSrc}
                  alt={`${review.reviewerName} review image`}
                  width={840}
                  height={472}
                  className="max-h-[75vh] w-full object-contain"
                />
              </div>
            ) : null}

            <article className="mt-6" dangerouslySetInnerHTML={{ __html: originalReviewHtml }} />
          </section>
        </div>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
