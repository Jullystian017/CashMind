'use client';

// lib/i18n/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, defaultLocale, locales } from './i18n-config';
import { setMessages } from './useTranslation';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [loaded, setLoaded] = useState(false);

  // Load semua messages saat pertama kali
  useEffect(() => {
    async function loadAllMessages() {
      const [idMessages, enMessages] = await Promise.all([
        import('../../messages/id.json').then((m) => m.default),
        import('../../messages/en.json').then((m) => m.default),
      ]);
      setMessages('id', idMessages);
      setMessages('en', enMessages);
      setLoaded(true);
    }
    loadAllMessages();
  }, []);

  // Baca preferensi bahasa dari localStorage
  useEffect(() => {
    if (!loaded) return;
    const saved = localStorage.getItem('cashmind-locale') as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
  }, [loaded]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('cashmind-locale', newLocale);
  };

  if (!loaded) return null; // Atau bisa tampilkan skeleton/spinner

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
