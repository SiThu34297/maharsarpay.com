import Image from "next/image";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { AsyncSubmitButton } from "@/components/ui/async-submit-button";
import { signOutAction } from "@/features/auth/server/auth-actions";
import { getBookFilterOptions } from "@/features/books";
import type { ProfilePageData } from "@/features/profile/schemas/profile";
import type { Dictionary, Locale } from "@/lib/i18n";

type ProfilePageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: ProfilePageData;
}>;

function formatProfileName(name: string): string {
  const normalized = name.trim();

  if (!normalized) {
    return name;
  }

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      const [firstChar, ...restChars] = Array.from(part);

      if (!firstChar) {
        return part;
      }

      return `${firstChar.toLocaleUpperCase()}${restChars.join("")}`;
    })
    .join(" ");
}

function formatDetailValue(value: string | null | undefined, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function getAvatarFallbackLabel(name: string): string {
  const normalized = name.trim();

  if (!normalized) {
    return "U";
  }

  const parts = normalized.split(/\s+/).filter(Boolean);
  const initials = parts
    .map((part) => Array.from(part)[0]?.toLocaleUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return initials || "U";
}

function formatDate(locale: Locale, isoDate: string | null): string {
  if (!isoDate) {
    return "-";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  if (locale === "my") {
    const numberFormatter = new Intl.NumberFormat("my-MM", { useGrouping: false });
    const day = numberFormatter.format(date.getDate());
    const month = numberFormatter.format(date.getMonth() + 1);
    const year = numberFormatter.format(date.getFullYear());

    return `${day}/${month}/${year}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function formatLocalizedNumber(locale: Locale, value: number): string {
  const numberLocale = locale === "my" ? "my-MM" : "en-US";

  return new Intl.NumberFormat(numberLocale, {
    useGrouping: false,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLocalizedAmount(locale: Locale, value: number): string {
  const numberLocale = locale === "my" ? "my-MM" : "en-US";

  return new Intl.NumberFormat(numberLocale, {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatOrderStatus(status: string, copy: Dictionary["profilePage"]): string {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes("cancel")) {
    return copy.statusCancelled;
  }

  if (
    normalized.includes("deliver") ||
    normalized.includes("ship") ||
    normalized.includes("paid")
  ) {
    return copy.statusDelivered;
  }

  if (normalized.includes("pending") || normalized.includes("process")) {
    return copy.statusPending;
  }

  return copy.statusPending;
}

function getOrderStatusClassName(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes("cancel")) {
    return "orders-editor-status-cancelled";
  }

  if (
    normalized.includes("deliver") ||
    normalized.includes("ship") ||
    normalized.includes("paid")
  ) {
    return "orders-editor-status-delivered";
  }

  if (normalized.includes("pending") || normalized.includes("process")) {
    return "orders-editor-status-pending";
  }

  return "orders-editor-status-pending";
}

function getOrderCardBorderClassName(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes("paid")) {
    return "border-emerald-200";
  }

  if (normalized.includes("process")) {
    return "border-amber-200";
  }

  if (normalized.includes("ship") || normalized.includes("deliver")) {
    return "border-sky-200";
  }

  return "border-[var(--color-border)]";
}

function getOrderHeaderSurfaceClassName(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes("paid")) {
    return "bg-gradient-to-r from-emerald-50 to-[var(--color-surface-soft)]";
  }

  if (normalized.includes("process")) {
    return "bg-gradient-to-r from-amber-50 to-[var(--color-surface-soft)]";
  }

  if (normalized.includes("ship") || normalized.includes("deliver")) {
    return "bg-gradient-to-r from-sky-50 to-[var(--color-surface-soft)]";
  }

  return "bg-gradient-to-r from-[var(--color-surface-soft)] to-white";
}

function getOrderTopBorderClassName(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes("cancel")) {
    return "bg-[#b91c1c]";
  }

  if (
    normalized.includes("deliver") ||
    normalized.includes("ship") ||
    normalized.includes("paid")
  ) {
    return "bg-[#15803d]";
  }

  return "bg-[#b45309]";
}

export async function ProfilePage({ copy, locale, data }: ProfilePageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookFilterOptions = await getBookFilterOptions(locale);
  const displayName = formatProfileName(data.profile.name);
  const details = [
    {
      label: copy.profilePage.phoneLabel,
      value: formatDetailValue(data.profile.phoneNumber, copy.profilePage.valueNotAvailable),
    },
    {
      label: copy.profilePage.addressLabel,
      value: formatDetailValue(data.profile.address, copy.profilePage.valueNotAvailable),
    },
  ];
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingTopBrandStrip
        locale={locale}
        title="မဟာစာပေ"
        message="သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့"
      />
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="profile"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="home-shell section-gap space-y-6 md:space-y-8">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)] md:p-7">
          <h1 className="text-2xl font-semibold md:text-3xl">{copy.profilePage.title}</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] md:text-base">
            {copy.profilePage.description}
          </p>

          <div className="mt-5 flex flex-col gap-4 rounded-xl bg-[var(--color-surface-soft)] p-4 md:flex-row md:items-center md:justify-between md:p-5">
            <div className="flex items-center gap-4">
              {data.profile.imageSrc ? (
                <Image
                  src={data.profile.imageSrc}
                  alt={copy.profilePage.avatarAlt}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              ) : (
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-brand-subtle)] px-2 text-center text-[10px] font-semibold leading-tight text-[var(--color-brand)]">
                  {getAvatarFallbackLabel(displayName)}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-[var(--color-text-main)]">{displayName}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{data.profile.email}</p>
              </div>
            </div>

            <form action={signOutAction}>
              <input type="hidden" name="locale" value={locale} />
              <AsyncSubmitButton
                label={copy.profilePage.logoutButton}
                className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>
          </div>

          <div className="mt-5">
            <h2 className="text-base font-semibold text-[var(--color-text-main)] md:text-lg">
              {copy.profilePage.detailsTitle}
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm text-[var(--color-text-main)]">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)] md:p-7">
          <h2 className="text-xl font-semibold md:text-2xl">{copy.profilePage.ordersTitle}</h2>

          {data.orders.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--color-text-muted)] md:text-base">
              {copy.profilePage.emptyOrders}
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.orders.map((order) => {
                const itemsCount = order.items.length;
                const totalQty = order.items.reduce((acc, item) => acc + item.quantity, 0);
                const localizedOrderItemsQtyLabel = copy.profilePage.orderItemsQtyLabel
                  .replace("{items}", formatLocalizedNumber(locale, itemsCount))
                  .replace("{qty}", formatLocalizedNumber(locale, totalQty));
                const visibleItems = order.items.slice(0, 6);
                const remainingItemsCount = Math.max(order.items.length - visibleItems.length, 0);
                const localizedStatus = formatOrderStatus(order.status, copy.profilePage);
                const statusClassName = getOrderStatusClassName(order.status);
                const cardBorderClassName = getOrderCardBorderClassName(order.status);
                const headerSurfaceClassName = getOrderHeaderSurfaceClassName(order.status);
                const topBorderClassName = getOrderTopBorderClassName(order.status);
                const placedOnDisplay = `${copy.profilePage.placedOnLabel}: ${formatDate(locale, order.placedAt)}`;
                const billToLabel = locale === "my" ? "လက်ခံသူ" : "Bill To";
                const itemsLabel = locale === "my" ? "ပစ္စည်းစာရင်း" : "Items";
                const qtyShortLabel = locale === "my" ? "အရေအတွက်" : "Qty";
                const moreItemsLabel = locale === "my" ? "ထပ်ရှိ" : "more";
                const authorByLabel = locale === "my" ? "စာရေးသူ" : "by";
                const authorListSeparator = locale === "my" ? "၊ " : ", ";

                return (
                  <li
                    key={order.id}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-soft)] ${cardBorderClassName}`}
                  >
                    <div
                      className={`relative border-b border-[var(--color-border)] px-4 py-4 md:px-5 ${headerSurfaceClassName}`}
                    >
                      <span className={`absolute inset-x-0 top-0 h-[3px] ${topBorderClassName}`} />

                      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-xs font-medium text-[var(--color-text-muted)]">
                            {placedOnDisplay}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-[var(--color-text-main)] md:text-xl">
                            #{order.orderNumber}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                          <span
                            className={`orders-editor-status inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName}`}
                          >
                            {localizedStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.35fr)_minmax(250px,1fr)] md:p-5">
                      <div className="space-y-4">
                        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                          <div className="p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              {billToLabel}
                            </p>

                            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                              <div>
                                <dt className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                  {copy.profilePage.customerNameLabel}
                                </dt>
                                <dd className="mt-0.5 text-sm text-[var(--color-text-main)]">
                                  {formatDetailValue(
                                    order.customerName,
                                    copy.profilePage.valueNotAvailable,
                                  )}
                                </dd>
                              </div>

                              <div>
                                <dt className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                  {copy.profilePage.customerPhoneLabel}
                                </dt>
                                <dd className="mt-0.5 text-sm text-[var(--color-text-main)]">
                                  {formatDetailValue(
                                    order.customerPhone,
                                    copy.profilePage.valueNotAvailable,
                                  )}
                                </dd>
                              </div>

                              <div className="sm:col-span-2">
                                <dt className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                  {copy.profilePage.shippingAddressLabel}
                                </dt>
                                <dd className="mt-0.5 text-sm text-[var(--color-text-main)]">
                                  {formatDetailValue(
                                    order.shippingAddress,
                                    copy.profilePage.valueNotAvailable,
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="border-t border-dashed border-[var(--color-border)] bg-white/85">
                            <div className="grid grid-cols-[minmax(0,1fr)_110px] border-b border-[var(--color-border)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                              <p>{itemsLabel}</p>
                              <p className="text-right">{qtyShortLabel}</p>
                            </div>

                            {visibleItems.length > 0 ? (
                              <ul className="divide-y divide-[var(--color-border)]">
                                {visibleItems.map((item) => (
                                  <li
                                    key={item.id}
                                    className="grid grid-cols-[minmax(0,1fr)_110px] items-center gap-3 px-3 py-2.5"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm text-[var(--color-text-main)]">
                                        {item.title}
                                      </p>
                                      {item.authors.length > 0 ? (
                                        <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                                          {authorByLabel}:{" "}
                                          {item.authors
                                            .map((author) => author.name)
                                            .join(authorListSeparator)}
                                        </p>
                                      ) : null}
                                    </div>
                                    <p className="text-right text-sm font-semibold text-[var(--color-text-main)]">
                                      {formatLocalizedNumber(locale, item.quantity)}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="px-3 py-3 text-sm text-[var(--color-text-muted)]">
                                {copy.profilePage.valueNotAvailable}
                              </p>
                            )}

                            <div className="border-t border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                              {localizedOrderItemsQtyLabel}
                              {remainingItemsCount > 0 ? (
                                <span className="ml-1 font-semibold text-[var(--color-brand)]">
                                  (+{formatLocalizedNumber(locale, remainingItemsCount)}{" "}
                                  {moreItemsLabel})
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-brand-subtle)] via-white to-white p-3 md:p-4">
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center justify-between gap-3 text-[var(--color-text-muted)]">
                            <span>{copy.profilePage.subtotalLabel}</span>
                            <span>
                              {formatLocalizedAmount(locale, order.subtotalAmount)}{" "}
                              {copy.profilePage.currencyLabel}
                            </span>
                          </p>

                          <p className="flex items-center justify-between gap-3 text-amber-700">
                            <span>{copy.profilePage.deliveryFeeLabel}</span>
                            <span>
                              {formatLocalizedAmount(locale, order.deliveryFee)}{" "}
                              {copy.profilePage.currencyLabel}
                            </span>
                          </p>

                          <p className="flex items-center justify-between gap-3 text-rose-700">
                            <span>{copy.profilePage.discountLabel}</span>
                            <span>
                              {formatLocalizedAmount(locale, order.discountAmount)}{" "}
                              {copy.profilePage.currencyLabel}
                            </span>
                          </p>

                          <div className="my-2 border-t border-dashed border-[var(--color-border)]" />

                          <p className="flex items-center justify-between gap-3 py-1 text-sm font-semibold text-[var(--color-brand)]">
                            <span>{copy.profilePage.totalLabel}</span>
                            <span>
                              {formatLocalizedAmount(locale, order.totalAmount)}{" "}
                              {copy.profilePage.currencyLabel}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
