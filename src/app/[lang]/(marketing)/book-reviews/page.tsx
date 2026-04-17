import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BookReviewsPage,
  getBookReviewsPageData,
  parseBookReviewListQueryFromObject,
} from "@/features/book-reviews";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type BookReviewsRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata({ params }: BookReviewsRoutePageProps): Promise<Metadata> {
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
    pathname: "/book-reviews",
    title: `${dictionary.bookReviewsList.title} | ${seo.siteTitle}`,
    description: dictionary.bookReviewsList.description,
    ogImage: seo.ogImage,
  });
}

export default async function BookReviewsRoutePage({
  params,
  searchParams,
}: BookReviewsRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const parsedQuery = parseBookReviewListQueryFromObject(await searchParams);
  const data = await getBookReviewsPageData(lang, parsedQuery);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <BookReviewsPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
