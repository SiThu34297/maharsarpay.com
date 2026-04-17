import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BooksPage, getBooksPageData, parseBookListQueryFromObject } from "@/features/books";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type BooksRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function getBooksPageDescription(locale: "en" | "my") {
  return locale === "my"
    ? "အမျိုးအစား၊ စာရေးသူနှင့် စာအုပ်အမည်အလိုက် စာအုပ်များကို ရှာဖွေလေ့လာနိုင်ပါသည်။"
    : "Browse books by title, author, and category at Mahar Sarpay.";
}

export async function generateMetadata({ params }: BooksRoutePageProps): Promise<Metadata> {
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
    pathname: "/books",
    title: `${dictionary.booksList.title} | ${seo.siteTitle}`,
    description: getBooksPageDescription(lang),
    ogImage: seo.ogImage,
  });
}

export default async function BooksRoutePage({ params, searchParams }: BooksRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const parsedQuery = parseBookListQueryFromObject(await searchParams);
  const data = await getBooksPageData(lang, parsedQuery);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <BooksPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
