import { notFound } from "next/navigation";

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

  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <CartPage copy={dictionary} locale={lang} />
      </main>
    </div>
  );
}
