"use client";

import Link from "next/link";

import { BackpackIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart/context/cart-context";
import type { Locale } from "@/lib/i18n";

type CartFloatingButtonProps = Readonly<{
  locale: Locale;
  ariaLabel: string;
}>;

export function CartFloatingButton({ locale, ariaLabel }: CartFloatingButtonProps) {
  const { totalItems } = useCart();

  return (
    <Link
      href={`/${locale}/cart`}
      aria-label={ariaLabel}
      className="fixed bottom-6 right-5 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-[0_10px_24px_rgba(122,172,35,0.4)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] md:right-7"
    >
      <BackpackIcon />
      {totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[1.2rem] items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}
