import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookDetailPage, getBookBySlug, getBookDetailPageData } from "@/features/books";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";

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

  const book = await getBookBySlug(lang, slug);

  if (!book) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  return {
    title: `${book.title} | ${siteConfig.title}`,
    description: book.description,
  };
}

export default async function BookDetailRoutePage({
  params,
  searchParams,
}: BookDetailRoutePageProps) {
  const { lang, slug } = await params;
  const sourceParam = (await searchParams).from;
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
