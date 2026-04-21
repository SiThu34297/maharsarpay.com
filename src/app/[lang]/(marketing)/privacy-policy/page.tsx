import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { getBookFilterOptions } from "@/features/books";
import { getWebsiteMetadataContent, getWebsitePageInfo } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type PrivacyPolicyRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

function getPrivacyPageTitle(locale: "en" | "my") {
  return locale === "my" ? "ကိုယ်ရေးအချက်အလက် မူဝါဒ" : "Privacy Policy";
}

function getPrivacyPageDescription(locale: "en" | "my") {
  return locale === "my"
    ? "မဟာစာပေ၏ ကိုယ်ရေးအချက်အလက်အသုံးပြုမှုနှင့် လုံခြံုရေးမူဝါဒများကို ဖတ်ရှုနိုင်ပါသည်။"
    : "Read Mahar Sarpay privacy practices and data handling policy.";
}

export async function generateMetadata({ params }: PrivacyPolicyRoutePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [seo, pageInfo] = await Promise.all([
    getWebsiteMetadataContent(lang),
    getWebsitePageInfo(lang),
  ]);

  return buildRouteMetadata({
    lang,
    pathname: "/privacy-policy",
    title: `${getPrivacyPageTitle(lang)} | ${seo.siteTitle}`,
    description: pageInfo.privacyPolicyPlainText || getPrivacyPageDescription(lang),
    ogImage: seo.ogImage,
  });
}

export default async function PrivacyPolicyRoutePage({ params }: PrivacyPolicyRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, pageInfo, bookFilterOptions] = await Promise.all([
    getDictionary(lang),
    getWebsitePageInfo(lang),
    getBookFilterOptions(lang),
  ]);

  const isMyanmar = lang === "my";
  const navigation = getMarketingNavigation(lang);
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${lang}/books?category=${encodeURIComponent(category.value)}`,
  }));

  return (
    <div
      id="top"
      className={`min-h-screen bg-background text-foreground ${isMyanmar ? "locale-my" : ""}`}
    >
      <MarketingSiteHeader
        copy={dictionary}
        locale={lang}
        navigation={navigation}
        activeNavId="contact"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="home-shell section-gap space-y-8 md:space-y-10">
        <section className="contact-surface">
          <h1 className="text-3xl md:text-4xl">{getPrivacyPageTitle(lang)}</h1>
          <p className="mt-3 text-base leading-relaxed text-(--color-text-muted) md:text-lg">
            {getPrivacyPageDescription(lang)}
          </p>
        </section>

        <section className="contact-surface">
          <div
            className="rich-text-content space-y-4 text-base leading-relaxed text-(--color-text-muted) [&_a]:text-(--color-brand) [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc"
            dangerouslySetInnerHTML={{ __html: pageInfo.privacyPolicyHtml }}
          />
        </section>
      </main>

      <MarketingSiteFooter copy={dictionary} navigation={navigation} />
    </div>
  );
}
