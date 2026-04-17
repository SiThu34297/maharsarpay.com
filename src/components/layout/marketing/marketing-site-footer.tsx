import Link from "next/link";

import {
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  GlobeIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  PaperPlaneIcon,
  PlayIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

import type { WebsiteSocialLink } from "@/features/page-info";
import { getWebsiteFooterContent } from "@/features/page-info";
import { defaultLocale, hasLocale, type Dictionary, type Locale } from "@/lib/i18n";

import { getNavigationLabel, type MarketingNavItem } from "./navigation";

type MarketingSiteFooterProps = Readonly<{
  copy: Dictionary;
  navigation: MarketingNavItem[];
}>;

function resolveLocaleFromNavigation(navigation: MarketingNavItem[]): Locale {
  const homeHref = navigation.find((item) => item.id === "home")?.href;

  if (!homeHref) {
    return defaultLocale;
  }

  const segment = homeHref.split("/").find(Boolean);

  return segment && hasLocale(segment) ? segment : defaultLocale;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function getSocialIcon(link: WebsiteSocialLink) {
  switch (link.platform) {
    case "website":
      return <GlobeIcon />;
    case "instagram":
      return <InstagramLogoIcon />;
    case "twitter":
      return <TwitterLogoIcon />;
    case "linkedin":
      return <LinkedInLogoIcon />;
    case "youtube":
      return <PlayIcon />;
    case "messenger":
      return <ChatBubbleIcon />;
    case "telegram":
      return <PaperPlaneIcon />;
    case "email":
      return <EnvelopeClosedIcon />;
    case "facebook":
      return <span className="text-xs font-semibold">f</span>;
    case "tiktok":
      return <span className="text-xs font-semibold">t</span>;
    default:
      return <GlobeIcon />;
  }
}

export async function MarketingSiteFooter({ copy, navigation }: MarketingSiteFooterProps) {
  const locale = resolveLocaleFromNavigation(navigation);
  const footerContent = await getWebsiteFooterContent(locale);
  const privacyPolicyHref = `/${locale}/privacy-policy`;

  return (
    <footer id="contact" className="border-t border-(--color-border) bg-white">
      <div className="home-shell py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold">{copy.header.logo}</h3>
            <p className="mt-4 text-sm leading-relaxed text-(--color-text-muted)">
              {footerContent.description}
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
                <Link href={privacyPolicyHref} className="footer-link">
                  {copy.footer.supportPrivacy}
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
            <div className="mt-4 space-y-2 text-sm text-(--color-text-muted)">
              <p>{footerContent.address}</p>
              <p>{footerContent.primaryPhone}</p>
              {footerContent.secondaryPhone ? <p>{footerContent.secondaryPhone}</p> : null}
              <p>{footerContent.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-(--color-border) pt-6 md:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">
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
                className="min-w-55 flex-1 rounded-full border border-(--color-border) bg-white px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-(--color-text-muted) focus-visible:border-(--color-brand)"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="rounded-full bg-(--color-brand) px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand)"
              >
                {copy.footer.newsletterButton}
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-(--color-text-muted)">{copy.footer.socialLabel}</span>
            {footerContent.socialLinks.map((socialLink) => (
              <Link
                key={`footer-social-${socialLink.id}`}
                href={socialLink.href}
                className="icon-button"
                aria-label={socialLink.label}
                target={isExternalHref(socialLink.href) ? "_blank" : undefined}
                rel={isExternalHref(socialLink.href) ? "noreferrer" : undefined}
              >
                {getSocialIcon(socialLink)}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-(--color-text-muted)">{copy.footer.rights}</p>
      </div>
    </footer>
  );
}
