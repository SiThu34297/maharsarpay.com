import Image from "next/image";
import Link from "next/link";

import {
  EnvelopeClosedIcon,
  GlobeIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { getBookFilterOptions } from "@/features/books";
import type { ContactPageData, ContactSocialIcon } from "@/features/contact/schemas/contact";
import type { Dictionary, Locale } from "@/lib/i18n";

type ContactPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: ContactPageData;
}>;

function getSocialIcon(icon: ContactSocialIcon) {
  switch (icon) {
    case "globe":
      return <GlobeIcon aria-hidden />;
    case "instagram":
      return <InstagramLogoIcon aria-hidden />;
    case "linkedin":
      return <LinkedInLogoIcon aria-hidden />;
    case "email":
      return <EnvelopeClosedIcon aria-hidden />;
    default:
      return <GlobeIcon aria-hidden />;
  }
}

export async function ContactPage({ copy, locale, data }: ContactPageProps) {
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
        title="မဟာစာပေ"
        message="သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့"
      />
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="contact"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main className="home-shell section-gap space-y-8 md:space-y-10">
        <section className="contact-hero">
          <Image
            src={data.cover.imageSrc}
            alt={data.cover.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover"
          />
          <div className="contact-hero-overlay" />

          <div className="contact-hero-content">
            <span className="contact-hero-badge">{copy.contactPage.heroBadge}</span>
            <h1 className="mt-4 text-4xl text-white md:text-5xl">{copy.contactPage.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
              {copy.contactPage.description}
            </p>
            <div className="mt-6 inline-flex h-24 w-24 overflow-hidden rounded-full border-2 border-white/90 shadow-[0_12px_24px_rgba(16,24,32,0.35)] md:h-28 md:w-28">
              <Image
                src={data.profile.imageSrc}
                alt={data.profile.imageAlt}
                width={180}
                height={180}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="contact-surface">
            <h2 className="text-2xl md:text-3xl">{copy.contactPage.websiteTitleLabel}</h2>
            <p className="mt-4 text-xl font-semibold text-[var(--color-brand)] md:text-2xl">
              {data.websiteTitle}
            </p>

            <h3 className="mt-8 text-xl md:text-2xl">{copy.contactPage.websiteDescriptionLabel}</h3>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
              {data.websiteDescription}
            </p>
          </article>

          <article className="contact-surface">
            <h2 className="text-2xl md:text-3xl">{copy.contactPage.socialTitle}</h2>
            <p className="mt-3 text-base text-[var(--color-text-muted)] md:text-lg">
              {copy.contactPage.socialDescription}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.socialLinks.map((socialLink) => (
                <li key={socialLink.id}>
                  <Link
                    href={socialLink.href}
                    className="contact-social-link"
                    target={socialLink.href.startsWith("http") ? "_blank" : undefined}
                    rel={socialLink.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span className="contact-social-icon">{getSocialIcon(socialLink.icon)}</span>
                    <span>
                      <span className="block text-sm font-semibold text-[var(--color-text-main)]">
                        {socialLink.label}
                      </span>
                      <span className="block text-xs text-[var(--color-text-muted)]">
                        {socialLink.handle}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="contact-map-surface">
          <div className="space-y-3 p-5 md:p-7">
            <h2 className="text-2xl md:text-3xl">{copy.contactPage.mapTitle}</h2>
            <p className="text-base text-[var(--color-text-muted)] md:text-lg">
              {copy.contactPage.mapDescription}
            </p>
            <p className="text-sm font-medium text-[var(--color-text-main)]">
              {data.map.locationText}
            </p>
          </div>
          <div className="h-[320px] border-t border-[var(--color-border)] md:h-[420px]">
            <iframe
              title={data.map.ariaLabel}
              src={data.map.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </section>
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
