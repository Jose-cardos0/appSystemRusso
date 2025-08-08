import { de } from "../translations/de";

export type TranslationKey = keyof typeof de;

export function useTranslation() {
  const t = (key: TranslationKey): string => {
    return de[key] || key;
  };

  return { t };
}
