import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPage, getContactPageData } from "@/features/contact";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";

type ContactRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export async function generateMetadata({ params }: ContactRoutePageProps): Promise<Metadata> {
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

  return {
    title: `${dictionary.contactPage.metaTitle} | ${metadataContent.siteTitle}`,
    description: dictionary.contactPage.metaDescription,
    openGraph: metadataContent.ogImage
      ? {
          images: [{ url: metadataContent.ogImage }],
        }
      : undefined,
  };
}

export default async function ContactRoutePage({ params }: ContactRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, data] = await Promise.all([getDictionary(lang), getContactPageData(lang)]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <ContactPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
