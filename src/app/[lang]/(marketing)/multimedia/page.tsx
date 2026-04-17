import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MultimediaPage,
  getMultimediaPageData,
  parseMultimediaListQueryFromObject,
} from "@/features/multimedia";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type MultimediaRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata({ params }: MultimediaRoutePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [dictionary, seo] = await Promise.all([
    getDictionary(lang),
    getWebsiteMetadataContent(lang),
  ]);

  return buildRouteMetadata({
    lang,
    pathname: "/multimedia",
    title: `${dictionary.multimediaList.title} | ${seo.siteTitle}`,
    description: dictionary.multimediaList.description,
    ogImage: seo.ogImage,
  });
}

export default async function MultimediaRoutePage({
  params,
  searchParams,
}: MultimediaRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const parsedQuery = parseMultimediaListQueryFromObject(await searchParams);
  const data = await getMultimediaPageData(lang, parsedQuery);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <MultimediaPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
