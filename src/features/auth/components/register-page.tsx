import Link from "next/link";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { AsyncSubmitButton } from "@/components/ui/async-submit-button";
import { RecaptchaServerActionForm } from "@/components/ui/recaptcha-server-action-form";
import { registerWithCredentialsAction } from "@/features/auth/server/auth-actions";
import type { AuthRegisterErrorCode } from "@/features/auth/schemas/auth";
import { getBookFilterOptions } from "@/features/books";
import type { Dictionary, Locale } from "@/lib/i18n";

type RegisterPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  callbackPath: string;
  loginPath: string;
  errorCode?: AuthRegisterErrorCode;
}>;

function getErrorMessage(
  copy: Dictionary["registerPage"],
  errorCode?: AuthRegisterErrorCode,
): string | null {
  if (!errorCode) {
    return null;
  }

  switch (errorCode) {
    case "email_in_use":
      return copy.errorEmailInUse;
    case "missing":
      return copy.errorMissingFields;
    case "captcha":
      return copy.errorCaptcha;
    case "unknown":
      return copy.errorUnknown;
    default:
      return null;
  }
}

export async function RegisterPage({
  copy,
  locale,
  callbackPath,
  loginPath,
  errorCode,
}: RegisterPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookFilterOptions = await getBookFilterOptions(locale);
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const errorMessage = getErrorMessage(copy.registerPage, errorCode);

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="profile"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="home-shell section-gap">
        <section className="mx-auto w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
          <h1 className="text-2xl font-semibold md:text-3xl">{copy.registerPage.title}</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] md:text-base">
            {copy.registerPage.description}
          </p>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          ) : null}

          <RecaptchaServerActionForm
            action={registerWithCredentialsAction}
            recaptchaAction="register"
            className="mt-6 space-y-4"
            captchaErrorMessage={copy.registerPage.errorCaptcha}
          >
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="callbackUrl" value={callbackPath} />

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--color-text-main)]">
                {copy.registerPage.nameLabel}
              </span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                placeholder="Maharsarpay"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--color-text-main)]">
                {copy.registerPage.emailLabel}
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                placeholder="reader@maharsarpay.com"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--color-text-main)]">
                {copy.registerPage.phoneLabel}
              </span>
              <input
                type="tel"
                name="phoneNumber"
                required
                autoComplete="tel"
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                placeholder="09xxxxxxxxx"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--color-text-main)]">
                {copy.registerPage.addressLabel}
              </span>
              <textarea
                name="address"
                required
                autoComplete="street-address"
                rows={3}
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                placeholder="Yangon, Myanmar"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--color-text-main)]">
                {copy.registerPage.passwordLabel}
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                placeholder="••••••••"
              />
            </label>

            <AsyncSubmitButton
              label={copy.registerPage.submitButton}
              className="w-full rounded-full bg-[var(--color-button-secondary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-button-secondary)] disabled:cursor-not-allowed disabled:opacity-70"
            />
          </RecaptchaServerActionForm>

          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            {copy.registerPage.loginPrompt}{" "}
            <Link
              href={loginPath}
              className="font-semibold text-[var(--color-brand)] transition hover:brightness-95"
            >
              {copy.registerPage.loginLink}
            </Link>
          </p>
        </section>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
