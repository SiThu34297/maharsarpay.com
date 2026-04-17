"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";

import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart/context/cart-context";
import type { Dictionary, Locale } from "@/lib/i18n";

type CartPageClientProps = Readonly<{
  copy: Dictionary["cartPage"];
  locale: Locale;
  initialSessionUser?: Session["user"];
}>;

function groupDigits(value: number) {
  return String(value).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toMyanmarDigits(value: string) {
  return value.replaceAll(/\d/g, (digit) => String.fromCodePoint(0x1040 + Number(digit)));
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

export function CartPageClient({ copy, locale, initialSessionUser }: CartPageClientProps) {
  const { state, subtotal, increment, decrement, remove, clear, totalItems } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const loginNextPath = `/${locale}/cart`;
  const loginPath = `/${locale}/login?next=${encodeURIComponent(loginNextPath)}`;
  const sessionUser = initialSessionUser;
  const isAuthenticated = Boolean(initialSessionUser?.id);

  useEffect(() => {
    if (!isAuthenticated) {
      setCustomerName("");
      setCustomerPhone("");
      setShippingAddress("");
      setOrderError(null);
      return;
    }

    setCustomerName(sessionUser?.name?.trim() || "");
    setCustomerPhone(sessionUser?.phoneNumber?.trim() || "");
    setShippingAddress(sessionUser?.address?.trim() || "");
  }, [isAuthenticated, sessionUser?.name, sessionUser?.phoneNumber, sessionUser?.address]);

  async function placeOrder() {
    if (!isAuthenticated) {
      router.push(loginPath);
      return;
    }

    setOrderError(null);
    setIsPlacingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          shippingAddress,
          note,
          items: state.items.map((item) => ({
            cartProductId: item.cartProductId,
            qty: item.quantity,
          })),
        }),
      });

      let payload: { message?: unknown } | null = null;

      try {
        payload = (await response.json()) as { message?: unknown };
      } catch {
        payload = null;
      }

      if (response.status === 401 || response.status === 403) {
        if (isAuthenticated) {
          setOrderError(copy.orderErrorFallback);
        } else {
          router.push(loginPath);
        }

        return;
      }

      if (!response.ok) {
        setOrderError(
          typeof payload?.message === "string" && payload.message.trim().length > 0
            ? payload.message
            : copy.orderErrorFallback,
        );
        return;
      }

      clear();
      router.push(`/${locale}/profile?order=placed`);
    } catch {
      setOrderError(copy.orderErrorFallback);
    } finally {
      setIsPlacingOrder(false);
    }
  }

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

            <div className="mt-5 border-t border-[var(--color-border)] pt-5">
              <h2 className="text-base font-semibold text-[var(--color-text-main)]">
                {copy.checkoutTitle}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {copy.checkoutDescription}
              </p>

              <div className="mt-3 rounded-xl border border-[var(--color-brand)] bg-[var(--color-brand-subtle)] p-3">
                <p className="text-sm font-semibold text-[var(--color-brand)]">
                  {copy.doorToDoorAdTitle}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-main)]">
                  {copy.doorToDoorAdContact}
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {copy.doorToDoorAdShippingNote}
                </p>
              </div>

              {isAuthenticated ? (
                <form
                  className="mt-4 space-y-3"
                  onSubmit={async (event) => {
                    event.preventDefault();

                    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
                      setOrderError(copy.orderErrorFallback);
                      return;
                    }

                    await placeOrder();
                  }}
                >
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                      {copy.customerNameLabel}
                    </span>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(event) => setCustomerName(event.currentTarget.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                      {copy.customerPhoneLabel}
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.currentTarget.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                      {copy.shippingAddressLabel}
                    </span>
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(event) => setShippingAddress(event.currentTarget.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                      {copy.noteLabel}
                    </span>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(event) => setNote(event.currentTarget.value)}
                      placeholder={copy.notePlaceholder}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                    />
                  </label>

                  {orderError ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {orderError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPlacingOrder ? copy.placingOrderButton : copy.placeOrderButton}
                  </button>
                </form>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {copy.loginRequiredMessage}
                  </p>
                  <Link
                    href={loginPath}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                  >
                    {copy.loginToOrderButton}
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
