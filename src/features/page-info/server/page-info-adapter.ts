import "server-only";

import { cache } from "react";
import sanitizeHtml from "sanitize-html";

import type { Locale } from "@/lib/i18n";

import type {
  WebsiteBranding,
  WebsiteContactContent,
  WebsiteContactInfo,
  WebsiteFallbackConfig,
  WebsiteFooterContent,
  WebsiteMetadataContent,
  WebsitePageInfo,
  WebsiteSocialLabelMap,
  WebsiteSocialLink,
  WebsiteSocialPlatform,
} from "@/features/page-info/schemas/page-info";

const PAGES_ENDPOINT = "/api/web/pages";
const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const FALLBACK_LOGO_SRC = "/images/brand/maharsarpay-logo.png";
const FALLBACK_COVER_SRC = "/images/home/real/hero/hero-2.jpg";
const FALLBACK_BRAND_TITLE = "မဟာစာပေ";
const FALLBACK_BRAND_DESCRIPTION =
  "သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့";
const MAP_EMBED_BASE = "https://www.google.com/maps";

const ALLOWED_PRIVACY_TAGS = [
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
  "h2",
  "h3",
  "h4",
  "a",
] as const;

type BackendPageRecord = {
  id: number | string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  coverThumbnail: string | null;
  ownerEmail: string | null;
  currency: string | null;
  privacyPolicy: string | null;
  contactUs: {
    address: string | null;
    websiteUrl: string | null;
    contactEmail: string | null;
    googleMapUrl: string | null;
    primaryPhone: string | null;
    secondaryPhone: string | null;
  } | null;
  socialAddress: {
    tiktok: string | null;
    twitter: string | null;
    youtube: string | null;
    facebook: string | null;
    telegram: string | null;
    instagram: string | null;
    messenger: string | null;
  } | null;
  appUrl: {
    ios: string | null;
    other: string | null;
    huawei: string | null;
    android: string | null;
  } | null;
};

type BackendPagesResponse = {
  error: boolean;
  authorized: boolean;
  message: string;
  data: BackendPageRecord[];
};

function normalizeWhitespace(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.replaceAll(/\s+/g, " ").trim();
}

function toAbsoluteHttpUrl(value: string | null | undefined): string | null {
  const normalized = normalizeWhitespace(value);

  if (!normalized) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalized, BOOK_API_BASE_URL);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function sanitizePrivacyHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [...ALLOWED_PRIVACY_TAGS],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href"],
    disallowedTagsMode: "discard",
  }).trim();
}

function htmlToPlainText(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replaceAll(/\s+/g, " ")
    .trim();
}

function toGoogleEmbedUrlFromQuery(query: string) {
  const normalized = normalizeWhitespace(query);

  if (!normalized) {
    return null;
  }

  return `${MAP_EMBED_BASE}?q=${encodeURIComponent(normalized)}&output=embed`;
}

function buildGoogleMapEmbedUrl(address: string, fallbackUrl: string) {
  const directMapUrl = toAbsoluteHttpUrl(fallbackUrl);

  if (directMapUrl) {
    return directMapUrl;
  }

  const embedFromAddress = toGoogleEmbedUrlFromQuery(address);

  if (embedFromAddress) {
    return embedFromAddress;
  }

  return `${MAP_EMBED_BASE}?q=${encodeURIComponent("Yangon, Myanmar")}&output=embed`;
}

function getSocialLabels(locale: Locale): WebsiteSocialLabelMap {
  if (locale === "my") {
    return {
      website: "ဝက်ဘ်ဆိုက်",
      facebook: "Facebook",
      youtube: "YouTube",
      messenger: "Messenger",
      instagram: "Instagram",
      twitter: "X",
      telegram: "Telegram",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      email: "အီးမေးလ်",
    };
  }

  return {
    website: "Website",
    facebook: "Facebook",
    youtube: "YouTube",
    messenger: "Messenger",
    instagram: "Instagram",
    twitter: "X",
    telegram: "Telegram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    email: "Email",
  };
}

function toSocialHandle(platform: WebsiteSocialPlatform, href: string) {
  if (platform === "email") {
    return href.replace(/^mailto:/i, "");
  }

  if (platform === "website") {
    try {
      const parsed = new URL(href);
      return parsed.hostname.replace(/^www\./i, "");
    } catch {
      return href;
    }
  }

  try {
    const parsed = new URL(href);
    const path = parsed.pathname.replace(/\/$/, "");

    if (!path || path === "/") {
      return parsed.hostname.replace(/^www\./i, "");
    }

    return `${parsed.hostname.replace(/^www\./i, "")}${path}`;
  } catch {
    return href;
  }
}

