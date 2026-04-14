import { notFound } from "next/navigation";

import { BooksPage, getBooksPageData, parseBookListQueryFromObject } from "@/features/books";
import { getDictionary, hasLocale } from "@/lib/i18n";

type BooksRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

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
