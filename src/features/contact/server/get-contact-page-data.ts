import "server-only";

import { siteConfig } from "@/lib/constants/site";
import type { Locale } from "@/lib/i18n";

import type { ContactPageData } from "@/features/contact/schemas/contact";

const MAP_QUERY = encodeURIComponent("No. 12, Pansodan Road, Yangon, Myanmar");
const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;

const contentByLocale: Record<Locale, Omit<ContactPageData, "websiteTitle">> = {
  en: {
    cover: {
      imageSrc: "/images/home/real/hero/hero-2.jpg",
      imageAlt: "Mahar Sarpay contact cover",
    },
    profile: {
      imageSrc: "/images/home/real/authors/author-1.jpg",
      imageAlt: "Contact profile photo",
    },
    websiteDescription:
      "Mahar Sarpay is a modern reading destination where curated books, local voices, and community learning come together.",
    socialLinks: [
      {
        id: "website",
        label: "Website",
        href: "https://maharsarpay.com",
        handle: "maharsarpay.com",
        icon: "globe",
      },
      {
        id: "instagram",
        label: "Instagram",
        href: "https://instagram.com/maharsarpay",
        handle: "@maharsarpay",
        icon: "instagram",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        href: "https://linkedin.com/company/maharsarpay",
        handle: "/company/maharsarpay",
        icon: "linkedin",
      },
      {
        id: "email",
        label: "Email",
        href: "mailto:hello@maharsarpay.com",
        handle: "hello@maharsarpay.com",
        icon: "email",
      },
    ],
    map: {
      embedUrl: MAP_EMBED_URL,
      locationText: "No. 12, Pansodan Road, Yangon, Myanmar",
      ariaLabel: "Map showing Mahar Sarpay location",
    },
  },
  my: {
    cover: {
      imageSrc: "/images/home/real/hero/hero-2.jpg",
      imageAlt: "မဟာစာပေ ဆက်သွယ်ရန် ကာဗာ",
    },
    profile: {
      imageSrc: "/images/home/real/authors/author-1.jpg",
      imageAlt: "ဆက်သွယ်ရန် ပရိုဖိုင်ဓာတ်ပုံ",
    },
    websiteDescription:
      "မဟာစာပေသည် ရွေးချယ်ထားသောစာအုပ်များ၊ ဒေသခံစာရေးသူများနှင့် အသိုင်းအဝိုင်းဖတ်ရှုမှုတို့ကို ပေါင်းစည်းထားသော ခေတ်မီဖတ်ရှုရာနေရာဖြစ်သည်။",
    socialLinks: [
      {
        id: "website",
        label: "ဝက်ဘ်ဆိုက်",
        href: "https://maharsarpay.com",
        handle: "maharsarpay.com",
        icon: "globe",
      },
      {
        id: "instagram",
        label: "Instagram",
        href: "https://instagram.com/maharsarpay",
        handle: "@maharsarpay",
        icon: "instagram",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        href: "https://linkedin.com/company/maharsarpay",
        handle: "/company/maharsarpay",
        icon: "linkedin",
      },
      {
        id: "email",
        label: "အီးမေးလ်",
        href: "mailto:hello@maharsarpay.com",
        handle: "hello@maharsarpay.com",
        icon: "email",
      },
    ],
    map: {
      embedUrl: MAP_EMBED_URL,
      locationText: "အမှတ် ၁၂၊ ပန်းဆိုးတန်းလမ်း၊ ရန်ကုန်၊ မြန်မာ",
      ariaLabel: "မဟာစာပေတည်နေရာ မြေပုံ",
    },
  },
};

export async function getContactPageData(locale: Locale): Promise<ContactPageData> {
  const localizedContent = contentByLocale[locale];

  return {
    ...localizedContent,
    websiteTitle: siteConfig.title,
  };
}
