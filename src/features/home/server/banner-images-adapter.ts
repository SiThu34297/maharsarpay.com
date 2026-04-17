import "server-only";

import { hasLocale, type Locale } from "@/lib/i18n";

import type { HeroSlide, HeroSlideAction } from "@/features/home/schemas/home";

const BANNER_IMAGES_ENDPOINT = "/api/web/banner-images";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const INTERNAL_DEEPLINK_HOSTS = new Set(["maharsarpay.com", "www.maharsarpay.com"]);
const INTERNAL_URL_BASE = "https://maharsarpay.com";

type BackendBannerActionType = "DEEPLINK" | "EXTERNAL";

type BackendBannerImageRecord = {
  id: string;
  title: string | null;
  description: string | null;
  webImage: string | null;
  mobileImage: string | null;
  actionType: BackendBannerActionType | null;
  actionUrl: string | null;
  active: number | string | null;
  deletedStatus: number | string | null;
  createdAt: string;
  updatedAt: string;
};

type BackendBannerImagesResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendBannerImageRecord[];
};

function normalizeWhitespace(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.replaceAll(/\s+/g, " ").trim();
}

function toSafeInteger(value: number | string | null | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.trunc(parsed);
}

function isHttpUrl(url: URL) {
  return url.protocol === "http:" || url.protocol === "https:";
}

function resolveBannerImageSrc(value: string | null | undefined) {
  const normalized = normalizeWhitespace(value);

  if (!normalized) {
    return null;
  }

  try {
    const imageUrl = new URL(normalized, BOOK_API_BASE_URL);

    if (!isHttpUrl(imageUrl)) {
      return null;
    }

    return imageUrl.toString();
  } catch {
    return null;
  }
}

function rewriteLegacyBookPath(pathname: string) {
  const legacyBookPathPattern = /^\/book\/([^/]+)\/?$/i;
  const match = legacyBookPathPattern.exec(pathname);

  if (!match) {
    return pathname;
  }

  return `/books/${match[1]}`;
}

function ensureLocalePrefix(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  if (hasLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}

function normalizeExternalHref(actionUrl: string | null | undefined) {
  const normalized = normalizeWhitespace(actionUrl);

  if (!normalized) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalized);

    if (!isHttpUrl(parsedUrl)) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function normalizeDeepLinkHref(locale: Locale, actionUrl: string | null | undefined) {
  const normalized = normalizeWhitespace(actionUrl);

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("#")) {
    return normalized;
  }

  let parsedUrl: URL;

  try {
    const isAbsolute = /^https?:\/\//i.test(normalized);

    if (isAbsolute) {
      parsedUrl = new URL(normalized);

      if (!isHttpUrl(parsedUrl)) {
        return null;
      }

      const hostname = parsedUrl.hostname.toLowerCase();

      if (!INTERNAL_DEEPLINK_HOSTS.has(hostname)) {
        return null;
      }
    } else {
      const normalizedPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
      parsedUrl = new URL(normalizedPath, INTERNAL_URL_BASE);
    }
  } catch {
    return null;
  }

  const localizedPath = ensureLocalePrefix(rewriteLegacyBookPath(parsedUrl.pathname), locale);

  return `${localizedPath}${parsedUrl.search}${parsedUrl.hash}`;
}

function toHeroSlideAction(
  locale: Locale,
  actionType: BackendBannerActionType | null,
  actionUrl: string | null,
): HeroSlideAction | null {
  if (actionType === "EXTERNAL") {
    const href = normalizeExternalHref(actionUrl);

    return href ? { type: "EXTERNAL", href } : null;
  }

  if (actionType === "DEEPLINK") {
    const href = normalizeDeepLinkHref(locale, actionUrl);

    return href ? { type: "DEEPLINK", href } : null;
  }

  return null;
}

function toHeroSlide(locale: Locale, banner: BackendBannerImageRecord): HeroSlide | null {
  const desktopImageSrc =
    resolveBannerImageSrc(banner.webImage) ?? resolveBannerImageSrc(banner.mobileImage);
  const mobileImageSrc = resolveBannerImageSrc(banner.mobileImage) ?? desktopImageSrc;

  if (!desktopImageSrc || !mobileImageSrc) {
    return null;
  }

  const title = normalizeWhitespace(banner.title) || (locale === "my" ? "ကြော်ငြာ" : "Banner");

  return {
    id: banner.id,
    title,
    description: normalizeWhitespace(banner.description),
    imageDesktopSrc: desktopImageSrc,
    imageMobileSrc: mobileImageSrc,
    imageAlt: `${title} banner`,
    action: toHeroSlideAction(locale, banner.actionType, banner.actionUrl),
  };
}

async function fetchBannerImagesFromBackend(locale: Locale): Promise<BackendBannerImageRecord[]> {
  const response = await fetch(`${BOOK_API_BASE_URL}${BANNER_IMAGES_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Banner images API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendBannerImagesResponse>;

  if (payload.error) {
    throw new Error(payload.message || "Banner images API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Banner images API returned an invalid response payload");
  }

  return payload.data.filter((item): item is BackendBannerImageRecord => {
    return Boolean(item && typeof item === "object" && typeof item.id === "string");
  });
}

function getActiveBanners(banners: BackendBannerImageRecord[]) {
  return banners.filter((banner) => {
    return toSafeInteger(banner.active, 0) === 1 && toSafeInteger(banner.deletedStatus, 0) === 0;
  });
}

export async function getHomeHeroSlidesFromBackend(locale: Locale): Promise<HeroSlide[]> {
  const banners = await fetchBannerImagesFromBackend(locale);

  return getActiveBanners(banners)
    .map((banner) => toHeroSlide(locale, banner))
    .filter((slide): slide is HeroSlide => Boolean(slide));
}
