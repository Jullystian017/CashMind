// lib/i18n/useTranslation.ts
// Sistem translate ringan tanpa library eksternal
// Supports nested keys like "nav.dashboard", variables like "welcome {name}"

import { useCallback } from 'react';
import { Locale, defaultLocale } from './i18n-config';
import { useLanguage } from './LanguageContext';

type Messages = Record<string, unknown>;

// Cache untuk menyimpan pesan yang sudah dimuat
const messageCache: Partial<Record<Locale, Messages>> = {};

// Load messages secara sinkron dari cache atau import dinamis
export function getMessages(locale: Locale): Messages {
  if (messageCache[locale]) return messageCache[locale]!;
  // Fallback ke default jika belum termuat
  return messageCache[defaultLocale] ?? {};
}

// Simpan pesan ke cache (dipanggil saat app init)
export function setMessages(locale: Locale, messages: Messages) {
  messageCache[locale] = messages;
}

// Ambil nilai dari nested key, misal "nav.dashboard"
function getNestedValue(obj: Messages, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

// Interpolasi variabel: "Selamat datang, {name}!" -> "Selamat datang, Budi!"
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

// Hook utama
export function useTranslation() {
  const { locale } = useLanguage();
  const messages = getMessages(locale);
  const fallbackMessages = getMessages(defaultLocale);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const value =
        getNestedValue(messages, key) ??
        getNestedValue(fallbackMessages, key) ??
        key; // fallback ke key itu sendiri
      return interpolate(value, vars);
    },
    [messages, fallbackMessages]
  );

  return { t, locale };
}
