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
import type { ProfileOrderStatus, ProfilePageData } from "@/features/profile/schemas/profile";
import type { Dictionary, Locale } from "@/lib/i18n";

type ProfilePageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: ProfilePageData;
}>;

function getStatusLabel(copy: Dictionary["profilePage"], status: ProfileOrderStatus): string {
  switch (status) {
    case "paid":
      return copy.statusPaid;
    case "processing":
      return copy.statusProcessing;
    case "shipped":
      return copy.statusShipped;
    default:
      return copy.statusProcessing;
  }
}

function formatDate(locale: Locale, isoDate: string): string {
  const date = new Date(isoDate);
  const formatLocale = locale === "my" ? "my-MM" : "en-US";

  return new Intl.DateTimeFormat(formatLocale, {
    dateStyle: "medium",
  }).format(date);
}

export async function ProfilePage({ copy, locale, data }: ProfilePageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookFilterOptions = await getBookFilterOptions(locale);
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
              <Image
                src={data.profile.imageSrc}
                alt={copy.profilePage.avatarAlt}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold text-[var(--color-text-main)]">
                  {data.profile.name}
                </p>
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
                const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

                return (
                  <li
                    key={order.id}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm font-semibold text-[var(--color-text-main)]">
                        {copy.profilePage.orderNumberLabel}: {order.orderNumber}
                      </p>
                      <span className="inline-flex w-fit rounded-full bg-[var(--color-brand-subtle)] px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">
                        {getStatusLabel(copy.profilePage, order.status)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      {copy.profilePage.placedOnLabel}: {formatDate(locale, order.placedAt)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {copy.profilePage.itemCountLabel.replace("{count}", String(itemCount))}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
                      {copy.profilePage.totalLabel}: {order.totalAmount.toLocaleString()}{" "}
                      {copy.profilePage.currencyLabel}
                    </p>
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
