import { notFound } from "next/navigation";

import {
  MultimediaPage,
  getMultimediaPageData,
  parseMultimediaListQueryFromObject,
} from "@/features/multimedia";
import { getDictionary, hasLocale } from "@/lib/i18n";

type MultimediaRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function MultimediaRoutePage({
  params,
  searchParams,
}: MultimediaRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const parsedQuery = parseMultimediaListQueryFromObject(await searchParams);
  const data = await getMultimediaPageData(lang, parsedQuery);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <MultimediaPage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
