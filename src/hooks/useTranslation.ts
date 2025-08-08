import { ru } from "../translations/ru";

export type TranslationKey = keyof typeof ru;

export function useTranslation() {
  const t = (key: TranslationKey): string => {
    return ru[key] || key;
  };

  return { t };
}
