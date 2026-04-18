import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { AsyncSubmitButton } from "@/components/ui/async-submit-button";
import { RecaptchaServerActionForm } from "@/components/ui/recaptcha-server-action-form";
import Link from "next/link";
import {
  signInWithCredentialsAction,
  signInWithGoogleAction,
} from "@/features/auth/server/auth-actions";
import type { AuthLoginErrorCode } from "@/features/auth/schemas/auth";
import { getBookFilterOptions } from "@/features/books";
import type { Dictionary, Locale } from "@/lib/i18n";

type LoginPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  callbackPath: string;
  registerPath: string;
  errorCode?: AuthLoginErrorCode;
  isGoogleEnabled: boolean;
}>;

function getErrorMessage(
  copy: Dictionary["loginPage"],
  errorCode?: AuthLoginErrorCode,
): string | null {
  if (!errorCode) {
    return null;
  }

  switch (errorCode) {
    case "credentials":
      return copy.errorCredentials;
    case "missing":
      return copy.errorMissingFields;
    case "captcha":
      return copy.errorCaptcha;
    case "google":
      return copy.errorGoogleUnavailable;
    case "unknown":
      return copy.errorUnknown;
    default:
      return null;
  }
}

export async function LoginPage({
  copy,
  locale,
  callbackPath,
  registerPath,
  errorCode,
  isGoogleEnabled,
}: LoginPageProps) {
  const isMyanmar = locale === "my";
  // Temporary switch to hide Google sign-in from the login UI.
  const isGoogleSignInTemporarilyDisabled = true;
  const canShowGoogleSignIn = isGoogleEnabled && !isGoogleSignInTemporarilyDisabled;
  const navigation = getMarketingNavigation(locale);
  const bookFilterOptions = await getBookFilterOptions(locale);
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const errorMessage = getErrorMessage(copy.loginPage, errorCode);

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

      <main className="home-shell section-gap">
        <section className="mx-auto w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
          <h1 className="text-2xl font-semibold md:text-3xl">{copy.loginPage.title}</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] md:text-base">
            {copy.loginPage.description}
          </p>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          ) : null}

          {canShowGoogleSignIn ? (
            <>
              <form action={signInWithGoogleAction} className="mt-6">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="callbackUrl" value={callbackPath} />
                <AsyncSubmitButton
                  label={copy.loginPage.googleButton}
                  className="w-full rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!isGoogleEnabled}
                />
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {copy.loginPage.orSeparator}
                </span>
                <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
              </div>
            </>
          ) : null}

          <RecaptchaServerActionForm
            action={signInWithCredentialsAction}
            recaptchaAction="login"
            className="space-y-4"
            captchaErrorMessage={copy.loginPage.errorCaptcha}
          >
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="callbackUrl" value={callbackPath} />

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--color-text-main)]">
                {copy.loginPage.emailLabel}
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
                {copy.loginPage.passwordLabel}
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                placeholder="••••••••"
              />
            </label>

            <AsyncSubmitButton
              label={copy.loginPage.credentialsButton}
              className="w-full rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-70"
            />
          </RecaptchaServerActionForm>

          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            {copy.loginPage.registerPrompt}{" "}
            <Link
              href={registerPath}
              className="font-semibold text-[var(--color-brand)] transition hover:brightness-95"
            >
              {copy.loginPage.registerLink}
            </Link>
          </p>
        </section>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
