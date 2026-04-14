import Link from "next/link";

import { GlobeIcon, InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

import type { Dictionary } from "@/lib/i18n";

import { getNavigationLabel, type MarketingNavItem } from "./navigation";

type MarketingSiteFooterProps = Readonly<{
  copy: Dictionary;
  navigation: MarketingNavItem[];
}>;

export function MarketingSiteFooter({ copy, navigation }: MarketingSiteFooterProps) {
  return (
    <footer id="contact" className="border-t border-[var(--color-border)] bg-white">
      <div className="home-shell py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold">{copy.header.logo}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {copy.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold">{copy.footer.navigationTitle}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={`footer-nav-${item.id}`}>
                  <Link href={item.href} className="footer-link">
                    {getNavigationLabel(copy.navigation, item.id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold">{copy.footer.supportTitle}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="footer-link">
                  {copy.footer.supportFaq}
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  {copy.footer.supportHelp}
                </Link>
              </li>
              <li>
                <Link
                  href={navigation.find((item) => item.id === "contact")?.href ?? "#contact"}
                  className="footer-link"
                >
                  {copy.footer.supportContact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold">{copy.footer.contactTitle}</h4>
            <div className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
              <p>{copy.footer.address}</p>
              <p>{copy.footer.phone}</p>
              <p>{copy.footer.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-[var(--color-border)] pt-6 md:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--color-text-main)]">
              {copy.footer.newsletterLabel}
            </p>
            <form
              className="flex max-w-md flex-wrap gap-2"
              action="#"
              method="post"
              suppressHydrationWarning
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {copy.footer.newsletterLabel}
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={copy.footer.newsletterPlaceholder}
                className="min-w-[220px] flex-1 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
              >
                {copy.footer.newsletterButton}
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-muted)]">
              {copy.footer.socialLabel}
            </span>
            <Link href="#" className="icon-button" aria-label="Global">
              <GlobeIcon />
            </Link>
            <Link href="#" className="icon-button" aria-label="Instagram">
              <InstagramLogoIcon />
            </Link>
            <Link href="#" className="icon-button" aria-label="LinkedIn">
              <LinkedInLogoIcon />
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-[var(--color-text-muted)]">{copy.footer.rights}</p>
      </div>
    </footer>
  );
}
