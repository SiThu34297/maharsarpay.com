import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { buildAuthorDetailSlug } from "@/features/authors/lib/author-slug";
import { isNewBookByReleaseDate } from "@/features/books/lib/book-freshness";
import { AddToCartButton } from "@/features/cart";
import type { BookDetailPageData } from "@/features/books/schemas/books";
import type { Dictionary, Locale } from "@/lib/i18n";
import { BookDetailImagePreview } from "./book-detail-image-preview";
import { BookPreviewModal } from "./book-preview-modal";

type BookDetailPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: BookDetailPageData;
  breadcrumbSource: "home" | "books";
}>;

const BOOK_DESCRIPTION_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h3",
  "h4",
  "a",
] as const;

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
const MY_MONTHS = [
  "ဇန်နဝါရီလ",
  "ဖေဖော်ဝါရီလ",
  "မတ်လ",
  "ဧပြီလ",
  "မေလ",
  "ဇွန်လ",
  "ဇူလိုင်လ",
  "ဩဂုတ်လ",
  "စက်တင်ဘာလ",
  "အောက်တိုဘာလ",
  "နိုဝင်ဘာလ",
  "ဒီဇင်ဘာလ",
];

function formatPrice(locale: Locale, value: number) {
  return `Ks ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function getDiscountPricing(book: {
  price: number;
  salePrice?: number | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
}) {
  const salePrice = book.salePrice && book.salePrice > 0 ? book.salePrice : book.price;
  const originalPrice =
    book.originalPrice && book.originalPrice > salePrice ? book.originalPrice : null;

  if (!originalPrice) {
    return {
      salePrice,
      originalPrice: null,
      discountAmount: null,
    };
  }

  const fallbackDiscountAmount = originalPrice - salePrice;

  return {
    salePrice,
    originalPrice,
    discountAmount: book.discountAmount ?? fallbackDiscountAmount,
  };
}

function getSafePdfUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function toMyanmarDigits(value: string) {
  return value.replace(/\d/g, (digit) => String.fromCharCode(0x1040 + Number(digit)));
}

function toLatinDigits(value: string) {
  return value.replace(/[\u1040-\u1049]/g, (digit) => String(digit.charCodeAt(0) - 0x1040));
}

function toMyanmarEditionText(rawEdition: string) {
  const normalized = rawEdition.trim();
  const numericMatch = toLatinDigits(normalized).match(/\d+/);

  if (!numericMatch) {
    return normalized;
  }

  const editionNumber = Number.parseInt(numericMatch[0], 10);

  if (!Number.isFinite(editionNumber) || editionNumber < 1) {
    return normalized;
  }

  if (editionNumber === 1) {
    return "ပထမအကြိမ်";
  }

  if (editionNumber === 2) {
    return "ဒုတိယအကြိမ်";
  }

  if (editionNumber === 3) {
    return "တတိယအကြိမ်";
  }

  return `${toMyanmarDigits(String(editionNumber))} ကြိမ်မြောက်`;
}

function toMyanmarPrintRecord(releaseDate: string | null | undefined, publishYear: number) {
  const parsed = releaseDate ? new Date(releaseDate) : null;

  if (parsed && !Number.isNaN(parsed.getTime())) {
    const month = MY_MONTHS[parsed.getUTCMonth()];
    const year = toMyanmarDigits(String(parsed.getUTCFullYear()));
    return `${month} ${year} ခုနှစ်`;
  }

  if (Number.isFinite(publishYear) && publishYear > 0) {
    return `${toMyanmarDigits(String(publishYear))} ခုနှစ်`;
  }

  return null;
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

function getBookAuthorsText(
  book: {
    author: string;
    authors: Array<{ name: string }>;
  },
  locale: Locale,
) {
  const names = book.authors.map((author) => author.name.trim()).filter((name) => name.length > 0);

  if (names.length > 0) {
    return names.join(locale === "my" ? "၊ " : ", ");
  }

  return book.author;
}

function toSafeBookDescriptionHtml(value: string): string {
  const sanitized = sanitizeHtml(value, {
    allowedTags: [...BOOK_DESCRIPTION_ALLOWED_TAGS],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href"],
    disallowedTagsMode: "discard",
  }).trim();

  if (sanitized) {
    return sanitized;
  }

  const fallbackText = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replaceAll(/\s+/g, " ")
    .trim();

  if (!fallbackText) {
    return "";
  }

  return `<p>${sanitizeHtml(fallbackText, { allowedTags: [], allowedAttributes: {} })}</p>`;
}

export function BookDetailPage({ copy, locale, data, breadcrumbSource }: BookDetailPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = data.filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const book = data.book;
  const detailHrefSuffix = breadcrumbSource === "home" ? "?from=home" : "?from=books";
  const pricing = getDiscountPricing(book);
  const isNewBook = isNewBookByReleaseDate(book.bookReleaseDate);
  const previewPdfSrc = getSafePdfUrl(book.previewPdfSrc);
  const viewAllBookReviewsHref = `/${locale}/book-reviews?bookId=${encodeURIComponent(book.id)}`;
  const bookDescriptionHtml = toSafeBookDescriptionHtml(book.description);
  const displayAuthor = getBookAuthorsText(book, locale);
  const bookAuthors =
    book.authors.length > 0
      ? book.authors
      : [
          {
            id: book.authorId,
            name: book.author,
            imageSrc: book.authorImageSrc ?? null,
            imageAlt: book.authorImageAlt ?? null,
          },
        ];
  const bookCategories =
    book.categories.length > 0
      ? book.categories
      : [
          {
            id: book.categoryId,
            name: book.category,
          },
        ];
  const hasPreview = Boolean(previewPdfSrc);
  const categorySummary = bookCategories.map((category) => category.name).join(", ");
  const editionLabel = locale === "my" ? "ပုံနှိပ်မှတ်တမ်း" : "Edition";
  const printRecordValue =
    locale === "my"
      ? (() => {
          const editionText = toMyanmarEditionText(book.edition);
          const releaseText = toMyanmarPrintRecord(book.bookReleaseDate, book.publishYear);
          return releaseText ? `${editionText} ၊ ${releaseText}` : editionText;
        })()
      : book.edition;

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

      <main className="section-gap">
        <div className="home-shell">
          <nav className="book-detail-breadcrumb" aria-label={copy.bookDetail.breadcrumbLabel}>
            {breadcrumbSource === "home" ? (
              <Link href={`/${locale}`}>{copy.navigation.home}</Link>
            ) : (
              <Link href={`/${locale}/books`}>{copy.bookDetail.breadcrumbBooks}</Link>
            )}
            <span>/</span>
            <span className="truncate">{book.title}</span>
          </nav>

          <section className="book-detail-hero mt-5">
            <BookDetailImagePreview title={book.title} images={book.galleryImages} />

            <div className="book-detail-content">
              {isNewBook ? (
                <span className="mb-2 inline-flex w-fit rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                  {locale === "my" ? "အသစ်" : "New"}
                </span>
              ) : null}
              <h1 className="book-detail-title">{book.title}</h1>
              <div className="book-detail-spec-list" aria-label={copy.bookDetail.bookInfoLabel}>
                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">{copy.bookDetail.byAuthorLabel}</span>
                  <span className="book-detail-spec-value">
                    {bookAuthors.map((author, index) => {
                      const hasAuthorDetail =
                        author.id.trim().length > 0 && author.id !== "unknown-author";

                      return (
                        <span key={`${author.id}:${author.name}`}>
                          {hasAuthorDetail ? (
                            <Link
                              href={`/${locale}/authors/${buildAuthorDetailSlug({
                                id: author.id,
                                name: author.name,
                              })}`}
                              className="book-detail-spec-link"
                            >
                              {author.name}
                            </Link>
                          ) : (
                            author.name
                          )}
                          {index < bookAuthors.length - 1 ? (
                            <span>{locale === "my" ? "၊ " : ", "}</span>
                          ) : null}
                        </span>
                      );
                    })}
                  </span>
                </div>

                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">{copy.booksList.categoryLabel}</span>
                  <span className="book-detail-spec-value">{categorySummary}</span>
                </div>

                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">{copy.bookDetail.previewCtaLabel}</span>
                  <span className="book-detail-spec-value">
                    {hasPreview && previewPdfSrc ? (
                      <BookPreviewModal
                        title={book.title}
                        pdfSrc={previewPdfSrc}
                        previewTitle={copy.bookDetail.previewTitle}
                        previewCtaLabel="View PDF"
                        openPreviewLabel={copy.bookDetail.openPreviewLabel}
                        downloadPreviewLabel={copy.bookDetail.downloadPreviewLabel}
                        closePreviewLabel={copy.bookDetail.closePreviewLabel}
                        triggerVariant="inlineLink"
                      />
                    ) : (
                      "-"
                    )}
                  </span>
                </div>

                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">{copy.bookDetail.pageCountLabel}</span>
                  <span className="book-detail-spec-value book-detail-spec-value-plain">
                    {book.pageCount}
                  </span>
                </div>

                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">{editionLabel}</span>
                  <span className="book-detail-spec-value book-detail-spec-value-plain">
                    {printRecordValue}
                  </span>
                </div>

                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">{copy.bookDetail.formatLabel}</span>
                  <span className="book-detail-spec-value book-detail-spec-value-plain">
                    {book.format}
                  </span>
                </div>

                <div className="book-detail-spec-row">
                  <span className="book-detail-spec-label">တန်ဖိုး</span>
                  <span className="book-detail-spec-value book-detail-spec-value-plain">
                    {formatPrice(locale, pricing.salePrice)}
                  </span>
                </div>

                <div className="book-detail-spec-row book-detail-spec-row-wide">
                  <span className="book-detail-spec-label">
                    {copy.bookDetail.doorToDoorAdTitle}
                  </span>
                  <span className="book-detail-spec-value book-detail-spec-value-plain">
                    {copy.bookDetail.doorToDoorAdContact}
                  </span>
                </div>

                <div className="book-detail-status-line">
                  <span>Status:</span>
                  <span
                    className={book.inStock ? "book-detail-status-in" : "book-detail-status-out"}
                  >
                    {book.inStock ? copy.bookDetail.inStock : copy.bookDetail.outOfStock}
                  </span>
                </div>
              </div>

              <div className="book-detail-primary-actions">
                <AddToCartButton
                  item={{
                    cartProductId: book.cartProductId,
                    title: book.title,
                    author: displayAuthor,
                    authorId: book.authorId,
                    price: book.price,
                    salePrice: book.salePrice,
                    originalPrice: book.originalPrice,
                    discountAmount: book.discountAmount,
                    coverImageSrc: book.coverImageSrc,
                    coverImageAlt: book.coverImageAlt,
                  }}
                  addLabel={book.inStock ? copy.booksList.addToCart : copy.bookDetail.outOfStock}
                  addedLabel={copy.booksList.addedToCart}
                  disabled={!book.inStock}
                  className="book-detail-add-to-cart"
                />
              </div>
            </div>
          </section>

          <h2 className="book-detail-section-heading">{copy.bookDetail.aboutThisBookLabel}</h2>
          <section className="book-detail-long-description rich-text-content">
            {bookDescriptionHtml ? (
              <div
                className="book-detail-rich-text"
                dangerouslySetInnerHTML={{ __html: bookDescriptionHtml }}
              />
            ) : (
              <p>{book.description}</p>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="book-detail-section-heading text-[var(--color-text-main)]">
                {copy.bookDetail.bookReviewsTitle}
              </h2>
              <Link href={viewAllBookReviewsHref} className="book-detail-related-all-link">
                {copy.bookDetail.viewAllBookReviews}
              </Link>
            </div>

            {data.bookReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.bookReviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/${locale}/book-reviews/${review.id}`}
                    className="block h-full"
                  >
                    <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:border-[var(--color-brand)]">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--color-text-main)]">
                          {review.reviewerName}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-[var(--color-text-muted)]">
                          {formatDate(locale, review.createdAt)} {" • "}
                          {copy.bookReviewDetail.viewsLabel} {formatViews(locale, review.viewCount)}
                        </p>
                      </div>

                      <p className="mt-3 line-clamp-4 text-sm text-[var(--color-text-main)]">
                        {review.excerpt}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-muted)]">
                {copy.bookDetail.noBookReviews}
              </div>
            )}
          </section>

          {data.relatedBooks.length > 0 ? (
            <section className="book-detail-related">
              <div className="book-detail-related-header">
                <h2 className="book-detail-section-heading">{copy.bookDetail.relatedBooksTitle}</h2>
                <Link href={`/${locale}/books`} className="book-detail-related-all-link">
                  {copy.bookDetail.viewAllBooks}
                </Link>
              </div>

              <div className="book-detail-related-grid">
                {data.relatedBooks.map((relatedBook) => {
                  const relatedPricing = getDiscountPricing(relatedBook);
                  const displayRelatedAuthor = getBookAuthorsText(relatedBook, locale);
                  const hasDiscount =
                    Boolean(relatedPricing.originalPrice) &&
                    (relatedPricing.discountAmount ?? 0) > 0;
                  const isNewRelatedBook = isNewBookByReleaseDate(relatedBook.bookReleaseDate);

                  return (
                    <article
                      key={relatedBook.id}
                      className="book-list-card book-list-card-clean flex flex-col"
                    >
                      <Link
                        href={`/${locale}/books/${relatedBook.slug}${detailHrefSuffix}`}
                        className="book-list-image-wrap relative block overflow-hidden"
                      >
                        <Image
                          src={relatedBook.coverImageSrc}
                          alt={relatedBook.coverImageAlt}
                          width={360}
                          height={470}
                          className="book-list-image h-[260px] w-full object-cover sm:h-[280px]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        {hasDiscount ? (
                          <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-[var(--color-secondary)] px-3 py-1 text-[11px] font-semibold text-white">
                            -{formatPrice(locale, relatedPricing.discountAmount ?? 0)}
                          </span>
                        ) : null}
                        {isNewRelatedBook ? (
                          <span className="absolute left-0 top-0 z-10 rounded-br-md bg-[var(--color-brand)] px-3 py-1 text-[11px] font-semibold text-white">
                            {locale === "my" ? "အသစ်" : "New"}
                          </span>
                        ) : null}
                      </Link>
                      <h3 className="book-list-title mt-1.5 text-center text-[var(--color-text-main)]">
                        <Link href={`/${locale}/books/${relatedBook.slug}${detailHrefSuffix}`}>
                          {relatedBook.title}
                        </Link>
                      </h3>
                      <p className="-mt-0.5 min-h-[1.25rem] line-clamp-1 px-4 text-center text-[var(--color-text-muted)]">
                        {displayRelatedAuthor}
                      </p>
                      <div className="mt-1 flex items-center justify-center gap-2 pb-2">
                        <p className="text-[var(--color-brand)]">
                          {formatPrice(locale, relatedPricing.salePrice)}
                        </p>
                        {relatedPricing.originalPrice ? (
                          <p className="text-xs text-[var(--color-text-muted)] line-through">
                            {formatPrice(locale, relatedPricing.originalPrice)}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
