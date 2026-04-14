import { notFound } from "next/navigation";

import { HomePage } from "@/features/home";
import { getDictionary, hasLocale } from "@/lib/i18n";

type MarketingHomePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export default async function MarketingHomePage({ params }: MarketingHomePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <HomePage copy={dictionary} locale={lang} />
      </main>
    </div>
  );
}
