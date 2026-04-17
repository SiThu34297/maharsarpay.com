import Image from "next/image";

import { getWebsiteBranding } from "@/features/page-info";
import { defaultLocale, type Locale } from "@/lib/i18n";

type MarketingTopBrandStripProps = Readonly<{
  title?: string;
  message?: string;
  locale?: Locale;
  logoAlt?: string;
}>;

export async function MarketingTopBrandStrip({
  title,
  message,
  locale,
  logoAlt,
}: MarketingTopBrandStripProps) {
  const branding = await getWebsiteBranding(locale ?? defaultLocale);
  const resolvedTitle = branding.title || title || "မဟာစာပေ";
  const resolvedMessage =
    branding.message ||
    message ||
    "သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့";

  return (
    <section className="border-b border-(--color-border) bg-white">
      <div className="home-shell py-4 md:py-5">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
          <Image
            src={branding.logoSrc}
            alt={logoAlt || `${resolvedTitle} logo`}
            width={500}
            height={219}
            className="h-16 w-auto object-contain md:h-20"
            priority
          />
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{resolvedTitle}</h2>
          <p className="max-w-3xl text-sm text-(--color-text-muted) md:text-base">
            {resolvedMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
