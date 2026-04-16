import Image from "next/image";
import Link from "next/link";

import { CameraIcon, PlayIcon } from "@radix-ui/react-icons";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { AddToCartButton } from "@/features/cart";
import type { MultimediaDetailPageData, MediaType } from "@/features/multimedia/schemas/multimedia";
import type { Dictionary, Locale } from "@/lib/i18n";

type MultimediaDetailPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: MultimediaDetailPageData;
  breadcrumbSource: "home" | "multimedia";
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

function getMediaTypeLabel(copy: Dictionary["multimediaList"], mediaType: MediaType) {
  return mediaType === "video" ? copy.videoFilterLabel : copy.photoFilterLabel;
}

export function MultimediaDetailPage({
  copy,
  locale,
  data,
  breadcrumbSource,
}: MultimediaDetailPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = data.filterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const media = data.media;

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
        activeNavId="media"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="section-gap">
        <div className="home-shell">
          <nav
            className="multimedia-detail-breadcrumb"
            aria-label={copy.multimediaDetail.breadcrumbLabel}
          >
            {breadcrumbSource === "home" ? (
              <Link href={`/${locale}`}>{copy.navigation.home}</Link>
            ) : (
              <Link href={`/${locale}/multimedia`}>{copy.multimediaDetail.breadcrumbMedia}</Link>
            )}
            <span>/</span>
            <span className="truncate">{media.title}</span>
          </nav>

          <section className="multimedia-detail-hero mt-5">
            <div className="multimedia-detail-media-wrap">
              <div className="multimedia-detail-media-glow" aria-hidden />
              <div className="multimedia-detail-media-frame">
                <Image
                  src={media.imageSrc}
                  alt={media.imageAlt}
                  width={920}
                  height={580}
                  className="multimedia-detail-media-image"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
                <span
                  className={`media-type-pill ${
                    media.mediaType === "video" ? "media-type-pill-video" : "media-type-pill-photo"
                  }`}
                  aria-label={getMediaTypeLabel(copy.multimediaList, media.mediaType)}
                >
                  {media.mediaType === "video" ? <PlayIcon /> : <CameraIcon />}
                  <span>{getMediaTypeLabel(copy.multimediaList, media.mediaType)}</span>
                </span>

                <button type="button" className="multimedia-detail-hero-cta" aria-disabled="true">
                  {media.mediaType === "video"
                    ? copy.multimediaDetail.watchNowLabel
                    : copy.multimediaDetail.viewGalleryLabel}
                </button>
              </div>
            </div>

            <div className="multimedia-detail-content">
              <p className="multimedia-detail-category-chip">
                {media.mediaType === "video"
                  ? copy.multimediaDetail.heroBadgeVideo
                  : copy.multimediaDetail.heroBadgePhoto}
              </p>
              <h1 className="multimedia-detail-title">{media.title}</h1>
              <p className="multimedia-detail-meta-line">
                {copy.multimediaDetail.byCreatorLabel}
                <span>{media.creator}</span>
              </p>
              <p className="multimedia-detail-published">
                {copy.multimediaDetail.publishedOnLabel} {formatDate(locale, media.publishedAt)}
              </p>
              <p className="multimedia-detail-lead">{media.lead}</p>
              <p className="multimedia-detail-description">{media.description}</p>
            </div>
          </section>

          <section className="multimedia-detail-story">
            <h2>{copy.multimediaDetail.storyTitle}</h2>
            {media.storyParagraphs.map((paragraph, index) => (
              <p key={`${media.id}-story-${index}`}>{paragraph}</p>
            ))}
          </section>

          <section
            className="multimedia-detail-info-grid"
            aria-label={copy.multimediaDetail.mediaInfoLabel}
          >
            {media.durationLabel ? (
              <article className="multimedia-detail-info-card">
                <h3>{copy.multimediaDetail.durationLabel}</h3>
                <p>{media.durationLabel}</p>
              </article>
            ) : null}
            {typeof media.photoCount === "number" ? (
              <article className="multimedia-detail-info-card">
                <h3>{copy.multimediaDetail.photoCountLabel}</h3>
                <p>{media.photoCount}</p>
              </article>
            ) : null}
            <article className="multimedia-detail-info-card multimedia-detail-info-card-wide">
              <h3>{copy.multimediaDetail.tagsLabel}</h3>
              <div className="multimedia-detail-tags">
                {media.tags.map((tag) => (
                  <span key={`${media.id}-${tag}`} className="multimedia-detail-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </section>

          {media.galleryImages.length > 0 ? (
            <section
              className="multimedia-detail-gallery"
              aria-label={copy.multimediaDetail.viewGalleryLabel}
            >
              {media.galleryImages.map((galleryImage, index) => (
                <div
                  key={`${media.id}-gallery-${index}`}
                  className="multimedia-detail-gallery-item"
                >
                  <Image
                    src={galleryImage.src}
                    alt={galleryImage.alt}
                    width={340}
                    height={240}
                    className="multimedia-detail-gallery-image"
                    sizes="(max-width: 768px) 50vw, 22vw"
                  />
                </div>
              ))}
            </section>
          ) : null}

          <section className="multimedia-detail-related">
            <div className="multimedia-detail-section-header">
              <h2>{copy.multimediaDetail.relatedMediaTitle}</h2>
              <Link href={`/${locale}/multimedia`} className="multimedia-detail-section-link">
                {copy.multimediaDetail.viewAllMedia}
              </Link>
            </div>

            {data.relatedMedia.length > 0 ? (
              <div className="multimedia-detail-related-media-grid">
                {data.relatedMedia.map((relatedMedia) => (
                  <article key={relatedMedia.id} className="multimedia-detail-related-media-card">
                    <Link href={`/${locale}/multimedia/${relatedMedia.slug}?from=multimedia`}>
                      <Image
                        src={relatedMedia.imageSrc}
                        alt={relatedMedia.imageAlt}
                        width={360}
                        height={220}
                        className="multimedia-detail-related-media-image"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </Link>
                    <h3>
                      <Link href={`/${locale}/multimedia/${relatedMedia.slug}?from=multimedia`}>
                        {relatedMedia.title}
                      </Link>
                    </h3>
                    <p>{relatedMedia.description}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="multimedia-detail-empty">
                <h3>{copy.multimediaDetail.noRelatedMediaTitle}</h3>
                <p>{copy.multimediaDetail.noRelatedMediaDescription}</p>
                <Link href={`/${locale}/multimedia`}>{copy.multimediaDetail.browseMedia}</Link>
              </div>
            )}
          </section>

          <section className="multimedia-detail-related-books">
            <div className="multimedia-detail-section-header">
              <h2>{copy.multimediaDetail.relatedBooksTitle}</h2>
              <Link href={`/${locale}/books`} className="multimedia-detail-section-link">
                {copy.multimediaDetail.viewAllBooks}
              </Link>
            </div>

            {data.relatedBooks.length > 0 ? (
              <div className="multimedia-detail-related-books-grid">
                {data.relatedBooks.map((book) => (
                  <article key={book.id} className="multimedia-detail-related-book-card">
                    <Link href={`/${locale}/books/${book.slug}?from=books`} className="block">
                      <Image
                        src={book.coverImageSrc}
                        alt={book.coverImageAlt}
                        width={360}
                        height={460}
                        className="multimedia-detail-related-book-cover"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    </Link>

                    <h3>
                      <Link href={`/${locale}/books/${book.slug}?from=books`}>{book.title}</Link>
                    </h3>
                    <p>{book.author}</p>
                    <p className="multimedia-detail-related-book-price">
                      {formatPrice(locale, book.price)}
                    </p>

                    <AddToCartButton
                      item={{
                        cartProductId: book.cartProductId,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        salePrice: book.salePrice,
                        originalPrice: book.originalPrice,
                        discountAmount: book.discountAmount,
                        coverImageSrc: book.coverImageSrc,
                        coverImageAlt: book.coverImageAlt,
                      }}
                      addLabel={copy.booksList.addToCart}
                      addedLabel={copy.booksList.addedToCart}
                      className="multimedia-detail-add-to-cart"
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="multimedia-detail-empty">
                <h3>{copy.multimediaDetail.noRelatedBooksTitle}</h3>
                <p>{copy.multimediaDetail.noRelatedBooksDescription}</p>
                <Link href={`/${locale}/books`}>{copy.multimediaDetail.browseBooks}</Link>
              </div>
            )}
          </section>
        </div>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
