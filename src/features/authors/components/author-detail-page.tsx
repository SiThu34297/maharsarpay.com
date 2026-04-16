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
import type { AuthorDetailPageData } from "@/features/authors/schemas/authors";
import type { Dictionary, Locale } from "@/lib/i18n";

type AuthorDetailPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: AuthorDetailPageData;
  breadcrumbSource: "home" | "authors";
}>;

const AUTHOR_BIO_ALLOWED_TAGS = [
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

function toPlainText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replaceAll(/\s+/g, " ")
    .trim();
}

function toSafeRichTextHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [...AUTHOR_BIO_ALLOWED_TAGS],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href"],
    disallowedTagsMode: "discard",
  }).trim();
}

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

function formatCount(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "my" ? "my-MM" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function AuthorDetailPage({ copy, locale, data, breadcrumbSource }: AuthorDetailPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = data.filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const author = data.author;
  const authorLongBioHtml = toSafeRichTextHtml(author.longBio);
  const authorLongBioFallback = toPlainText(author.longBio) || author.name;
  const relatedAuthors = data.relatedAuthors.slice(0, 4);
  const authorKicker = locale === "my" ? "စာရေးသူ" : "Author";

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingTopBrandStrip
        title="မဟာစာပေ"
        message="သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့"
      />
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="authors"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="section-gap">
        <div className="home-shell">
          <nav className="author-detail-breadcrumb" aria-label={copy.authorDetail.breadcrumbLabel}>
            {breadcrumbSource === "home" ? (
              <Link href={`/${locale}`}>{copy.navigation.home}</Link>
            ) : (
              <Link href={`/${locale}/authors`}>{copy.authorDetail.breadcrumbAuthors}</Link>
            )}
            <span>/</span>
            <span className="truncate">{author.name}</span>
          </nav>

          <section className="author-detail-hero mt-5">
            <div className="author-detail-portrait-wrap">
              <div className="author-detail-portrait-glow" aria-hidden />
              <Image
                src={author.imageSrc}
                alt={author.imageAlt}
                width={440}
                height={520}
                className="author-detail-portrait"
                sizes="(max-width: 1023px) 100vw, 30vw"
              />
            </div>

            <div className="author-detail-content">
              <div className="author-detail-headline">
                <p className="author-detail-kicker">{authorKicker}</p>
                <h1 className="author-detail-name">{author.name}</h1>
              </div>

              <div className="author-detail-stats" aria-label={copy.authorDetail.breadcrumbLabel}>
                <div className="author-detail-stat-card">
                  <span className="author-detail-stat-value">
                    {formatCount(locale, data.authoredBooks.length)}
                  </span>
                  <span className="author-detail-stat-label">
                    {copy.authorDetail.authoredBooksTitle}
                  </span>
                </div>
              </div>

              <div className="author-detail-actions">
                <Link
                  href={`/${locale}/books?q=${encodeURIComponent(author.name)}`}
                  className="author-detail-primary-cta"
                >
                  {copy.authorDetail.viewBooksCta}
                </Link>
                <Link href={`/${locale}/authors`} className="author-detail-secondary-cta">
                  {copy.authorDetail.viewAllAuthors}
                </Link>
              </div>
            </div>
          </section>

          <section className="author-detail-about">
            <h2>{copy.authorDetail.aboutTitle}</h2>
            {authorLongBioHtml ? (
              <div
                className="author-detail-rich-text"
                dangerouslySetInnerHTML={{ __html: authorLongBioHtml }}
              />
            ) : (
              <p>{authorLongBioFallback}</p>
            )}
          </section>

          <section id="author-books" className="author-detail-books">
            <div className="author-detail-section-header">
              <h2>{copy.authorDetail.authoredBooksTitle}</h2>
              <Link href={`/${locale}/books`} className="author-detail-section-link">
                {copy.authorDetail.viewAllBooks}
              </Link>
            </div>
            <p className="author-detail-section-subtitle">
              {copy.authorDetail.authoredBooksDescription}
            </p>

            {data.authoredBooks.length > 0 ? (
              <div className="author-detail-books-grid">
                {data.authoredBooks.map((book) => (
                  <article key={book.id} className="author-detail-book-card">
                    <Link href={`/${locale}/books/${book.slug}?from=books`} className="block">
                      <Image
                        src={book.coverImageSrc}
                        alt={book.coverImageAlt}
                        width={360}
                        height={460}
                        className="author-detail-book-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </Link>

                    <h3 className="author-detail-book-title">
                      <Link href={`/${locale}/books/${book.slug}?from=books`}>{book.title}</Link>
                    </h3>
                    <p className="author-detail-book-author">{book.author}</p>
                    <p className="author-detail-book-price">{formatPrice(locale, book.price)}</p>

                    <AddToCartButton
                      item={{
                        cartProductId: book.cartProductId,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        coverImageSrc: book.coverImageSrc,
                        coverImageAlt: book.coverImageAlt,
                      }}
                      addLabel={copy.booksList.addToCart}
                      addedLabel={copy.booksList.addedToCart}
                      className="author-detail-add-to-cart"
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="author-detail-empty">
                <h3>{copy.authorDetail.noBooksTitle}</h3>
                <p>{copy.authorDetail.noBooksDescription}</p>
                <Link href={`/${locale}/books`}>{copy.authorDetail.browseBooks}</Link>
              </div>
            )}
          </section>

          {relatedAuthors.length > 0 ? (
            <section className="author-detail-related">
              <div className="author-detail-section-header">
                <h2>{copy.authorDetail.relatedAuthorsTitle}</h2>
                <Link href={`/${locale}/authors`} className="author-detail-section-link">
                  {copy.authorDetail.viewAllAuthors}
                </Link>
              </div>

              <div className="author-detail-related-grid">
                {relatedAuthors.map((relatedAuthor) => (
                  <article key={relatedAuthor.id} className="author-detail-related-card">
                    <Link href={`/${locale}/authors/${relatedAuthor.slug}?from=authors`}>
                      <Image
                        src={relatedAuthor.imageSrc}
                        alt={relatedAuthor.imageAlt}
                        width={160}
                        height={160}
                        className="author-detail-related-avatar"
                        sizes="96px"
                      />
                    </Link>
                    <h3 className="author-detail-related-name">
                      <Link href={`/${locale}/authors/${relatedAuthor.slug}?from=authors`}>
                        {relatedAuthor.name}
                      </Link>
                    </h3>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
