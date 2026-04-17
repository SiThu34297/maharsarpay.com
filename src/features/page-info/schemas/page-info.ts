import type { Locale } from "@/lib/i18n";

export type WebsiteSocialPlatform =
  | "website"
  | "facebook"
  | "youtube"
  | "messenger"
  | "instagram"
  | "twitter"
  | "telegram"
  | "tiktok"
  | "linkedin"
  | "email";

export type WebsiteSocialLink = {
  id: string;
  label: string;
  href: string;
  handle: string;
  platform: WebsiteSocialPlatform;
};

export type WebsiteContactInfo = {
  address: string;
  websiteUrl: string;
  contactEmail: string;
  googleMapUrl: string;
  embedMapUrl: string;
  primaryPhone: string;
  secondaryPhone: string;
};

export type WebsiteBranding = {
  title: string;
  message: string;
  logoSrc: string;
  coverImageSrc: string;
};

export type WebsiteMetadataContent = {
  siteTitle: string;
  siteDescription: string;
  ogImage: string | null;
};

export type WebsitePageInfo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  coverThumbnail: string;
  ownerEmail: string;
  currency: string;
  privacyPolicyHtml: string;
  privacyPolicyPlainText: string;
  contact: WebsiteContactInfo;
  socialLinks: WebsiteSocialLink[];
  appUrl: {
    ios: string;
    android: string;
    huawei: string;
    other: string;
  };
};

export type WebsiteFooterContent = {
  description: string;
  address: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  socialLinks: WebsiteSocialLink[];
};

export type WebsiteContactContent = {
  branding: WebsiteBranding;
  contact: WebsiteContactInfo;
  socialLinks: WebsiteSocialLink[];
};

export type WebsiteSocialLabelMap = Record<WebsiteSocialPlatform, string>;

export type WebsiteFallbackConfig = {
  locale: Locale;
  title: string;
  description: string;
  thumbnail: string;
  coverThumbnail: string;
  ownerEmail: string;
  currency: string;
  privacyPolicyHtml: string;
  contact: Omit<WebsiteContactInfo, "embedMapUrl">;
  socialLinks: WebsiteSocialLink[];
};
