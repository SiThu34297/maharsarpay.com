import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { ProfilePage, getProfilePageData } from "@/features/profile";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

type ProfileRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
}>;

export async function generateMetadata({ params }: ProfileRoutePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const [dictionary, metadataContent] = await Promise.all([
    getDictionary(lang),
    getWebsiteMetadataContent(lang),
  ]);

  return buildRouteMetadata({
    lang,
    pathname: "/profile",
    title: `${dictionary.profilePage.metaTitle} | ${metadataContent.siteTitle}`,
    description: dictionary.profilePage.metaDescription,
    ogImage: metadataContent.ogImage,
    noIndex: true,
  });
}

export default async function ProfileRoutePage({ params }: ProfileRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const session = await auth();

  if (!session?.user?.email) {
    const profilePath = `/${lang}/profile`;
    redirect(`/${lang}/login?next=${encodeURIComponent(profilePath)}`);
  }

  const [dictionary, data] = await Promise.all([
    getDictionary(lang),
    getProfilePageData(lang, session.user),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <ProfilePage copy={dictionary} locale={lang} data={data} />
      </main>
    </div>
  );
}
