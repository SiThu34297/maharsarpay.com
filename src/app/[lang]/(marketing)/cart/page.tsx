import { notFound } from "next/navigation";

import { auth } from "@/auth";
// eslint-disable-next-line no-restricted-imports
import { CartPage } from "@/features/cart/components/cart-page";
import { getDictionary, hasLocale } from "@/lib/i18n";

type CartRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export default async function CartRoutePage({ params }: CartRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, session] = await Promise.all([getDictionary(lang), auth()]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <CartPage copy={dictionary} locale={lang} sessionUser={session?.user} />
      </main>
    </div>
  );
}
