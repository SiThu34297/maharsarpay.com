import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BookReviewDetailPage,
  getBookReviewById,
  getBookReviewDetailPageData,
} from "@/features/book-reviews";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type BookReviewDetailRoutePageProps = Readonly<{
  params: Promise<{ lang: string; id: string }>;
}>;

export async function generateMetadata({
  params,
}: BookReviewDetailRoutePageProps): Promise<Metadata> {
  const { lang, id } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [review, metadataContent] = await Promise.all([
    getBookReviewById(lang, id),
    getWebsiteMetadataContent(lang),
  ]);

  if (!review) {
    return buildRouteMetadata({
      lang,
      pathname: `/book-reviews/${id}`,
      title: metadataContent.siteTitle,
      description: metadataContent.siteDescription,
      ogImage: metadataContent.ogImage,
      openGraphType: "article",
    });
  }

  return buildRouteMetadata({
    lang,
    pathname: `/book-reviews/${id}`,
    title: `${review.reviewerName} | ${review.book.title} | ${metadataContent.siteTitle}`,
    description: review.excerpt || metadataContent.siteDescription,
    ogImage: metadataContent.ogImage,
    openGraphType: "article",
  });
}

export default async function BookReviewDetailRoutePage({
  params,
}: BookReviewDetailRoutePageProps) {
  const { lang, id } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, data] = await Promise.all([
    getDictionary(lang),
    getBookReviewDetailPageData(lang, id),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <BookReviewDetailPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
