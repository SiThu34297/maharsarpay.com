import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { getBookFilterOptions } from "@/features/books";
import type { MultimediaPageData } from "@/features/multimedia/schemas/multimedia";
import type { Dictionary, Locale } from "@/lib/i18n";

import { MultimediaListClient } from "./multimedia-list-client";

type MultimediaPageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
  data: MultimediaPageData;
}>;

export async function MultimediaPage({ copy, locale, data }: MultimediaPageProps) {
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
        activeNavId="media"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main>
        <MultimediaListClient
          copy={copy.multimediaList}
          locale={locale}
          initialResponse={data.initialResponse}
          initialQuery={data.initialQuery}
        />
      </main>

      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
