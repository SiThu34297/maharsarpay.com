import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BookDetailPage,
  buildBookDetailSlug,
  getBookBySlug,
  getBookDetailPageData,
} from "@/features/books";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type BookDetailRoutePageProps = Readonly<{
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata({ params }: BookDetailRoutePageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [book, metadataContent] = await Promise.all([
    getBookBySlug(lang, slug),
    getWebsiteMetadataContent(lang),
  ]);
  const canonicalSlug = book ? buildBookDetailSlug(book) : slug;

  if (!book) {
    return buildRouteMetadata({
      lang,
      pathname: `/books/${canonicalSlug}`,
      title: metadataContent.siteTitle,
      description: metadataContent.siteDescription,
      ogImage: metadataContent.ogImage,
      openGraphType: "article",
    });
  }

  return buildRouteMetadata({
    lang,
    pathname: `/books/${canonicalSlug}`,
    title: `${book.title} | ${metadataContent.siteTitle}`,
    description: book.description || metadataContent.siteDescription,
    ogImage: metadataContent.ogImage,
    openGraphType: "article",
  });
}

export default async function BookDetailRoutePage({
  params,
  searchParams,
}: BookDetailRoutePageProps) {
  const { lang, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const sourceParam = resolvedSearchParams.from;
  const sourceValue = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam;
  const breadcrumbSource = sourceValue === "home" ? "home" : "books";

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, data] = await Promise.all([
    getDictionary(lang),
    getBookDetailPageData(lang, slug),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <BookDetailPage
          copy={dictionary}
          locale={lang}
          data={data}
          breadcrumbSource={breadcrumbSource}
        />
      </main>
    </div>
  );
}
