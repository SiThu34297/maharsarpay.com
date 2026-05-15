import Image from "next/image";
import Link from "next/link";
import { MobileIcon } from "@radix-ui/react-icons";
import { getWebsiteBranding, getWebsitePageInfo } from "@/features/page-info";
import type { Dictionary, Locale } from "@/lib/i18n";

import { MarketingCartIconLink } from "./marketing-cart-icon-link";
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
  const [branding, pageInfo] = await Promise.all([
    getWebsiteBranding(locale),
    getWebsitePageInfo(locale),
  ]);
  const topStripDescription = pageInfo.description || branding.message || copy.header.slogan;
  const hotlinePhoneNumber = pageInfo.contact.primaryPhone || "95 9 45062 3383";
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
      <header className="bg-white">
        <div className="hidden bg-[#f1f3f5] lg:block">
          <div className="home-shell flex h-10 items-center justify-between px-2 text-sm text-[#5f6368]">
            <p className="truncate">{topStripDescription}</p>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/privacy-policy`} prefetch={false} className="hover:underline">
                Policy
              </Link>
              <span className="h-4 w-px bg-[#c9ccd1]" />
              <Link href={`/${locale}/contact`} prefetch={false} className="hover:underline">
                Store Location
              </Link>
            </div>
          </div>
        </div>
        <div className="home-shell hidden h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-8 lg:grid">
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
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          <form
            action={`/${locale}/books`}
            method="get"
            className="grid w-full max-w-[680px] grid-cols-[1fr_auto] justify-self-center overflow-hidden rounded-sm border border-[#d9dde2] bg-white"
          >
            <input
              type="search"
              name="q"
              aria-label={copy.header.searchLabel}
              placeholder={locale === "my" ? "ရှာဖွေရန်..." : "I'm looking for.."}
              className="h-11 px-4 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[#8c9096]"
            />
            <button
              type="submit"
              className="h-11 min-w-[110px] bg-[var(--color-brandColor)] px-4 text-base font-semibold text-white transition hover:brightness-95"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-7">
            <div className="flex items-center gap-3 text-[var(--color-text-main)]">
              <MobileIcon className="h-7 w-7 text-[#5f6368]" />
              <div className="leading-none">
                <p className="text-sm text-[#6f747c]">Hotline</p>
                <p className="text-[1rem] font-semibold tracking-[0.01em]">{hotlinePhoneNumber}</p>
              </div>
            </div>

            <MarketingCartIconLink locale={locale} ariaLabel={copy.header.cartLabel} />
          </div>
        </div>

        <div className="hidden bg-[var(--color-brandColor)] lg:block">
          <nav aria-label={copy.header.desktopNavigationLabel} className="home-shell">
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
                        className="relative inline-flex py-5 text-lg font-semibold text-white/95 transition hover:text-white"
                      >
                        {getNavigationLabel(copy.navigation, item.id)}
                      </Link>
                      <div className="pointer-events-none absolute left-0 top-full z-40 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="min-w-[280px] rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-1 shadow-[var(--shadow-soft)]">
                          {effectiveBookCategoryLinks.map((categoryLink) => (
                            <Link
                              key={`desktop-book-category-${categoryLink.href}`}
                              href={categoryLink.href}
                              prefetch={false}
                              className="block rounded-lg px-2 py-1 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]"
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
                      className="relative inline-flex py-5 text-lg font-semibold text-white/95 transition hover:text-white"
                    >
                      {getNavigationLabel(copy.navigation, item.id)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
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
    </>
  );
}
