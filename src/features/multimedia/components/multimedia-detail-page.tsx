import Image from "next/image";
import Link from "next/link";

import { CameraIcon, PlayIcon } from "@radix-ui/react-icons";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
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
const MULTIMEDIA_DISPLAY_LOCALE: Locale = "en";

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
                {copy.multimediaDetail.publishedOnLabel}{" "}
                {formatDate(MULTIMEDIA_DISPLAY_LOCALE, media.publishedAt)}
              </p>
            </div>

            <div className="multimedia-detail-narrative">
              <h2>{copy.multimediaDetail.storyTitle}</h2>
              {narrativeParagraphs.map((paragraph, index) => (
                <p key={`${media.id}-narrative-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
