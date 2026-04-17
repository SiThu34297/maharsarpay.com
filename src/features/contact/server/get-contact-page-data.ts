import "server-only";

import { getWebsitePageInfo } from "@/features/page-info";
import type { Locale } from "@/lib/i18n";

import type { ContactPageData } from "@/features/contact/schemas/contact";

function toContactSocialIcon(platform: string): ContactPageData["socialLinks"][number]["icon"] {
  switch (platform) {
    case "website":
      return "globe";
    case "facebook":
      return "facebook";
    case "youtube":
      return "youtube";
    case "messenger":
      return "messenger";
    case "instagram":
      return "instagram";
    case "twitter":
      return "twitter";
    case "telegram":
      return "telegram";
    case "tiktok":
      return "tiktok";
    case "linkedin":
      return "linkedin";
    case "email":
      return "email";
    default:
      return "globe";
  }
}

export async function getContactPageData(locale: Locale): Promise<ContactPageData> {
  const pageInfo = await getWebsitePageInfo(locale);

  return {
    cover: {
      imageSrc: pageInfo.coverThumbnail,
      imageAlt: locale === "my" ? "မဟာစာပေ ဆက်သွယ်ရန် ကာဗာ" : "Mahar Sarpay contact cover",
    },
    profile: {
      imageSrc: pageInfo.thumbnail,
      imageAlt: locale === "my" ? "ဆက်သွယ်ရန် ပရိုဖိုင်ဓာတ်ပုံ" : "Contact profile photo",
    },
    websiteTitle: pageInfo.title,
    websiteDescription: pageInfo.description,
    socialLinks: pageInfo.socialLinks.map((socialLink) => ({
      id: socialLink.id,
      label: socialLink.label,
      href: socialLink.href,
      handle: socialLink.handle,
      icon: toContactSocialIcon(socialLink.platform),
    })),
    map: {
      embedUrl: pageInfo.contact.embedMapUrl,
      locationText: pageInfo.contact.address,
      ariaLabel: locale === "my" ? "မဟာစာပေတည်နေရာ မြေပုံ" : "Map showing Mahar Sarpay location",
    },
  };
}
