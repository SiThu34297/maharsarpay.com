"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";

import {
  activateRecaptchaContext,
  getRecaptchaToken,
  preloadRecaptcha,
} from "@/lib/security/recaptcha-v3-client";

type RecaptchaAction = "login" | "register";

type RecaptchaServerActionFormProps = Readonly<{
  action: (formData: FormData) => void | Promise<void>;
  recaptchaAction: RecaptchaAction;
  className?: string;
  captchaErrorMessage: string;
  children: ReactNode;
}>;

export function RecaptchaServerActionForm({
  action,
  recaptchaAction,
  className,
  captchaErrorMessage,
  children,
}: RecaptchaServerActionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const isProgrammaticSubmitRef = useRef(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  useEffect(() => {
    const deactivateRecaptchaContext = activateRecaptchaContext();

    void preloadRecaptcha().catch(() => {
      // Token acquisition handles and displays the user-facing error on submit.
    });

    return deactivateRecaptchaContext;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (isProgrammaticSubmitRef.current) {
      isProgrammaticSubmitRef.current = false;
      return;
    }

    event.preventDefault();
    setCaptchaError(null);

    try {
      const token = await getRecaptchaToken(recaptchaAction);

      if (!tokenInputRef.current) {
        throw new Error("Missing reCAPTCHA token input.");
      }

      tokenInputRef.current.value = token;
      isProgrammaticSubmitRef.current = true;
      formRef.current?.requestSubmit();
    } catch {
      setCaptchaError(captchaErrorMessage);
    }
  };

  return (
    <form
      ref={formRef}
      action={action}
      className={className}
      onSubmit={(event) => void handleSubmit(event)}
    >
      <input ref={tokenInputRef} type="hidden" name="recaptchaToken" value="" />
      {children}
      {captchaError ? (
        <p
          role="alert"
          className="rounded-lg border border-[var(--color-secondary)]/25 bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-secondary)]"
        >
          {captchaError}
        </p>
      ) : null}
    </form>
  );
}