function toSocialHref(
  platform: WebsiteSocialPlatform,
  value: string | null | undefined,
): string | null {
  const normalized = normalizeWhitespace(value);

  if (!normalized) {
    return null;
  }

  if (platform === "email") {
    const emailValue = normalized.replace(/^mailto:/i, "");

    return emailValue.includes("@") ? `mailto:${emailValue}` : null;
  }

  if (platform === "website" && !/^https?:\/\//i.test(normalized)) {
    return toAbsoluteHttpUrl(`https://${normalized}`);
  }

  return toAbsoluteHttpUrl(normalized);
}

function toSocialLinks(
  locale: Locale,
  source: {
    websiteUrl: string;
    contactEmail: string;
    socialAddress: BackendPageRecord["socialAddress"];
    fallbackLinks: WebsiteSocialLink[];
  },
): WebsiteSocialLink[] {
  const labels = getSocialLabels(locale);
  const links: WebsiteSocialLink[] = [];

  const candidates: Array<{ platform: WebsiteSocialPlatform; value: string | null | undefined }> = [
    { platform: "website", value: source.websiteUrl },
    { platform: "facebook", value: source.socialAddress?.facebook },
    { platform: "youtube", value: source.socialAddress?.youtube },
    { platform: "messenger", value: source.socialAddress?.messenger },
    { platform: "instagram", value: source.socialAddress?.instagram },
    { platform: "twitter", value: source.socialAddress?.twitter },
    { platform: "telegram", value: source.socialAddress?.telegram },
    { platform: "tiktok", value: source.socialAddress?.tiktok },
    { platform: "email", value: source.contactEmail },
  ];

  for (const candidate of candidates) {
    const href = toSocialHref(candidate.platform, candidate.value);

    if (!href) {
      continue;
    }

    links.push({
      id: candidate.platform,
      label: labels[candidate.platform],
      href,
      handle: toSocialHandle(candidate.platform, href),
      platform: candidate.platform,
    });
  }

  if (links.length > 0) {
    return links;
  }

  return source.fallbackLinks;
}

function toFallbackConfig(locale: Locale): WebsiteFallbackConfig {
  const isMyanmar = locale === "my";
  const fallbackAddress = isMyanmar
    ? "အမှတ် ၁၂၊ ပန်းဆိုးတန်းလမ်း၊ ရန်ကုန်၊ မြန်မာ"
    : "No. 12, Pansodan Road, Yangon, Myanmar";

  return {
    locale,
    title: FALLBACK_BRAND_TITLE,
    description: FALLBACK_BRAND_DESCRIPTION,
    thumbnail: FALLBACK_LOGO_SRC,
    coverThumbnail: FALLBACK_COVER_SRC,
    ownerEmail: "hello@maharsarpay.com",
    currency: "MMK",
    privacyPolicyHtml: `<p>${FALLBACK_BRAND_DESCRIPTION}</p>`,
    contact: {
      address: fallbackAddress,
      websiteUrl: "https://maharsarpay.com",
      contactEmail: "hello@maharsarpay.com",
      googleMapUrl: "https://www.google.com/maps?q=Yangon,+Myanmar",
      primaryPhone: "+95 9 123 456 789",
      secondaryPhone: "",
    },
    socialLinks: [
      {
        id: "website",
        label: isMyanmar ? "ဝက်ဘ်ဆိုက်" : "Website",
        href: "https://maharsarpay.com",
        handle: "maharsarpay.com",
        platform: "website",
      },
      {
        id: "instagram",
        label: "Instagram",
        href: "https://instagram.com/maharsarpay",
        handle: "instagram.com/maharsarpay",
        platform: "instagram",
      },
      {
        id: "email",
        label: isMyanmar ? "အီးမေးလ်" : "Email",
        href: "mailto:hello@maharsarpay.com",
        handle: "hello@maharsarpay.com",
        platform: "email",
      },
    ],
  };
}

