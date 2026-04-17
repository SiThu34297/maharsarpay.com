import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth, isGoogleProviderEnabled } from "@/auth";
import { LoginPage, parseAuthLoginErrorCode } from "@/features/auth";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { buildRegisterRedirectPath, getSafeRedirectPath } from "@/lib/auth/redirect";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { buildRouteMetadata } from "@/lib/seo/route-metadata";

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

  const [dictionary, metadataContent] = await Promise.all([
    getDictionary(lang),
    getWebsiteMetadataContent(lang),
  ]);

  return {
    ...buildRouteMetadata({
      lang,
      pathname: "/login",
      title: `${dictionary.loginPage.metaTitle} | ${metadataContent.siteTitle}`,
      description: dictionary.loginPage.metaDescription,
      ogImage: metadataContent.ogImage,
      noIndex: true,
    }),
  };
}

export default async function LoginRoutePage({ params, searchParams }: LoginRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const paramsObject = await searchParams;
  const callbackPath = getSafeRedirectPath(readStringParam(paramsObject.next), `/${lang}/profile`);
  const registerPath = buildRegisterRedirectPath(lang, callbackPath);
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
          registerPath={registerPath}
          errorCode={errorCode}
          isGoogleEnabled={isGoogleProviderEnabled}
        />
      </main>
    </div>
  );
}
