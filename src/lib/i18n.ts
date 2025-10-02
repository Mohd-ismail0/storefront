// Supported locales
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[0];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale configuration
export const localeConfig = {
  en: {
    name: 'English',
    dir: 'ltr' as const,
    flag: '🇺🇸'
  },
  ar: {
    name: 'العربية',
    dir: 'rtl' as const,
    flag: '🇸🇦'
  }
} as const;