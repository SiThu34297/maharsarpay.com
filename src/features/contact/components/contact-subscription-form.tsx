"use client";

import { useEffect, useState } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";
import {
  activateRecaptchaContext,
  getRecaptchaToken,
  preloadRecaptcha,
} from "@/lib/security/recaptcha-v3-client";

type ContactSubscriptionFormProps = Readonly<{
  copy: Dictionary["contactPage"];
  locale: Locale;
}>;

type SubscriptionResponse = {
  error?: unknown;
  message?: unknown;
};

export function ContactSubscriptionForm({ copy, locale }: ContactSubscriptionFormProps) {
  const [authors, setAuthors] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const deactivateRecaptchaContext = activateRecaptchaContext();

    void preloadRecaptcha().catch(() => {
      // Token acquisition handles and displays the user-facing error on submit.
    });

    return deactivateRecaptchaContext;
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!authors.trim() || !phone.trim()) {
      setError(copy.requiredFieldsError);
      return;
    }

    setIsSubmitting(true);

    let recaptchaToken = "";

    try {
      recaptchaToken = await getRecaptchaToken("subscribe");
    } catch {
      setError(copy.unknownError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authors: authors.trim(),
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          recaptchaToken,
          lang: locale,
        }),
      });

      let payload: SubscriptionResponse | null = null;

      try {
        payload = (await response.json()) as SubscriptionResponse;
      } catch {
        payload = null;
      }

      if (!response.ok || payload?.error) {
        const message =
          typeof payload?.message === "string" && payload.message.trim().length > 0
            ? payload.message
            : copy.unknownError;
        setError(message);
        return;
      }

      setSuccess(copy.successMessage);
      setAuthors("");
      setName("");
      setPhone("");
      setAddress("");
    } catch {
      setError(copy.unknownError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="contact-surface">
      <h2 className="text-2xl md:text-3xl">{copy.subscriptionTitle}</h2>
      <p className="mt-3 text-base text-[var(--color-text-muted)] md:text-lg">
        {copy.subscriptionDescription}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text-main)]">
            {copy.authorsLabel} *
          </span>
          <textarea
            value={authors}
            onChange={(event) => setAuthors(event.target.value)}
            required
            rows={4}
            placeholder={copy.authorsPlaceholder}
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text-main)]">
            {copy.nameLabel}
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={copy.namePlaceholder}
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text-main)]">
            {copy.phoneLabel} *
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            placeholder={copy.phonePlaceholder}
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text-main)]">
            {copy.addressLabel}
          </span>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={copy.addressPlaceholder}
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand)]"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-full bg-[var(--color-brand)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? copy.submittingButton : copy.submitButton}
        </button>
      </form>
    </article>
  );
}
