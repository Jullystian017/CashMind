// lib/i18n/config.ts
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  id: '🇮🇩 Indonesia',
  en: '🇺🇸 English',
};
