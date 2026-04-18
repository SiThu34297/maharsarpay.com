"use client";

type GrecaptchaClient = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaClient;
  }
}

const RECAPTCHA_SCRIPT_ID = "recaptcha-v3-script";
const RECAPTCHA_READY_TIMEOUT_MS = 10000;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

let scriptLoadPromise: Promise<void> | null = null;
let activeRecaptchaContexts = 0;
let badgeObserver: MutationObserver | null = null;

export function isRecaptchaConfigured() {
  return RECAPTCHA_SITE_KEY.length > 0;
}

function setBadgeVisibility(visible: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  const badges = document.querySelectorAll<HTMLElement>(".grecaptcha-badge");

  for (const badge of badges) {
    badge.style.visibility = visible ? "visible" : "hidden";
    badge.style.opacity = visible ? "1" : "0";
    badge.style.pointerEvents = visible ? "auto" : "none";
  }
}

function ensureBadgeObserver() {
  if (typeof window === "undefined" || badgeObserver || !document.body) {
    return;
  }

  badgeObserver = new MutationObserver(() => {
    setBadgeVisibility(activeRecaptchaContexts > 0);
  });

  badgeObserver.observe(document.body, { childList: true, subtree: true });
}

function stopBadgeObserver() {
  if (!badgeObserver) {
    return;
  }

  badgeObserver.disconnect();
  badgeObserver = null;
}

export function activateRecaptchaContext() {
  if (typeof window === "undefined") {
    return () => {};
  }

  activeRecaptchaContexts += 1;
  ensureBadgeObserver();
  setBadgeVisibility(true);

  return () => {
    activeRecaptchaContexts = Math.max(0, activeRecaptchaContexts - 1);

    if (activeRecaptchaContexts === 0) {
      setBadgeVisibility(false);
      stopBadgeObserver();
    }
  };
}

function loadRecaptchaScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is unavailable on the server."));
  }

  if (!isRecaptchaConfigured()) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY."));
  }

  if (window.grecaptcha?.execute) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(RECAPTCHA_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA script.")), {
      once: true,
    });

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function waitForGrecaptchaReady(): Promise<GrecaptchaClient> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is unavailable on the server."));
  }

  return new Promise((resolve, reject) => {
    const deadline = Date.now() + RECAPTCHA_READY_TIMEOUT_MS;

    const poll = () => {
      const client = window.grecaptcha;

      if (client?.ready) {
        client.ready(() => resolve(client));
        return;
      }

      if (Date.now() >= deadline) {
        reject(new Error("Timed out while waiting for reCAPTCHA."));
        return;
      }

      window.setTimeout(poll, 50);
    };

    poll();
  });
}

export async function preloadRecaptcha() {
  if (!isRecaptchaConfigured()) {
    throw new Error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY.");
  }

  await loadRecaptchaScript();
  await waitForGrecaptchaReady();
  setBadgeVisibility(activeRecaptchaContexts > 0);
}

export async function getRecaptchaToken(action: "login" | "register" | "place_order") {
  if (!isRecaptchaConfigured()) {
    throw new Error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY.");
  }

  await preloadRecaptcha();
  const recaptcha = window.grecaptcha;

  if (!recaptcha) {
    throw new Error("reCAPTCHA client is unavailable.");
  }

  const token = await recaptcha.execute(RECAPTCHA_SITE_KEY, { action });

  if (!token || token.trim().length === 0) {
    throw new Error("reCAPTCHA token is empty.");
  }

  return token;
}
