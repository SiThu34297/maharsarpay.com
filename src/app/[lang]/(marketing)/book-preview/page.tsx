import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookPreviewPage, getBookFilterOptions, searchBooks } from "@/features/books";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type BookPreviewRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

type BookListItem = Awaited<ReturnType<typeof searchBooks>>["items"][number];
type PreviewBookListItem = BookListItem & { previewPdfSrc: string };

function hasPreviewPdfSrc(book: BookListItem): book is PreviewBookListItem {
  return typeof book.previewPdfSrc === "string" && book.previewPdfSrc.length > 0;
}

function getBookPreviewPageDescription(locale: "en" | "my") {
  return locale === "my"
    ? "စာမြည်း ဖတ်ရှုနိုင်သော စာအုပ်များကို တစ်နေရာတည်းတွင် ရွေးချယ်ကြည့်ရှုနိုင်ပါသည်။"
    : "Browse books with available preview PDFs and read sample pages before buying.";
}

export async function generateMetadata({ params }: BookPreviewRoutePageProps): Promise<Metadata> {
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
    pathname: "/book-preview",
    title: `${dictionary.navigation.bookPreview} | ${seo.siteTitle}`,
    description: getBookPreviewPageDescription(lang),
    ogImage: seo.ogImage,
  });
}

export default async function BookPreviewRoutePage({ params }: BookPreviewRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, filterOptions, response] = await Promise.all([
    getDictionary(lang),
    getBookFilterOptions(lang),
    searchBooks(lang, { limit: 24 }),
  ]);

  const books = response.items.filter(hasPreviewPdfSrc);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <BookPreviewPage
          copy={dictionary}
          locale={lang}
          books={books}
          filterOptions={filterOptions}
        />
      </main>
    </div>
  );
}
