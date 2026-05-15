"use client";

import Link from "next/link";

import { BackpackIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart";
import type { Locale } from "@/lib/i18n";

type MarketingCartIconLinkProps = Readonly<{
  locale: Locale;
  ariaLabel: string;
}>;

export function MarketingCartIconLink({ locale, ariaLabel }: MarketingCartIconLinkProps) {
  const { totalItems } = useCart();

  return (
    <Link
      href={`/${locale}/cart`}
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center text-[#4f545b]"
    >
      <BackpackIcon className="h-6 w-6" />
      {totalItems > 0 ? (
        <span className="absolute -bottom-1 -right-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-brandColor)] px-1 text-xs font-semibold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}
