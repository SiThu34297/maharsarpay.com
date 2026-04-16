import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProfilePage, getProfilePageData } from "@/features/profile";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";

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

  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.profilePage.metaTitle} | ${siteConfig.title}`,
    description: dictionary.profilePage.metaDescription,
  };
}

export default async function ProfileRoutePage({ params }: ProfileRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/${lang}/login?next=${encodeURIComponent(`/${lang}/profile`)}`);
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
