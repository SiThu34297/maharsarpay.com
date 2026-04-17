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
              {navigation
                .filter((item) => item.id !== "categories")
                .map((item) => (
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

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-(--color-border) pt-6 text-xs md:mt-12">
          <p className="text-(--color-text-muted)">{copy.footer.rights}</p>

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
      </div>
    </footer>
  );
}
