import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import type { AuthorsPageData } from "@/features/authors/schemas/authors";
import type { Dictionary, Locale } from "@/lib/i18n";
import { AuthorsListClient } from "./authors-list-client";

type AuthorsPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: AuthorsPageData;
}>;

export function AuthorsPage({ copy, locale, data }: AuthorsPageProps) {
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const authorsNavigation = navigation.filter((item) => item.id !== "categories");

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
      <MarketingSiteHeader copy={copy} navigation={authorsNavigation} activeNavId="authors" />

      <main>
        <AuthorsListClient
          copy={copy.authorsList}
          locale={locale}
          initialResponse={data.initialResponse}
          initialQuery={data.initialQuery}
        />
      </main>

      <MarketingSiteFooter copy={copy} navigation={authorsNavigation} />
    </div>
  );
}
