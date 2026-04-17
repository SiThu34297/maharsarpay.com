import Image from "next/image";
import Link from "next/link";

import { PersonIcon } from "@radix-ui/react-icons";

import { auth } from "@/auth";
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

type AccountButtonState = {
  isLoggedIn: boolean;
  imageSrc: string | null;
  initials: string;
};

function toOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const initials = parts
      .map((part) => Array.from(part)[0]?.toLocaleUpperCase() ?? "")
      .join("")
      .slice(0, 2);

    if (initials) {
      return initials;
    }
  }

  if (email) {
    const firstChar = Array.from(email)[0]?.toLocaleUpperCase();
    if (firstChar) {
      return firstChar;
    }
  }

  return "U";
}

export async function MarketingSiteHeader({
  copy,
  locale,
  navigation,
  activeNavId,
  bookCategoryLinks = [],
}: MarketingSiteHeaderProps) {
  const profilePath = `/${locale}/profile`;
  const loginWithNextPath = `/${locale}/login?next=${encodeURIComponent(profilePath)}`;
  const session = await auth();
  const accountState: AccountButtonState = {
    isLoggedIn: Boolean(session?.user?.id),
    imageSrc: toOptionalString(session?.user?.image),
    initials: getInitials(
      toOptionalString(session?.user?.name),
      toOptionalString(session?.user?.email),
    ),
  };
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
  const accountHref = accountState.isLoggedIn ? profilePath : loginWithNextPath;

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
                        prefetch={false}
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

          <div className="flex items-center justify-end gap-2 lg:gap-3">
            <Link href={accountHref} className="icon-button" aria-label={copy.header.accountLabel}>
              {accountState.isLoggedIn ? (
                accountState.imageSrc ? (
                  <Image
                    src={accountState.imageSrc}
                    alt={copy.header.accountLabel}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-xs font-semibold text-[var(--color-brand)]">
                    {accountState.initials}
                  </span>
                )
              ) : (
                <PersonIcon />
              )}
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
                        prefetch={false}
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
                  <li key={`tablet-${item.id}`}>
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

          <Link
            href={accountHref}
            className="icon-button shrink-0"
            aria-label={copy.header.accountLabel}
          >
            {accountState.isLoggedIn ? (
              accountState.imageSrc ? (
                <Image
                  src={accountState.imageSrc}
                  alt={copy.header.accountLabel}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-xs font-semibold text-[var(--color-brand)]">
                  {accountState.initials}
                </span>
              )
            ) : (
              <PersonIcon />
            )}
          </Link>
        </div>

        <MarketingMobileHeader
          copy={copy}
          locale={locale}
          navigation={navigation}
          activeNavId={activeNavId}
          bookCategoryLinks={effectiveBookCategoryLinks}
          accountState={accountState}
        />
      </header>
      <CartFloatingButton locale={locale} ariaLabel={copy.header.cartLabel} />
    </>
  );
}
