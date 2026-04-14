"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Cross2Icon, HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";

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
  const mobileMenuId = "home-mobile-navigation";

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(min-width: 768px)");

    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    mediaQueryList.addEventListener("change", closeMenuOnDesktop);

    return () => {
      mediaQueryList.removeEventListener("change", closeMenuOnDesktop);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className="md:hidden">
      <div className="home-shell flex h-[72px] items-center justify-between">
        <button
          type="button"
          className="icon-button"
          aria-label={copy.header.menuLabel}
          aria-expanded={isMenuOpen}
          aria-controls={mobileMenuId}
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
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
              {navigation.map((item) => {
                const isActive = item.id === "home";

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
                      onClick={() => setIsMenuOpen(false)}
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
