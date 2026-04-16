import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MultimediaDetailPage,
  getMediaBySlug,
  getMultimediaDetailPageData,
} from "@/features/multimedia";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";

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

  const media = await getMediaBySlug(lang, slug);

  if (!media) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  return {
    title: `${media.title} | ${siteConfig.title}`,
    description: media.description,
  };
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
