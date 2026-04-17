import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AuthorsPage,
  getAuthorsPageData,
  parseAuthorListQueryFromObject,
} from "@/features/authors";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type AuthorsRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata({ params }: AuthorsRoutePageProps): Promise<Metadata> {
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
    pathname: "/authors",
    title: `${dictionary.authorsList.title} | ${seo.siteTitle}`,
    description: dictionary.authorsList.description,
    ogImage: seo.ogImage,
  });
}

export default async function AuthorsRoutePage({ params, searchParams }: AuthorsRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const parsedQuery = parseAuthorListQueryFromObject(await searchParams);
  const data = await getAuthorsPageData(lang, parsedQuery);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <AuthorsPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
