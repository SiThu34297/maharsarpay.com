import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
// eslint-disable-next-line no-restricted-imports
import { CartPage } from "@/features/cart/components/cart-page";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type CartRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export async function generateMetadata({ params }: CartRoutePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const [dictionary, seo] = await Promise.all([
    getDictionary(lang),
    getWebsiteMetadataContent(lang),
  ]);

  return buildRouteMetadata({
    lang,
    pathname: "/cart",
    title: `${dictionary.cartPage.title} | ${seo.siteTitle}`,
    description: dictionary.cartPage.checkoutDescription,
    ogImage: seo.ogImage,
    noIndex: true,
  });
}

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
