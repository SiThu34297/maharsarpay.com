import Image from "next/image";
import Link from "next/link";

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

type BookDetailPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: BookDetailPageData;
  breadcrumbSource: "home" | "books";
}>;

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

export function BookDetailPage({ copy, locale, data, breadcrumbSource }: BookDetailPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = data.filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const book = data.book;
  const detailHrefSuffix = breadcrumbSource === "home" ? "?from=home" : "?from=books";

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
              <p className="book-detail-category-chip">{book.category}</p>
              <h1 className="book-detail-title">{book.title}</h1>
              <p className="book-detail-author">
                {copy.bookDetail.byAuthorLabel}
                <span>{book.author}</span>
              </p>

              <p className="book-detail-price">{formatPrice(locale, book.price)}</p>
              <p className="book-detail-description">{book.description}</p>

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
                className="book-detail-add-to-cart"
              />
            </div>
          </section>

          <section className="book-detail-info-grid" aria-label={copy.bookDetail.bookInfoLabel}>
            <article className="book-detail-info-card">
              <h2>{copy.bookDetail.publishYearLabel}</h2>
              <p>{book.publishYear}</p>
            </article>
            <article className="book-detail-info-card">
              <h2>{copy.bookDetail.pageCountLabel}</h2>
              <p>{book.pageCount}</p>
            </article>
            <article className="book-detail-info-card">
              <h2>{copy.bookDetail.languageLabel}</h2>
              <p>{book.language}</p>
            </article>
            <article className="book-detail-info-card">
              <h2>{copy.bookDetail.formatLabel}</h2>
              <p>{book.format}</p>
            </article>
            <article className="book-detail-info-card book-detail-info-card-wide">
              <h2>{copy.bookDetail.isbnLabel}</h2>
              <p>{book.isbn}</p>
            </article>
          </section>

          <section className="book-detail-long-description">
            <h2>{copy.bookDetail.aboutThisBookLabel}</h2>
            <p>{book.description}</p>
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
                {data.relatedBooks.map((relatedBook) => (
                  <article key={relatedBook.id} className="book-detail-related-card">
                    <Link
                      href={`/${locale}/books/${relatedBook.slug}${detailHrefSuffix}`}
                      className="block"
                    >
                      <Image
                        src={relatedBook.coverImageSrc}
                        alt={relatedBook.coverImageAlt}
                        width={360}
                        height={470}
                        className="book-detail-related-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </Link>
                    <h3>
                      <Link href={`/${locale}/books/${relatedBook.slug}${detailHrefSuffix}`}>
                        {relatedBook.title}
                      </Link>
                    </h3>
                    <p>{relatedBook.author}</p>
                    <p className="book-detail-related-price">
                      {formatPrice(locale, relatedBook.price)}
                    </p>
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
