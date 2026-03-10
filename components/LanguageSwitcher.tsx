'use client';

// components/LanguageSwitcher.tsx
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { localeNames, Locale } from '@/lib/i18n/i18n-config';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);

  const otherLocales = (Object.keys(localeNames) as Locale[]).filter(
    (l) => l !== locale
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-label="Ganti Bahasa / Change Language"
      >
        <Globe size={16} />
        <span>{localeNames[locale]}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[150px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {otherLocales.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
