import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "@radix-ui/themes/styles.css";

import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { getWebsiteMetadataContent } from "@/features/page-info";
import { siteConfig } from "@/lib/constants/site";
import { defaultLocale } from "@/lib/i18n";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const metadataContent = await getWebsiteMetadataContent(defaultLocale);

  return {
    title: metadataContent.siteTitle || siteConfig.title,
    description: metadataContent.siteDescription || siteConfig.description,
    openGraph: metadataContent.ogImage
      ? {
          images: [{ url: metadataContent.ogImage }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
