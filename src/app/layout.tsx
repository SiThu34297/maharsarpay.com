import type { Metadata } from "next";

import "@radix-ui/themes/styles.css";

import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { siteConfig } from "@/lib/constants/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
