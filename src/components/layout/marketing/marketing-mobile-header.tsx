"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ChevronDownIcon,
  Cross2Icon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  MobileIcon,
} from "@radix-ui/react-icons";

import type { Dictionary, Locale } from "@/lib/i18n";

import { MarketingCartIconLink } from "./marketing-cart-icon-link";
import { getNavigationLabel, type MarketingNavId, type MarketingNavItem } from "./navigation";

type BookCategoryLink = {
  label: string;
  href: string;
};

type MarketingMobileHeaderProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  navigation: MarketingNavItem[];
  activeNavId: MarketingNavId;
  bookCategoryLinks: BookCategoryLink[];
  logoSrc: string;
}>;

export function MarketingMobileHeader({
  copy,
  locale,
  navigation,
  activeNavId,
  bookCategoryLinks,
  logoSrc,
}: MarketingMobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(activeNavId === "books");
  const mobileMenuId = "marketing-mobile-navigation";
  const booksCategoriesMenuId = "marketing-mobile-books-categories";
  const categoriesItem = navigation.find((item) => item.id === "categories");
  const primaryNavigation = navigation.filter((item) => item.id !== "categories");
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

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(min-width: 768px)");

    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
        setIsBooksDropdownOpen(activeNavId === "books");
      }
    };

    mediaQueryList.addEventListener("change", closeMenuOnDesktop);

    return () => {
      mediaQueryList.removeEventListener("change", closeMenuOnDesktop);
    };
  }, [activeNavId]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function handleMenuToggle() {
    setIsMenuOpen((currentValue) => {
      const nextValue = !currentValue;

      if (!nextValue) {
        setIsBooksDropdownOpen(activeNavId === "books");
      }

      return nextValue;
    });
  }

  function closeAllMenus() {
    setIsMenuOpen(false);
    setIsBooksDropdownOpen(activeNavId === "books");
  }

  const searchPlaceholder = locale === "my" ? "ရှာဖွေရန်..." : "I'm looking for..";
  const hotlinePhoneNumber = "95 9 45062 3383";

  return (
    <div className="lg:hidden">
      <div className="bg-[#f1f3f5]">
        <div className="home-shell flex h-9 items-center justify-between text-xs text-[#5f6368] md:h-10 md:text-sm">
          <p className="truncate">{copy.header.slogan}</p>
          <Link href={`/${locale}/privacy-policy`} prefetch={false} className="hover:underline">
            Policy
          </Link>
        </div>
      </div>

      <div className="bg-white">
        <div className="home-shell flex h-[72px] items-center justify-between md:h-[78px]">
          <button
            type="button"
            className="icon-button"
            aria-label={copy.header.menuLabel}
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
          </button>

          <Link
            href={`/${locale}`}
            className="inline-flex items-center"
            aria-label={copy.header.logo}
          >
            <Image
              src={logoSrc}
              alt={copy.header.logo}
              width={180}
              height={78}
              className="h-9 w-auto object-contain md:h-11"
              priority
            />
          </Link>

          <MarketingCartIconLink locale={locale} ariaLabel={copy.header.cartLabel} />
        </div>

        <div className="home-shell pb-3 md:pb-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--color-text-main)] md:mb-3">
            <MobileIcon className="h-4 w-4 text-[#5f6368] md:h-5 md:w-5" />
            <p className="text-sm leading-none md:text-base">
              Hotline <span className="font-semibold">{hotlinePhoneNumber}</span>
            </p>
          </div>

          <form
            action={`/${locale}/books`}
            method="get"
            className="grid grid-cols-[1fr_auto] overflow-hidden rounded-sm border border-[#d9dde2] bg-white"
          >
            <input
              type="search"
              name="q"
              aria-label={copy.header.searchLabel}
              placeholder={searchPlaceholder}
              className="h-10 px-3 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[#8c9096] md:h-11 md:px-4"
            />
            <button
              type="submit"
              className="inline-flex h-10 min-w-[94px] items-center justify-center gap-1 bg-[var(--color-brandColor)] px-3 text-sm font-semibold text-white transition hover:brightness-95 md:h-11 md:min-w-[110px]"
            >
              <MagnifyingGlassIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden bg-[var(--color-brandColor)]">
          <nav
            id={mobileMenuId}
            aria-label={copy.header.desktopNavigationLabel}
            className="home-shell max-h-[calc(100svh-72px)] overflow-y-auto overscroll-contain py-3"
          >
            <ul className="space-y-1.5">
              {primaryNavigation.map((item) => {
                const isActive = item.id === activeNavId;

                if (item.id === "books" && effectiveBookCategoryLinks.length > 0) {
                  return (
                    <li key={`mobile-${item.id}`}>
                      <div className="flex items-center gap-2">
                        <Link
                          href={item.href}
                          prefetch={false}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex-1 rounded-lg px-3 py-2.5 text-base transition ${
                            isActive
                              ? "bg-white/15 font-semibold text-white"
                              : "text-white/95 hover:bg-white/10 hover:text-white"
                          }`}
                          onClick={closeAllMenus}
                        >
                          {getNavigationLabel(copy.navigation, item.id)}
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/40 text-white transition hover:border-white hover:text-white"
                          aria-expanded={isBooksDropdownOpen}
                          aria-controls={booksCategoriesMenuId}
                          aria-label={getNavigationLabel(
                            copy.navigation,
                            categoriesItem?.id ?? "categories",
                          )}
                          onClick={() => setIsBooksDropdownOpen((currentValue) => !currentValue)}
                        >
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform ${
                              isBooksDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <div
                        id={booksCategoriesMenuId}
                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                          isBooksDropdownOpen
                            ? "mt-1.5 grid-rows-[1fr] opacity-100"
                            : "pointer-events-none grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="ml-4 overflow-hidden">
                          <ul className="max-h-56 space-y-0 overflow-y-auto pr-1">
                            {effectiveBookCategoryLinks.map((categoryLink) => (
                              <li key={`mobile-book-category-${categoryLink.href}`}>
                                <Link
                                  href={categoryLink.href}
                                  prefetch={false}
                                  className="block rounded-md px-2 py-0.5 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
                                  onClick={closeAllMenus}
                                >
                                  {categoryLink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={`mobile-${item.id}`}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2.5 text-base transition ${
                        isActive
                          ? "bg-white/15 font-semibold text-white"
                          : "text-white/95 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={closeAllMenus}
                    >
                      {getNavigationLabel(copy.navigation, item.id)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
