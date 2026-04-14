"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ChevronDownIcon, Cross2Icon, HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";

import type { NavItem } from "@/features/home/schemas/home";
import type { Dictionary } from "@/lib/i18n";

type HomePageMobileHeaderProps = Readonly<{
  copy: Dictionary;
  navigation: NavItem[];
}>;

function getNavigationLabel(copy: Dictionary["navigation"], id: NavItem["id"]) {
  switch (id) {
    case "home":
      return copy.home;
    case "books":
      return copy.books;
    case "authors":
      return copy.authors;
    case "categories":
      return copy.categories;
    case "media":
      return copy.media;
    case "contact":
      return copy.contact;
    default:
      return copy.home;
  }
}

export function HomePageMobileHeader({ copy, navigation }: HomePageMobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const mobileMenuId = "home-mobile-navigation";
  const booksCategoriesMenuId = "mobile-books-categories";
  const categoriesItem = navigation.find((item) => item.id === "categories");
  const primaryNavigation = navigation.filter((item) => item.id !== "categories");

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(min-width: 768px)");

    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
        setIsBooksDropdownOpen(false);
      }
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", closeMenuOnDesktop);
    } else {
      mediaQueryList.addListener(closeMenuOnDesktop);
    }

    return () => {
      if (typeof mediaQueryList.removeEventListener === "function") {
        mediaQueryList.removeEventListener("change", closeMenuOnDesktop);
      } else {
        mediaQueryList.removeListener(closeMenuOnDesktop);
      }
    };
  }, []);

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
        setIsBooksDropdownOpen(false);
      }

      return nextValue;
    });
  }

  function closeAllMenus() {
    setIsMenuOpen(false);
    setIsBooksDropdownOpen(false);
  }

  return (
    <div className="relative z-[80] md:hidden">
      <div className="home-shell flex h-[72px] items-center justify-between">
        <button
          type="button"
          className="icon-button touch-manipulation"
          aria-label={copy.header.menuLabel}
          aria-expanded={isMenuOpen}
          aria-controls={mobileMenuId}
          onClick={handleMenuToggle}
        >
          {isMenuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
        </button>

        <div aria-hidden className="h-10 w-10" />

        <button type="button" className="icon-button" aria-label={copy.header.accountLabel}>
          <PersonIcon />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden border-t border-[var(--color-border)] bg-white">
          <nav
            id={mobileMenuId}
            aria-label={copy.header.desktopNavigationLabel}
            className="home-shell py-3"
          >
            <ul className="space-y-1.5">
              {primaryNavigation.map((item) => {
                const isActive = item.id === "home";

                if (item.id === "books" && categoriesItem) {
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
                          aria-label={getNavigationLabel(copy.navigation, categoriesItem.id)}
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
                        <div className="overflow-hidden">
                          <Link
                            href={categoriesItem.href}
                            className="ml-3 block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]"
                            onClick={closeAllMenus}
                          >
                            {getNavigationLabel(copy.navigation, categoriesItem.id)}
                          </Link>
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
