import { useState, useCallback, useEffect } from 'react';

interface Translation {
  [key: string]: string | Translation;
}

interface I18nOptions {
  defaultLanguage: string;
  fallbackLanguage: string;
  translations: Record<string, Translation>;
  persistLanguage?: boolean;
  storageKey?: string;
}

interface I18nState {
  language: string;
  fallbackLanguage: string;
  availableLanguages: string[];
}

interface I18nActions {
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency: string) => string;
}

export const useI18n = (options: I18nOptions): I18nState & I18nActions => {
  const {
    defaultLanguage,
    fallbackLanguage,
    translations,
    persistLanguage = true,
    storageKey = 'i18n-language',
  } = options;

  const [state, setState] = useState<I18nState>(() => {
    // Try to get language from storage
    if (persistLanguage) {
      const stored = localStorage.getItem(storageKey);
      if (stored && translations[stored]) {
        return {
          language: stored,
          fallbackLanguage,
          availableLanguages: Object.keys(translations),
        };
      }
    }

    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      return {
        language: browserLang,
        fallbackLanguage,
        availableLanguages: Object.keys(translations),
      };
    }

    return {
      language: defaultLanguage,
      fallbackLanguage,
      availableLanguages: Object.keys(translations),
    };
  });

  // Persist language preference
  useEffect(() => {
    if (persistLanguage) {
      localStorage.setItem(storageKey, state.language);
    }
  }, [state.language, persistLanguage, storageKey]);

  // Update document language
  useEffect(() => {
    document.documentElement.lang = state.language;
  }, [state.language]);

  const setLanguage = useCallback((language: string) => {
    if (translations[language]) {
      setState((prev) => ({ ...prev, language }));
    }
  }, [translations]);

  const getTranslation = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let translation: Translation | string | undefined = translations[state.language];

      // Try to get translation from current language
      for (const k of keys) {
        if (typeof translation === 'string') return translation;
        translation = translation?.[k];
      }

      // If not found, try fallback language
      if (!translation) {
        translation = translations[state.fallbackLanguage];
        for (const k of keys) {
          if (typeof translation === 'string') return translation;
          translation = translation?.[k];
        }
      }

      // If still not found, return the key
      return typeof translation === 'string' ? translation : key;
    },
    [state.language, state.fallbackLanguage, translations]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      let translation = getTranslation(key);

      // Replace parameters in translation
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          translation = translation.replace(`{${key}}`, value);
        });
      }

      return translation;
    },
    [getTranslation]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(state.language, options).format(value);
    },
    [state.language]
  );

  const formatDate = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions): string => {
      return new Intl.DateTimeFormat(state.language, options).format(date);
    },
    [state.language]
  );

  const formatCurrency = useCallback(
    (value: number, currency: string): string => {
      return new Intl.NumberFormat(state.language, {
        style: 'currency',
        currency,
      }).format(value);
    },
    [state.language]
  );

  return {
    ...state,
    setLanguage,
    t,
    formatNumber,
    formatDate,
    formatCurrency,
  };
}; 