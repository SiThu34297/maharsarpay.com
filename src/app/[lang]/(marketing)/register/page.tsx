import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { parseAuthRegisterErrorCode, RegisterPage } from "@/features/auth";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { buildLoginRedirectPath, getSafeRedirectPath } from "@/lib/auth/redirect";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary, hasLocale } from "@/lib/i18n";

type RegisterRoutePageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function readStringParam(input: string | string[] | undefined): string | undefined {
  return typeof input === "string" ? input : undefined;
}

export async function generateMetadata({ params }: RegisterRoutePageProps): Promise<Metadata> {
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
    title: `${dictionary.registerPage.metaTitle} | ${metadataContent.siteTitle}`,
    description: dictionary.registerPage.metaDescription,
    openGraph: metadataContent.ogImage
      ? {
          images: [{ url: metadataContent.ogImage }],
        }
      : undefined,
  };
}

export default async function RegisterRoutePage({ params, searchParams }: RegisterRoutePageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const paramsObject = await searchParams;
  const callbackPath = getSafeRedirectPath(readStringParam(paramsObject.next), `/${lang}/profile`);
  const loginPath = buildLoginRedirectPath(lang, callbackPath);
  const errorCode = parseAuthRegisterErrorCode(readStringParam(paramsObject.error));
  const session = await auth();

  if (session?.user?.email) {
    redirect(callbackPath);
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col" lang={lang}>
        <RegisterPage
          copy={dictionary}
          locale={lang}
          callbackPath={callbackPath}
          loginPath={loginPath}
          errorCode={errorCode}
        />
      </main>
    </div>
  );
}
