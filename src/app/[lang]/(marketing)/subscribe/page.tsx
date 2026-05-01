import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { getBookFilterOptions } from "@/features/books";
import { ContactSubscriptionForm } from "@/features/contact";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type SubscribeRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export async function generateMetadata({ params }: SubscribeRoutePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [dictionary, metadataContent] = await Promise.all([
    getDictionary(lang),
    getWebsiteMetadataContent(lang),
  ]);

  return buildRouteMetadata({
    lang,
    pathname: "/subscribe",
    title: `${dictionary.contactPage.subscriptionTitle} | ${metadataContent.siteTitle}`,
    description: dictionary.contactPage.subscriptionDescription,
    ogImage: metadataContent.ogImage,
  });
}

export default async function SubscribeRoutePage({ params }: SubscribeRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, bookFilterOptions] = await Promise.all([
    getDictionary(lang),
    getBookFilterOptions(lang),
  ]);
  const navigation = getMarketingNavigation(lang);
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${lang}/books?category=${encodeURIComponent(category.value)}`,
  }));

  return (
    <div className="flex flex-1 flex-col" lang={lang}>
      <MarketingSiteHeader
        copy={dictionary}
        locale={lang}
        navigation={navigation}
        activeNavId="contact"
        bookCategoryLinks={bookCategoryLinks}
      />
      <main className="home-shell section-gap w-full">
        <ContactSubscriptionForm copy={dictionary.contactPage} locale={lang} />
      </main>
      <MarketingSiteFooter copy={dictionary} navigation={navigation} />
    </div>
  );
}
