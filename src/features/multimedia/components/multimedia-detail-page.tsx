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

type MediaMasonryItem =
  | {
      id: string;
      kind: "photo";
      src: string;
      alt: string;
    }
  | {
      id: string;
      kind: "youtube" | "video";
      src: string;
      label: string;
    };

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

function toMyanmarDigits(value: string) {
  return value.replaceAll(/\d/g, (digit) => String.fromCodePoint(0x1040 + Number(digit)));
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

function toYouTubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return value;
      }

      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function buildMediaMasonryItems(media: MultimediaDetailPageData["media"]): MediaMasonryItem[] {
  if (media.mediaType === "photo") {
    const photoSources =
      media.galleryImages.length > 0
        ? media.galleryImages
        : [
            {
              src: media.imageSrc,
              alt: media.imageAlt,
            },
          ];

    return photoSources.map((image, index) => ({
      id: `${media.id}-photo-${index}`,
      kind: "photo",
      src: image.src,
      alt: image.alt,
    }));
  }

  const youtubeItems = media.youtubeUrls
    .map((url, index) => {
      const embedUrl = toYouTubeEmbedUrl(url);

      if (!embedUrl) {
        return null;
      }

      return {
        id: `${media.id}-youtube-${index}`,
        kind: "youtube" as const,
        src: embedUrl,
        label: `${media.title} YouTube ${index + 1}`,
      };
    })
    .filter((item): item is Extract<MediaMasonryItem, { kind: "youtube" }> => Boolean(item));

  const uploadedVideoItems = media.uploadedVideoUrls.map((url, index) => ({
    id: `${media.id}-video-${index}`,
    kind: "video" as const,
    src: url,
    label: `${media.title} Video ${index + 1}`,
  }));

  const videos = [...youtubeItems, ...uploadedVideoItems];

  if (videos.length > 0) {
    return videos;
  }

  return [
    {
      id: `${media.id}-fallback-photo`,
      kind: "photo",
      src: media.imageSrc,
      alt: media.imageAlt,
    },
  ];
}

function getPhotoMasonryVariant(index: number, totalItems: number) {
  if (totalItems === 1) {
    return "photo-frame-featured";
  }

  const variants = ["photo-frame-standard", "photo-frame-tall", "photo-frame-wide"];
  return variants[index % variants.length];
}

function getMasonryLayoutClass(totalItems: number) {
  if (totalItems <= 1) {
    return "multimedia-detail-masonry-single";
  }

  if (totalItems === 2) {
    return "multimedia-detail-masonry-pair";
  }

  if (totalItems === 3) {
    return "multimedia-detail-masonry-trio";
  }

  return "multimedia-detail-masonry-grid";
}

function buildNarrativeParagraphs(media: MultimediaDetailPageData["media"]) {
  const candidates = [media.lead, media.description, ...media.storyParagraphs]
    .map((value) => value.trim())
    .filter(Boolean);

  const seen = new Set<string>();

  return candidates.filter((value) => {
    const key = value.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
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
  const masonryItems = buildMediaMasonryItems(media);
  const masonryCount = masonryItems.length;
  const masonryLayoutClass = getMasonryLayoutClass(masonryCount);
  const narrativeParagraphs = buildNarrativeParagraphs(media);

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

          <section id="media-gallery" className="multimedia-detail-stage mt-5">
            <div className="multimedia-detail-stage-header">
              <span
                className={`media-type-pill ${
                  media.mediaType === "video" ? "media-type-pill-video" : "media-type-pill-photo"
                }`}
                aria-label={getMediaTypeLabel(copy.multimediaList, media.mediaType)}
              >
                {media.mediaType === "video" ? <PlayIcon /> : <CameraIcon />}
                <span>{getMediaTypeLabel(copy.multimediaList, media.mediaType)}</span>
              </span>
            </div>

            <div
              className={`multimedia-detail-masonry ${masonryLayoutClass}`}
              aria-label={copy.multimediaDetail.mediaInfoLabel}
            >
              {masonryItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`multimedia-detail-masonry-item ${
                    masonryCount === 1 ? "multimedia-detail-masonry-item-featured" : ""
                  }`}
                >
                  {item.kind === "photo" ? (
                    <div
                      className={`multimedia-detail-masonry-photo-frame ${getPhotoMasonryVariant(index, masonryCount)}`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="multimedia-detail-masonry-photo"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                  ) : item.kind === "youtube" ? (
                    <>
                      <div className="multimedia-detail-masonry-video-frame">
                        <iframe
                          src={item.src}
                          title={item.label}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="multimedia-detail-masonry-iframe"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="multimedia-detail-masonry-video-frame">
                      <video
                        controls
                        preload="metadata"
                        className="multimedia-detail-masonry-video"
                        poster={media.imageSrc}
                      >
                        <source src={item.src} />
                      </video>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="multimedia-detail-content-surface">
            <div className="multimedia-detail-content">
              <h1 className="multimedia-detail-title">{media.title}</h1>
              <p className="multimedia-detail-meta-line">
                {copy.multimediaDetail.byCreatorLabel}
                <span>{media.creator}</span>
              </p>
              <p className="multimedia-detail-published">
                {copy.multimediaDetail.publishedOnLabel} {formatDate(locale, media.publishedAt)}
              </p>
            </div>

            <div className="multimedia-detail-narrative">
              <h2>{copy.multimediaDetail.storyTitle}</h2>
              {narrativeParagraphs.map((paragraph, index) => (
                <p key={`${media.id}-narrative-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>

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
                {data.relatedBooks.map((book) => {
                  const pricing = getDiscountPricing(book);
                  const hasDiscount =
                    Boolean(pricing.originalPrice) && (pricing.discountAmount ?? 0) > 0;

                  return (
                    <article key={book.id} className="multimedia-detail-related-book-card">
                      <Link
                        href={`/${locale}/books/${book.slug}?from=books`}
                        className="relative block"
                      >
                        <Image
                          src={book.coverImageSrc}
                          alt={book.coverImageAlt}
                          width={360}
                          height={460}
                          className="multimedia-detail-related-book-cover"
                          sizes="(max-width: 768px) 50vw, 20vw"
                        />
                        {hasDiscount ? (
                          <span className="absolute left-2 top-2 z-10 rounded-full bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold text-white shadow-sm sm:left-3 sm:top-3 sm:text-xs">
                            -{formatPrice(locale, pricing.discountAmount ?? 0)}
                          </span>
                        ) : null}
                      </Link>

                      <h3>
                        <Link href={`/${locale}/books/${book.slug}?from=books`}>{book.title}</Link>
                      </h3>
                      <p>{book.author}</p>
                      <p className="multimedia-detail-related-book-price">
                        {formatPrice(locale, pricing.salePrice)}
                      </p>
                      {pricing.originalPrice ? (
                        <p className="mt-1 text-xs text-[var(--color-text-muted)] line-through">
                          {formatPrice(locale, pricing.originalPrice)}
                        </p>
                      ) : null}

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
                  );
                })}
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
