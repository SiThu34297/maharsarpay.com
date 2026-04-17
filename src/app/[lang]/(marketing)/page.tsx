import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "@/features/home";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type MarketingHomePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export async function generateMetadata({ params }: MarketingHomePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const seo = await getWebsiteMetadataContent(lang);

  return buildRouteMetadata({
    lang,
    pathname: "",
    title: seo.siteTitle || siteConfig.title,
    description: seo.siteDescription || siteConfig.description,
    ogImage: seo.ogImage,
  });
}

export default async function MarketingHomePage({ params }: MarketingHomePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <HomePage copy={dictionary} locale={lang} />
      </main>
    </div>
  );
}
