import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "@radix-ui/themes/styles.css";

import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { defaultLocale } from "@/lib/i18n";
import "@/styles/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const metadataContent = await getWebsiteMetadataContent(defaultLocale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: metadataContent.siteTitle || siteConfig.title,
    description: metadataContent.siteDescription || siteConfig.description,
    openGraph: {
      siteName: metadataContent.siteTitle || siteConfig.title,
      type: "website",
      images: metadataContent.ogImage ? [{ url: metadataContent.ogImage }] : undefined,
    },
    twitter: {
      card: metadataContent.ogImage ? "summary_large_image" : "summary",
      title: metadataContent.siteTitle || siteConfig.title,
      description: metadataContent.siteDescription || siteConfig.description,
      images: metadataContent.ogImage ? [metadataContent.ogImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`h-full antialiased ${roboto.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
