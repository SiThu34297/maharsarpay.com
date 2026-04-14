import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { enDictionary } from "@/lib/i18n/dictionaries/en";
import { myDictionary } from "@/lib/i18n/dictionaries/my";
import type { Dictionary } from "@/lib/i18n/types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(enDictionary),
  my: () => Promise.resolve(myDictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
