import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MultimediaDetailPage,
  buildMultimediaDetailSlug,
  getMediaBySlug,
  getMultimediaDetailPageData,
} from "@/features/multimedia";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type MultimediaDetailRoutePageProps = Readonly<{
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata({
  params,
}: MultimediaDetailRoutePageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [media, metadataContent] = await Promise.all([
    getMediaBySlug(lang, slug),
    getWebsiteMetadataContent(lang),
  ]);
  const canonicalSlug = media ? buildMultimediaDetailSlug(media) : slug;

  if (!media) {
    return buildRouteMetadata({
      lang,
      pathname: `/multimedia/${canonicalSlug}`,
      title: metadataContent.siteTitle,
      description: metadataContent.siteDescription,
      ogImage: metadataContent.ogImage,
      openGraphType: "article",
    });
  }

  return buildRouteMetadata({
    lang,
    pathname: `/multimedia/${canonicalSlug}`,
    title: `${media.title} | ${metadataContent.siteTitle}`,
    description: media.description || metadataContent.siteDescription,
    ogImage: metadataContent.ogImage,
    openGraphType: "article",
  });
}

export default async function MultimediaDetailRoutePage({
  params,
  searchParams,
}: MultimediaDetailRoutePageProps) {
  const { lang, slug } = await params;
  const sourceParam = (await searchParams).from;
  const sourceValue = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam;
  const breadcrumbSource = sourceValue === "home" ? "home" : "multimedia";

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, data] = await Promise.all([
    getDictionary(lang),
    getMultimediaDetailPageData(lang, slug),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <MultimediaDetailPage
          copy={dictionary}
          locale={lang}
          data={data}
          breadcrumbSource={breadcrumbSource}
        />
      </main>
    </div>
  );
}
