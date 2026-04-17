import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthorDetailPage, getAuthorBySlug, getAuthorDetailPageData } from "@/features/authors";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";

type AuthorDetailRoutePageProps = Readonly<{
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata({ params }: AuthorDetailRoutePageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [author, metadataContent] = await Promise.all([
    getAuthorBySlug(lang, slug),
    getWebsiteMetadataContent(lang),
  ]);

  if (!author) {
    return {
      title: metadataContent.siteTitle,
      description: metadataContent.siteDescription,
      openGraph: metadataContent.ogImage
        ? {
            images: [{ url: metadataContent.ogImage }],
          }
        : undefined,
    };
  }

  return {
    title: `${author.name} | ${metadataContent.siteTitle}`,
    description: author.shortBio || metadataContent.siteDescription,
    openGraph: metadataContent.ogImage
      ? {
          images: [{ url: metadataContent.ogImage }],
        }
      : undefined,
  };
}

export default async function AuthorDetailRoutePage({
  params,
  searchParams,
}: AuthorDetailRoutePageProps) {
  const { lang, slug } = await params;
  const sourceParam = (await searchParams).from;
  const sourceValue = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam;
  const breadcrumbSource = sourceValue === "home" ? "home" : "authors";

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, data] = await Promise.all([
    getDictionary(lang),
    getAuthorDetailPageData(lang, slug),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <AuthorDetailPage
          copy={dictionary}
          locale={lang}
          data={data}
          breadcrumbSource={breadcrumbSource}
        />
      </main>
    </div>
  );
}
