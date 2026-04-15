import { notFound } from "next/navigation";

import {
  AuthorsPage,
  getAuthorsPageData,
  parseAuthorListQueryFromObject,
} from "@/features/authors";
import { getDictionary, hasLocale } from "@/lib/i18n";

type AuthorsRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

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
