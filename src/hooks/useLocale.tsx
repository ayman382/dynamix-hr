import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import i18n from '@/lib/i18n';
import type { Locale } from '@/types';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const defaultLocale: Locale = 'en';

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => undefined,
  isRTL: false,
});

const getStoredLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const savedLocale = window.localStorage.getItem('locale');
  if (savedLocale === 'ar' || savedLocale === 'en') {
    return savedLocale;
  }

  return i18n.resolvedLanguage === 'ar' ? 'ar' : defaultLocale;
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);
  const isRTL = locale === 'ar';

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', nextLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    void i18n.changeLanguage(locale);
  }, [isRTL, locale]);

  const value = useMemo(
    () => ({ locale, setLocale, isRTL }),
    [isRTL, locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
