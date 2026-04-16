"use client";

import Image from "next/image";
import Link from "next/link";

import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart/context/cart-context";
import type { Dictionary, Locale } from "@/lib/i18n";

type CartPageClientProps = Readonly<{
  copy: Dictionary["cartPage"];
  locale: Locale;
}>;

function groupDigits(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toMyanmarDigits(value: string) {
  return value.replace(/\d/g, (digit) => String.fromCharCode(0x1040 + Number(digit)));
}

function formatPrice(locale: Locale, value: number) {
  const grouped = groupDigits(Math.round(value));

  if (locale === "my") {
    return `${toMyanmarDigits(grouped)} ကျပ်`;
  }

  return `MMK ${grouped}`;
}

function replaceCount(template: string, count: number, locale: Locale) {
  const groupedCount = groupDigits(count);
  const localizedCount = locale === "my" ? toMyanmarDigits(groupedCount) : groupedCount;
  return template.replace("{count}", localizedCount);
}

function getDiscountPricing(item: {
  price: number;
  salePrice?: number | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
}) {
  const salePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
  const originalPrice =
    item.originalPrice && item.originalPrice > salePrice ? item.originalPrice : null;

  if (!originalPrice) {
    return {
      salePrice,
      originalPrice: null,
      discountAmount: null,
    };
  }

  return {
    salePrice,
    originalPrice,
    discountAmount: item.discountAmount ?? originalPrice - salePrice,
  };
}

export function CartPageClient({ copy, locale }: CartPageClientProps) {
  const { state, subtotal, increment, decrement, remove, clear, totalItems } = useCart();

  if (state.items.length === 0) {
    return (
      <section className="section-gap">
        <div className="home-shell">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{copy.title}</h1>
          </div>

          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
            <h2 className="text-xl text-[var(--color-text-main)]">{copy.emptyTitle}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{copy.emptyDescription}</p>
            <Link
              href={`/${locale}/books`}
              className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            >
              {copy.continueShopping}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gap">
      <div className="home-shell">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
          <div>
            <h1 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{copy.title}</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {replaceCount(copy.itemCount, totalItems, locale)}
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            onClick={clear}
          >
            {copy.clearCart}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-4">
            {state.items.map((item) => {
              const pricing = getDiscountPricing(item);

              return (
                <article
                  key={item.cartProductId}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-[140px] w-[108px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.coverImageSrc}
                        alt={item.coverImageAlt}
                        fill
                        sizes="108px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-semibold text-[var(--color-text-main)] md:text-lg">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.author}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--color-brand)] md:text-base">
                          {formatPrice(locale, pricing.salePrice)}
                        </p>
                        {pricing.originalPrice ? (
                          <>
                            <p className="text-xs text-[var(--color-text-muted)] line-through">
                              {formatPrice(locale, pricing.originalPrice)}
                            </p>
                            <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-accent)]">
                              -{formatPrice(locale, pricing.discountAmount ?? 0)}
                            </span>
                          </>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-2 py-1">
                          <button
                            type="button"
                            aria-label={
                              item.quantity === 1 ? copy.removeItem : copy.decreaseQuantity
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[var(--color-brand-subtle)]"
                            onClick={() => decrement(item.cartProductId)}
                          >
                            {item.quantity === 1 ? <TrashIcon /> : <MinusIcon />}
                          </button>

                          <span className="min-w-10 text-center text-sm font-semibold text-[var(--color-text-main)]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={copy.increaseQuantity}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-main)] transition hover:bg-[var(--color-brand-subtle)]"
                            onClick={() => increment(item.cartProductId)}
                          >
                            <PlusIcon />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-accent)]"
                          onClick={() => remove(item.cartProductId)}
                        >
                          <TrashIcon />
                          <span>{copy.removeItem}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-[var(--color-border)] bg-white p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--color-text-muted)]">{copy.subtotalLabel}</span>
              <strong className="text-lg text-[var(--color-text-main)] md:text-xl">
                {formatPrice(locale, subtotal)}
              </strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
