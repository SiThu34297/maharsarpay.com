import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MultimediaPage, getMultimediaPageData } from "@/features/multimedia";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type MultimediaRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function getFirstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePositiveInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return undefined;
  }

  return Math.floor(parsed);
}

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
  const rawSearchParams = await searchParams;
  const q = getFirstValue(rawSearchParams.q)?.trim() || undefined;
  const limit = parsePositiveInteger(getFirstValue(rawSearchParams.limit));
  const photoPage =
    parsePositiveInteger(getFirstValue(rawSearchParams.photoPage)) ??
    parsePositiveInteger(getFirstValue(rawSearchParams.page));
  const blogPage =
    parsePositiveInteger(getFirstValue(rawSearchParams.blogPage)) ??
    parsePositiveInteger(getFirstValue(rawSearchParams.page));
  const parsedQuery = { q, limit, photoPage, blogPage };
  const data = await getMultimediaPageData(lang, parsedQuery);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <MultimediaPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
