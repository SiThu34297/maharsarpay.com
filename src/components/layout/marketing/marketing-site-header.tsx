import Link from "next/link";

import { PersonIcon } from "@radix-ui/react-icons";

import { CartFloatingButton } from "@/features/cart";
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

export function MarketingSiteHeader({
  copy,
  locale,
  navigation,
  activeNavId,
  bookCategoryLinks = [],
}: MarketingSiteHeaderProps) {
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
        <div className="home-shell hidden h-20 items-center gap-8 xl:grid xl:grid-cols-[1fr_auto_1fr]">
          <div aria-hidden />

          <nav aria-label={copy.header.desktopNavigationLabel}>
            <ul className="flex items-center justify-center gap-5 lg:gap-7">
              {primaryNavigation.map((item) => {
                const isActive = item.id === activeNavId;

                if (item.id === "books" && effectiveBookCategoryLinks.length > 0) {
                  return (
                    <li key={item.id} className="group relative">
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                      >
                        {getNavigationLabel(copy.navigation, item.id)}
                      </Link>
                      <div className="pointer-events-none absolute left-0 top-full z-40 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="min-w-[220px] rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-2 shadow-[var(--shadow-soft)]">
                          {effectiveBookCategoryLinks.map((categoryLink) => (
                            <Link
                              key={`desktop-book-category-${categoryLink.href}`}
                              href={categoryLink.href}
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

          <div className="flex items-center justify-end gap-2 lg:gap-3">
            <Link
              href={`/${locale}/profile`}
              className="icon-button"
              aria-label={copy.header.accountLabel}
            >
              <PersonIcon />
            </Link>
          </div>
        </div>

        <div className="home-shell hidden items-center gap-3 py-3 md:flex xl:hidden">
          <nav
            aria-label={copy.header.desktopNavigationLabel}
            className="min-w-0 flex-1 whitespace-nowrap"
          >
            <ul className="flex w-max items-center gap-5 pr-2">
              {primaryNavigation.map((item) => {
                const isActive = item.id === activeNavId;

                if (item.id === "books" && effectiveBookCategoryLinks.length > 0) {
                  return (
                    <li key={`tablet-${item.id}`} className="group relative">
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                      >
                        {getNavigationLabel(copy.navigation, item.id)}
                      </Link>
                      <div className="pointer-events-none absolute left-0 top-full z-40 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="min-w-[220px] rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-2 shadow-[var(--shadow-soft)]">
                          {effectiveBookCategoryLinks.map((categoryLink) => (
                            <Link
                              key={`tablet-book-category-${categoryLink.href}`}
                              href={categoryLink.href}
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
                  <li key={`tablet-${item.id}`}>
                    <Link
                      href={item.href}
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

          <Link
            href={`/${locale}/profile`}
            className="icon-button shrink-0"
            aria-label={copy.header.accountLabel}
          >
            <PersonIcon />
          </Link>
        </div>

        <MarketingMobileHeader
          copy={copy}
          locale={locale}
          navigation={navigation}
          activeNavId={activeNavId}
          bookCategoryLinks={effectiveBookCategoryLinks}
        />
      </header>
      <CartFloatingButton locale={locale} ariaLabel={copy.header.cartLabel} />
    </>
  );
}
