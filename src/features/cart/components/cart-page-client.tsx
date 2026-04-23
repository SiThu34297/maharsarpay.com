"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";

import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart/context/cart-context";
import {
  activateRecaptchaContext,
  getRecaptchaToken,
  preloadRecaptcha,
} from "@/lib/security/recaptcha-v3-client";
import type { Dictionary, Locale } from "@/lib/i18n";

type CartPageClientProps = Readonly<{
  copy: Dictionary["cartPage"];
  locale: Locale;
  initialSessionUser?: Session["user"];
}>;

type ProvinceOption = {
  id: string;
  name: string;
};

type CityOption = {
  id: string;
  name: string;
  provinceId: string;
};

type TownshipOption = {
  id: string;
  name: string;
  cityId: string;
  provinceId: string;
};

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

function toBookRouteParam(cartProductId: string): string | null {
  const normalized = cartProductId.startsWith("book:") ? cartProductId.slice(5) : cartProductId;
  const [candidate] = normalized.split(":");
  const routeParam = candidate?.trim();
  return routeParam ? routeParam : null;
}

export function CartPageClient({ copy, locale, initialSessionUser }: CartPageClientProps) {
  const { state, subtotal, increment, decrement, remove, clear, totalItems } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [townshipId, setTownshipId] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [townships, setTownships] = useState<TownshipOption[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingTownships, setIsLoadingTownships] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const sessionUser = initialSessionUser;
  const isAuthenticated = Boolean(initialSessionUser?.id);

  useEffect(() => {
    setCustomerName(sessionUser?.name?.trim() || "");
    setCustomerPhone(sessionUser?.phoneNumber?.trim() || "");
    setCustomerEmail(sessionUser?.email?.trim() || "");
    setAddress(sessionUser?.address?.trim() || "");
  }, [
    isAuthenticated,
    sessionUser?.name,
    sessionUser?.phoneNumber,
    sessionUser?.email,
    sessionUser?.address,
  ]);

  useEffect(() => {
    let isMounted = true;

    async function loadProvinces() {
      setIsLoadingProvinces(true);

      try {
        const response = await fetch("/api/provinces", { method: "GET" });
        const payload = (await response.json()) as { items?: ProvinceOption[] };

        if (!response.ok || !Array.isArray(payload.items)) {
          throw new Error("Unable to load provinces.");
        }

        if (isMounted) {
          setProvinces(payload.items);
        }
      } catch {
        if (isMounted) {
          setProvinces([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProvinces(false);
        }
      }
    }

    void loadProvinces();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    setCities([]);
    setTownships([]);
    setCityId("");
    setTownshipId("");

    if (!provinceId) {
      return () => {
        isMounted = false;
      };
    }

    async function loadCities() {
      setIsLoadingCities(true);

      try {
        const response = await fetch(`/api/cities?provinceId=${encodeURIComponent(provinceId)}`, {
          method: "GET",
        });
        const payload = (await response.json()) as { items?: CityOption[] };

        if (!response.ok || !Array.isArray(payload.items)) {
          throw new Error("Unable to load cities.");
        }

        if (isMounted) {
          setCities(payload.items);
        }
      } catch {
        if (isMounted) {
          setCities([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCities(false);
        }
      }
    }

    void loadCities();

    return () => {
      isMounted = false;
    };
  }, [provinceId]);

  useEffect(() => {
    let isMounted = true;

    setTownships([]);
    setTownshipId("");

    if (!cityId) {
      return () => {
        isMounted = false;
      };
    }

    async function loadTownships() {
      setIsLoadingTownships(true);

      try {
        const params = new URLSearchParams({
          cityId,
          provinceId,
        });
        const response = await fetch(`/api/townships?${params.toString()}`, { method: "GET" });
        const payload = (await response.json()) as { items?: TownshipOption[] };

        if (!response.ok || !Array.isArray(payload.items)) {
          throw new Error("Unable to load townships.");
        }

        if (isMounted) {
          setTownships(payload.items);
        }
      } catch {
        if (isMounted) {
          setTownships([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTownships(false);
        }
      }
    }

    void loadTownships();

    return () => {
      isMounted = false;
    };
  }, [cityId, provinceId]);

  useEffect(() => {
    const canPlaceOrder = state.items.length > 0;

    if (!canPlaceOrder) {
      return;
    }

    const deactivateRecaptchaContext = activateRecaptchaContext();

    void preloadRecaptcha().catch(() => {
      // Token acquisition handles and displays the user-facing error on submit.
    });

    return deactivateRecaptchaContext;
  }, [state.items.length]);

  async function placeOrder() {
    setOrderSuccess(null);
    setOrderError(null);
    setIsPlacingOrder(true);

    let recaptchaToken = "";

    try {
      recaptchaToken = await getRecaptchaToken("place_order");
    } catch {
      setOrderError(copy.orderErrorCaptcha);
      setIsPlacingOrder(false);
      return;
    }

    try {
      const selectedProvince = provinces.find((province) => province.id === provinceId) ?? null;
      const selectedCity = cities.find((city) => city.id === cityId) ?? null;
      const selectedTownship = townships.find((township) => township.id === townshipId) ?? null;
      const items = state.items
        .map((item) => {
          const bookId = toBookRouteParam(item.cartProductId);

          if (!bookId) {
            return null;
          }

          return {
            bookId,
            qty: item.quantity,
          };
        })
        .filter((item): item is { bookId: string; qty: number } => Boolean(item));

      if (!selectedProvince || !selectedCity || !items.length) {
        setOrderError(copy.orderErrorRequiredFields);
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          province: {
            id: selectedProvince.id,
            name: selectedProvince.name,
          },
          city: {
            id: selectedCity.id,
            name: selectedCity.name,
          },
          township: selectedTownship
            ? {
                id: selectedTownship.id,
                name: selectedTownship.name,
              }
            : undefined,
          shippingAddress: address.trim(),
          note: note.trim(),
          recaptchaToken,
          items,
        }),
      });

      let payload: { message?: unknown; code?: unknown } | null = null;

      try {
        payload = (await response.json()) as { message?: unknown; code?: unknown };
      } catch {
        payload = null;
      }

      if (response.status === 401 || response.status === 403) {
        if (payload?.code === "captcha") {
          setOrderError(copy.orderErrorCaptcha);
          return;
        }

        setOrderError(copy.orderErrorFallback);
        return;
      }

      if (!response.ok) {
        if (payload?.code === "captcha") {
          setOrderError(copy.orderErrorCaptcha);
          return;
        }

        setOrderError(
          typeof payload?.message === "string" && payload.message.trim().length > 0
            ? payload.message
            : copy.orderErrorFallback,
        );
        return;
      }

      clear();
      setOrderSuccess(copy.orderSuccessMessage);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setProvinceId("");
      setCityId("");
      setTownshipId("");
      setAddress("");
      setNote("");
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
            {orderSuccess ? (
              <p className="mb-3 rounded-lg border border-[var(--color-brand)]/30 bg-[var(--color-brand-subtle)] px-3 py-2 text-sm text-[var(--color-text-main)]">
                {orderSuccess}
              </p>
            ) : null}
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            {state.items.map((item) => {
              const pricing = getDiscountPricing(item);
              const bookRouteParam = toBookRouteParam(item.cartProductId);
              const authorRouteParam = item.authorId?.trim() || "";
              const hasAuthorDetail =
                authorRouteParam.length > 0 && authorRouteParam !== "unknown-author";

              return (
                <article
                  key={item.cartProductId}
                  className="border-b border-[var(--color-border)] p-4 last:border-b-0"
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
                        {bookRouteParam ? (
                          <Link
                            href={`/${locale}/books/${encodeURIComponent(bookRouteParam)}?from=cart`}
                            className="transition hover:text-[var(--color-brand)]"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {hasAuthorDetail ? (
                          <Link
                            href={`/${locale}/authors/${encodeURIComponent(authorRouteParam)}?from=cart`}
                            className="transition hover:text-[var(--color-brand)]"
                          >
                            {item.author}
                          </Link>
                        ) : (
                          item.author
                        )}
                      </p>
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

            <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-4">
              <span className="text-sm text-[var(--color-text-muted)]">{copy.subtotalLabel}</span>
              <strong className="text-lg text-[var(--color-text-main)] md:text-xl">
                {formatPrice(locale, subtotal)}
              </strong>
            </div>
          </div>

          <aside className="rounded-2xl border border-[var(--color-border)] bg-white p-5 lg:sticky lg:top-24">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-main)]">
                {copy.checkoutTitle}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {copy.checkoutDescription}
              </p>

              <div className="mt-3 border-y border-[var(--color-border)] py-3">
                <p className="text-sm font-semibold text-[var(--color-text-main)]">
                  {copy.doorToDoorAdTitle}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-main)]">
                  {copy.doorToDoorAdContact}
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {copy.doorToDoorAdShippingNote}
                </p>
              </div>

              <form
                className="mt-4 space-y-3"
                onSubmit={async (event) => {
                  event.preventDefault();

                  if (
                    !customerName.trim() ||
                    !customerPhone.trim() ||
                    !provinceId ||
                    !cityId ||
                    !address.trim()
                  ) {
                    setOrderError(copy.orderErrorRequiredFields);
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
                    {copy.customerEmailLabel}
                  </span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.currentTarget.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                    {copy.provinceLabel}
                  </span>
                  <select
                    required
                    value={provinceId}
                    onChange={(event) => setProvinceId(event.currentTarget.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoadingProvinces}
                  >
                    <option value="">
                      {isLoadingProvinces ? copy.loadingProvincesText : copy.provincePlaceholder}
                    </option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                    {copy.cityLabel}
                  </span>
                  <select
                    required
                    value={cityId}
                    onChange={(event) => setCityId(event.currentTarget.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!provinceId || isLoadingCities}
                  >
                    <option value="">
                      {!provinceId
                        ? copy.selectProvinceFirst
                        : isLoadingCities
                          ? copy.loadingCitiesText
                          : copy.cityPlaceholder}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                    {copy.townshipLabel}
                  </span>
                  <select
                    value={townshipId}
                    onChange={(event) => setTownshipId(event.currentTarget.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus-visible:border-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!cityId || isLoadingTownships}
                  >
                    <option value="">
                      {!cityId
                        ? copy.selectCityFirst
                        : isLoadingTownships
                          ? copy.loadingTownshipsText
                          : copy.townshipPlaceholder}
                    </option>
                    {townships.map((township) => (
                      <option key={township.id} value={township.id}>
                        {township.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[var(--color-text-main)]">
                    {copy.addressLabel}
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(event) => setAddress(event.currentTarget.value)}
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
                  <p className="rounded-lg border border-[var(--color-secondary)]/25 bg-[var(--color-accent-soft)] px-3 py-2 text-xs text-[var(--color-secondary)]">
                    {orderError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-button-secondary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPlacingOrder ? copy.placingOrderButton : copy.placeOrderButton}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
