import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth, isGoogleProviderEnabled } from "@/auth";
import { LoginPage, parseAuthLoginErrorCode } from "@/features/auth";
import { siteConfig } from "@/lib/constants/site";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { getDictionary, hasLocale } from "@/lib/i18n";

type LoginRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function readStringParam(input: string | string[] | undefined): string | undefined {
  return typeof input === "string" ? input : undefined;
}

export async function generateMetadata({ params }: LoginRoutePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.loginPage.metaTitle} | ${siteConfig.title}`,
    description: dictionary.loginPage.metaDescription,
  };
}

export default async function LoginRoutePage({ params, searchParams }: LoginRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const paramsObject = await searchParams;
  const callbackPath = getSafeRedirectPath(readStringParam(paramsObject.next), `/${lang}/profile`);
  const errorCode = parseAuthLoginErrorCode(readStringParam(paramsObject.error));
  const session = await auth();

  if (session?.user?.email) {
    redirect(callbackPath);
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <LoginPage
          copy={dictionary}
          locale={lang}
          callbackPath={callbackPath}
          errorCode={errorCode}
          isGoogleEnabled={isGoogleProviderEnabled}
        />
      </main>
    </div>
  );
}
