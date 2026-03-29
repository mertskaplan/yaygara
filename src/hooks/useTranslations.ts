import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { translationsCache, fetchTranslations } from '@/lib/i18n';
// Helper to get a nested property from an object using a dot-separated path
const get = (obj: any, path: string): string | undefined =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);
export const useTranslations = () => {
  const { language, translations, setTranslations } = useGameStore(
    useShallow(state => ({
      language: state.language,
      translations: state.translations,
      setTranslations: state.setTranslations
    }))
  );
  const [isLoading, setIsLoading] = useState(!translations);

  const isTranslationsNull = translations === null;

  useEffect(() => {
    const loadTranslations = async () => {
      // If we already have translations in the store for this language, don't show loading
      if (isTranslationsNull) {
        setIsLoading(true);
      }
      const data = await fetchTranslations(language);
      setTranslations(data);
      setIsLoading(false);
    };
    loadTranslations();
  }, [language, isTranslationsNull, setTranslations]); // Only re-run if language changes or translations are cleared
  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    if (isLoading || !translations) {
      // Return the key itself as a fallback to prevent blank UI elements
      return key;
    }
    let translation = get(translations, key) || key;
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{${placeholder}}`, 'g');
        translation = translation.replace(regex, String(replacements[placeholder]));
      });
    }
    return translation;
  }, [translations, isLoading]);

  const getLocalizedPath = useCallback((path: string): string => {
    const slug = t(`slugs.${path}`);
    return `/${language}/${slug === `slugs.${path}` ? path : slug}`;
  }, [language, t]);

  return { t, isLoading, language, translations, getLocalizedPath };
};