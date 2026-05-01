import Image from "next/image";
import Link from "next/link";
import { CartFloatingButton } from "@/features/cart";
import { getWebsiteBranding } from "@/features/page-info";
import type { Dictionary, Locale } from "@/lib/i18n";

import { MarketingMobileHeader } from "./marketing-mobile-header";
import { getNavigationLabel, type MarketingNavId, type MarketingNavItem } from "./navigation";

type BookCategoryLink = {
  label: string;
  href: string;
};

type MarketingSiteHeaderProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  navigation: MarketingNavItem[];
  activeNavId: MarketingNavId;
  bookCategoryLinks?: BookCategoryLink[];
}>;

export async function MarketingSiteHeader({
  copy,
  locale,
  navigation,
  activeNavId,
  bookCategoryLinks = [],
}: MarketingSiteHeaderProps) {
  const homePath = `/${locale}`;
  const branding = await getWebsiteBranding(locale);
  const categoriesItem = navigation.find((item) => item.id === "categories");
  const effectiveBookCategoryLinks =
    bookCategoryLinks.length > 0
      ? bookCategoryLinks
      : categoriesItem
        ? [
            {
              label: getNavigationLabel(copy.navigation, categoriesItem.id),
              href: categoriesItem.href,
            },
          ]
        : [];
  const primaryNavigation = navigation.filter((item) => item.id !== "categories");
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-card-bg)]/95 backdrop-blur-md">
        <div className="home-shell hidden h-20 items-center gap-6 md:grid md:grid-cols-[auto_1fr_auto]">
          <Link
            href={homePath}
            className="inline-flex shrink-0 items-center"
            aria-label={copy.header.logo}
          >
            <Image
              src={branding.logoSrc}
              alt={copy.header.logo}
              width={220}
              height={96}
              className="h-11 w-auto object-contain lg:h-12"
              priority
            />
          </Link>

          <nav aria-label={copy.header.desktopNavigationLabel} className="min-w-0 flex-1">
            <ul className="flex items-center justify-start gap-5 overflow-visible lg:justify-center lg:gap-7">
              {primaryNavigation.map((item) => {
                const isActive = item.id === activeNavId;

                if (item.id === "books" && effectiveBookCategoryLinks.length > 0) {
                  return (
                    <li key={item.id} className="group relative">
                      <Link
                        href={item.href}
                        prefetch={false}
                        aria-current={isActive ? "page" : undefined}
                        className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                      >
                        {getNavigationLabel(copy.navigation, item.id)}
                      </Link>
                      <div className="pointer-events-none absolute left-0 top-full z-40 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="min-w-[280px] rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-2 shadow-[var(--shadow-soft)]">
                          {effectiveBookCategoryLinks.map((categoryLink) => (
                            <Link
                              key={`desktop-book-category-${categoryLink.href}`}
                              href={categoryLink.href}
                              prefetch={false}
                              className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]"
                            >
                              {categoryLink.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                    >
                      {getNavigationLabel(copy.navigation, item.id)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-3">
            <Link
              href={`/${locale}/subscribe`}
              className="inline-flex items-center rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {copy.header.subscribeLabel}
            </Link>
          </div>
        </div>

        <MarketingMobileHeader
          copy={copy}
          locale={locale}
          navigation={navigation}
          activeNavId={activeNavId}
          bookCategoryLinks={effectiveBookCategoryLinks}
          logoSrc={branding.logoSrc}
        />
      </header>
      <CartFloatingButton locale={locale} ariaLabel={copy.header.cartLabel} />
    </>
  );
}