function toWebsitePageInfo(locale: Locale, page: BackendPageRecord | null): WebsitePageInfo {
  const fallback = toFallbackConfig(locale);
  const rawDescription = normalizeWhitespace(page?.description) || fallback.description;
  const rawPrivacyHtml = normalizeWhitespace(page?.privacyPolicy) || fallback.privacyPolicyHtml;
  const privacyPolicyHtml = sanitizePrivacyHtml(rawPrivacyHtml);
  const privacyPolicyPlainText = htmlToPlainText(privacyPolicyHtml) || rawDescription;

  const contactAddress = normalizeWhitespace(page?.contactUs?.address) || fallback.contact.address;
  const contactWebsiteUrl =
    toAbsoluteHttpUrl(page?.contactUs?.websiteUrl) ?? fallback.contact.websiteUrl;
  const contactEmail =
    normalizeWhitespace(page?.contactUs?.contactEmail) ||
    normalizeWhitespace(page?.ownerEmail) ||
    fallback.contact.contactEmail;
  const googleMapUrl =
    toAbsoluteHttpUrl(page?.contactUs?.googleMapUrl) ?? fallback.contact.googleMapUrl;

  const contactInfo: WebsiteContactInfo = {
    address: contactAddress,
    websiteUrl: contactWebsiteUrl,
    contactEmail,
    googleMapUrl,
    embedMapUrl: buildGoogleMapEmbedUrl(contactAddress, googleMapUrl),
    primaryPhone:
      normalizeWhitespace(page?.contactUs?.primaryPhone) || fallback.contact.primaryPhone,
    secondaryPhone:
      normalizeWhitespace(page?.contactUs?.secondaryPhone) || fallback.contact.secondaryPhone,
  };

  return {
    id: String(page?.id ?? "fallback-page-info"),
    title: normalizeWhitespace(page?.title) || fallback.title,
    description: rawDescription,
    thumbnail: toAbsoluteHttpUrl(page?.thumbnail) ?? fallback.thumbnail,
    coverThumbnail: toAbsoluteHttpUrl(page?.coverThumbnail) ?? fallback.coverThumbnail,
    ownerEmail: normalizeWhitespace(page?.ownerEmail) || fallback.ownerEmail,
    currency: normalizeWhitespace(page?.currency) || fallback.currency,
    privacyPolicyHtml,
    privacyPolicyPlainText,
    contact: contactInfo,
    socialLinks: toSocialLinks(locale, {
      websiteUrl: contactWebsiteUrl,
      contactEmail,
      socialAddress: page?.socialAddress ?? null,
      fallbackLinks: fallback.socialLinks,
    }),
    appUrl: {
      ios: normalizeWhitespace(page?.appUrl?.ios),
      android: normalizeWhitespace(page?.appUrl?.android),
      huawei: normalizeWhitespace(page?.appUrl?.huawei),
      other: normalizeWhitespace(page?.appUrl?.other),
    },
  };
}

async function fetchPageRecordFromBackend(locale: Locale): Promise<BackendPageRecord | null> {
  const response = await fetch(`${BOOK_API_BASE_URL}${PAGES_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(`Pages API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BackendPagesResponse>;

  if (payload.error) {
    throw new Error(payload.message || "Pages API returned an error");
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Pages API returned an invalid response payload");
  }

  const firstRecord = payload.data[0];

  if (!firstRecord || typeof firstRecord !== "object") {
    return null;
  }

  return firstRecord;
}

const getWebsitePageInfoCached = cache(async (locale: Locale): Promise<WebsitePageInfo> => {
  try {
    const pageRecord = await fetchPageRecordFromBackend(locale);

    return toWebsitePageInfo(locale, pageRecord);
  } catch {
    return toWebsitePageInfo(locale, null);
  }
});

export async function getWebsitePageInfo(locale: Locale): Promise<WebsitePageInfo> {
  return getWebsitePageInfoCached(locale);
}

export async function getWebsiteBranding(locale: Locale): Promise<WebsiteBranding> {
  const info = await getWebsitePageInfo(locale);

  return {
    title: info.title,
    message: info.description,
    logoSrc: info.thumbnail,
    coverImageSrc: info.coverThumbnail,
  };
}

export async function getWebsiteFooterContent(locale: Locale): Promise<WebsiteFooterContent> {
  const info = await getWebsitePageInfo(locale);

  return {
    description: info.description,
    address: info.contact.address,
    primaryPhone: info.contact.primaryPhone,
    secondaryPhone: info.contact.secondaryPhone,
    email: info.contact.contactEmail || info.ownerEmail,
    socialLinks: info.socialLinks,
  };
}

export async function getWebsiteContactContent(locale: Locale): Promise<WebsiteContactContent> {
  const info = await getWebsitePageInfo(locale);

  return {
    branding: {
      title: info.title,
      message: info.description,
      logoSrc: info.thumbnail,
      coverImageSrc: info.coverThumbnail,
    },
    contact: info.contact,
    socialLinks: info.socialLinks,
  };
}

export async function getWebsiteMetadataContent(locale: Locale): Promise<WebsiteMetadataContent> {
  const info = await getWebsitePageInfo(locale);

  return {
    siteTitle: info.title,
    siteDescription: info.privacyPolicyPlainText || info.description,
    ogImage: info.coverThumbnail || info.thumbnail || null,
  };
}
