"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { isGoogleProviderEnabled, signIn, signOut } from "@/auth";
import { registerWithEmail } from "@/features/auth/server/web-auth-adapter";
import {
  getSafeRedirectPath,
  buildLoginRedirectPath,
  buildRegisterRedirectPath,
} from "@/lib/auth/redirect";
import { defaultLocale, hasLocale } from "@/lib/i18n";

type LoginErrorCode = "credentials" | "missing" | "google" | "unknown";
type RegisterErrorCode = "missing" | "email_in_use" | "unknown";

function resolveLocale(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return defaultLocale;
  }

  return hasLocale(value) ? value : defaultLocale;
}

function resolveCallbackPath(formData: FormData, locale: string): string {
  const nextValue = formData.get("callbackUrl");
  const fallbackPath = `/${locale}/profile`;

  return getSafeRedirectPath(typeof nextValue === "string" ? nextValue : null, fallbackPath);
}

function redirectToLogin(locale: string, nextPath: string, errorCode: LoginErrorCode) {
  redirect(buildLoginRedirectPath(locale, nextPath, errorCode));
}

function redirectToRegister(locale: string, nextPath: string, errorCode: RegisterErrorCode) {
  redirect(buildRegisterRedirectPath(locale, nextPath, errorCode));
}

export async function signInWithGoogleAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));
  const callbackPath = resolveCallbackPath(formData, locale);

  if (!isGoogleProviderEnabled) {
    redirectToLogin(locale, callbackPath, "google");
  }

  await signIn("google", { redirectTo: callbackPath });
}

export async function signInWithCredentialsAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));
  const callbackPath = resolveCallbackPath(formData, locale);
  const emailField = formData.get("email");
  const passwordField = formData.get("password");
  const email = typeof emailField === "string" ? emailField.trim() : "";
  const password = typeof passwordField === "string" ? passwordField : "";

  if (!email || !password) {
    redirectToLogin(locale, callbackPath, "missing");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackPath,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        redirectToLogin(locale, callbackPath, "credentials");
      }

      redirectToLogin(locale, callbackPath, "unknown");
    }

    throw error;
  }
}

export async function registerWithCredentialsAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));
  const callbackPath = resolveCallbackPath(formData, locale);

  const emailField = formData.get("email");
  const passwordField = formData.get("password");
  const nameField = formData.get("name");
  const phoneNumberField = formData.get("phoneNumber");
  const addressField = formData.get("address");

  const email = typeof emailField === "string" ? emailField.trim() : "";
  const password = typeof passwordField === "string" ? passwordField : "";
  const name = typeof nameField === "string" ? nameField.trim() : "";
  const phoneNumber = typeof phoneNumberField === "string" ? phoneNumberField.trim() : "";
  const address = typeof addressField === "string" ? addressField.trim() : "";

  if (!email || !password || !name || !phoneNumber || !address) {
    redirectToRegister(locale, callbackPath, "missing");
  }

  const registerResult = await registerWithEmail({
    email,
    password,
    name,
    phoneNumber,
    address,
  });

  if (!registerResult.ok) {
    if (registerResult.code === "email_in_use") {
      redirectToRegister(locale, callbackPath, "email_in_use");
    }

    if (registerResult.code === "missing_fields") {
      redirectToRegister(locale, callbackPath, "missing");
    }

    redirectToRegister(locale, callbackPath, "unknown");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackPath,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirectToRegister(locale, callbackPath, "unknown");
    }

    throw error;
  }
}

export async function signOutAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));

  await signOut({ redirectTo: `/${locale}` });
}
