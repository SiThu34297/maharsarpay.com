"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ChevronDownIcon, Cross2Icon, HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";

import type { Dictionary, Locale } from "@/lib/i18n";

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
}>;

export function MarketingMobileHeader({
  copy,
  locale,
  navigation,
  activeNavId,
  bookCategoryLinks,
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

  return (
    <div className="md:hidden">
      <div className="home-shell flex h-[72px] items-center justify-between">
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

        <div aria-hidden className="h-10 w-10" />

        <Link
          href={`/${locale}/profile`}
          className="icon-button"
          aria-label={copy.header.accountLabel}
        >
          <PersonIcon />
        </Link>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-card-bg)]">
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
                          aria-current={isActive ? "page" : undefined}
                          className={`flex-1 rounded-lg px-3 py-2.5 text-base transition ${
                            isActive
                              ? "bg-[var(--color-brand-soft)] font-semibold text-[var(--color-brand-strong)]"
                              : "text-[var(--color-text-main)] hover:bg-[var(--color-surface-soft)]"
                          }`}
                          onClick={closeAllMenus}
                        >
                          {getNavigationLabel(copy.navigation, item.id)}
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
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
                          <ul className="max-h-56 space-y-1 overflow-y-auto pr-1">
                            {effectiveBookCategoryLinks.map((categoryLink) => (
                              <li key={`mobile-book-category-${categoryLink.href}`}>
                                <Link
                                  href={categoryLink.href}
                                  className="block rounded-md px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]"
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
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2.5 text-base transition ${
                        isActive
                          ? "bg-[var(--color-brand-soft)] font-semibold text-[var(--color-brand-strong)]"
                          : "text-[var(--color-text-main)] hover:bg-[var(--color-surface-soft)]"
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
