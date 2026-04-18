import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
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

function formatPrice(locale: Locale, value: number) {
  if (locale === "my") {
    return `${new Intl.NumberFormat("my-MM", {
      maximumFractionDigits: 0,
    }).format(value)} ကျပ်`;
  }

  return `MMK ${new Intl.NumberFormat("en-US", {
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

function getInitial(name: string) {
  const firstChar = Array.from(name.trim())[0];
  return firstChar ? firstChar.toLocaleUpperCase() : "R";
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
  const authorImageSrc = book.authorImageSrc?.trim() || null;
  const authorImageAlt = book.authorImageAlt?.trim() || `${book.author} portrait`;

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingTopBrandStrip
        locale={locale}
        title="မဟာစာပေ"
        message="သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့"
      />
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
              <div className="book-detail-categories" aria-label={copy.booksList.categoryLabel}>
                {bookCategories.map((category) => (
                  <Link
                    key={`${category.id}:${category.name}`}
                    href={`/${locale}/books?category=${encodeURIComponent(category.id || category.name)}`}
                    className="book-detail-category-chip"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <h1 className="book-detail-title">{book.title}</h1>
              <div className="book-detail-author">
                <p className="book-detail-author-label">{copy.bookDetail.byAuthorLabel}</p>
                <div className="book-detail-author-list">
                  {bookAuthors.map((author) => {
                    const hasAuthorDetail =
                      author.id.trim().length > 0 && author.id !== "unknown-author";
                    const authorDetailHref = `/${locale}/authors/${encodeURIComponent(author.id)}`;
                    const authorImageSrc = author.imageSrc?.trim() || null;
                    const authorImageAlt = author.imageAlt?.trim() || `${author.name} portrait`;

                    return (
                      <div
                        key={`${author.id}:${author.name}`}
                        className="book-detail-author-identity"
                      >
                        {authorImageSrc ? (
                          hasAuthorDetail ? (
                            <Link
                              href={authorDetailHref}
                              className="book-detail-author-avatar-link"
                            >
                              <Image
                                src={authorImageSrc}
                                alt={authorImageAlt}
                                width={44}
                                height={44}
                                className="book-detail-author-avatar"
                              />
                            </Link>
                          ) : (
                            <Image
                              src={authorImageSrc}
                              alt={authorImageAlt}
                              width={44}
                              height={44}
                              className="book-detail-author-avatar"
                            />
                          )
                        ) : hasAuthorDetail ? (
                          <Link href={authorDetailHref} className="book-detail-author-avatar-link">
                            <span className="book-detail-author-avatar-fallback">
                              {getInitial(author.name)}
                            </span>
                          </Link>
                        ) : (
                          <span className="book-detail-author-avatar-fallback">
                            {getInitial(author.name)}
                          </span>
                        )}

                        {hasAuthorDetail ? (
                          <Link href={authorDetailHref} className="book-detail-author-name">
                            {author.name}
                          </Link>
                        ) : (
                          <span className="book-detail-author-name">{author.name}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="book-detail-price">{formatPrice(locale, pricing.salePrice)}</p>
                {pricing.originalPrice ? (
                  <>
                    <p className="text-sm text-[var(--color-text-muted)] line-through">
                      {formatPrice(locale, pricing.originalPrice)}
                    </p>
                    <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-accent)]">
                      -{formatPrice(locale, pricing.discountAmount ?? 0)}
                    </span>
                  </>
                ) : null}
              </div>

              <div
                className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4"
                aria-label={copy.bookDetail.bookInfoLabel}
              >
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {copy.bookDetail.editionLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
                    {book.edition}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {copy.bookDetail.publishYearLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
                    {book.publishYear}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {copy.bookDetail.pageCountLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
                    {book.pageCount}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {copy.bookDetail.formatLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
                    {book.format}
                  </p>
                </div>
              </div>

              <div className="book-detail-primary-actions">
                <AddToCartButton
                  item={{
                    cartProductId: book.cartProductId,
                    title: book.title,
                    author: displayAuthor,
                    price: book.price,
                    salePrice: book.salePrice,
                    originalPrice: book.originalPrice,
                    discountAmount: book.discountAmount,
                    coverImageSrc: book.coverImageSrc,
                    coverImageAlt: book.coverImageAlt,
                  }}
                  addLabel={copy.booksList.addToCart}
                  addedLabel={copy.booksList.addedToCart}
                  className="book-detail-add-to-cart"
                />

                {previewPdfSrc ? (
                  <BookPreviewModal
                    title={book.title}
                    pdfSrc={previewPdfSrc}
                    previewTitle={copy.bookDetail.previewTitle}
                    previewCtaLabel={copy.bookDetail.previewCtaLabel}
                    openPreviewLabel={copy.bookDetail.openPreviewLabel}
                    downloadPreviewLabel={copy.bookDetail.downloadPreviewLabel}
                    closePreviewLabel={copy.bookDetail.closePreviewLabel}
                    triggerVariant="inline"
                  />
                ) : null}
              </div>

              <div className="mt-4 rounded-xl border border-[var(--color-brand)] bg-[var(--color-brand-subtle)] p-3">
                <p className="text-sm font-semibold text-[var(--color-brand)]">
                  {copy.bookDetail.doorToDoorAdTitle}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-main)]">
                  {copy.bookDetail.doorToDoorAdContact}
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {copy.bookDetail.doorToDoorAdShippingNote}
                </p>
              </div>
            </div>
          </section>

          <section className="book-detail-long-description rich-text-content">
            <h2>{copy.bookDetail.aboutThisBookLabel}</h2>
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
              <h2 className="text-2xl text-[var(--color-text-main)]">
                {copy.bookDetail.bookReviewsTitle}
              </h2>
              <Link href={viewAllBookReviewsHref} className="book-detail-related-all-link">
                {copy.bookDetail.viewAllBookReviews}
              </Link>
            </div>

            {data.bookReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.bookReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-sm font-semibold text-[var(--color-brand)]">
                        {getInitial(review.reviewerName)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--color-text-main)]">
                          {review.reviewerName}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {formatDate(locale, review.createdAt)} {" • "}
                          {copy.bookReviewDetail.viewsLabel} {formatViews(locale, review.viewCount)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-4 text-sm text-[var(--color-text-main)]">
                      {review.excerpt}
                    </p>

                    <Link
                      href={`/${locale}/book-reviews/${review.id}`}
                      className="mt-3 inline-flex rounded-full bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-95"
                    >
                      {copy.bookReviewsList.readReviewLabel}
                    </Link>
                  </article>
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
                <h2>{copy.bookDetail.relatedBooksTitle}</h2>
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

                  return (
                    <article key={relatedBook.id} className="book-detail-related-card">
                      <Link
                        href={`/${locale}/books/${relatedBook.slug}${detailHrefSuffix}`}
                        className="relative block"
                      >
                        <Image
                          src={relatedBook.coverImageSrc}
                          alt={relatedBook.coverImageAlt}
                          width={360}
                          height={470}
                          className="book-detail-related-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        {hasDiscount ? (
                          <span className="absolute left-2 top-2 z-10 rounded-full bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold text-white shadow-sm sm:left-3 sm:top-3 sm:text-xs">
                            -{formatPrice(locale, relatedPricing.discountAmount ?? 0)}
                          </span>
                        ) : null}
                      </Link>
                      <h3>
                        <Link href={`/${locale}/books/${relatedBook.slug}${detailHrefSuffix}`}>
                          {relatedBook.title}
                        </Link>
                      </h3>
                      <p className="line-clamp-1">{displayRelatedAuthor}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="book-detail-related-price">
                          {formatPrice(locale, relatedPricing.salePrice)}
                        </p>
                        {relatedPricing.originalPrice ? (
                          <p className="text-xs text-[var(--color-text-muted)] line-through">
                            {formatPrice(locale, relatedPricing.originalPrice)}
                          </p>
                        ) : null}
                      </div>

                      <AddToCartButton
                        item={{
                          cartProductId: relatedBook.cartProductId,
                          title: relatedBook.title,
                          author: displayRelatedAuthor,
                          price: relatedBook.price,
                          salePrice: relatedBook.salePrice,
                          originalPrice: relatedBook.originalPrice,
                          discountAmount: relatedBook.discountAmount,
                          coverImageSrc: relatedBook.coverImageSrc,
                          coverImageAlt: relatedBook.coverImageAlt,
                        }}
                        addLabel={copy.booksList.addToCart}
                        addedLabel={copy.booksList.addedToCart}
                        className="book-detail-add-to-cart"
                      />
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
