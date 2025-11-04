import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { translationsCache, fetchTranslations } from '@/lib/i18n';
// Helper to get a nested property from an object using a dot-separated path
const get = (obj: any, path: string): string | undefined =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);
export const useTranslations = () => {
  const { language } = useGameStore(useShallow(state => ({ language: state.language })));
  const [translations, setTranslations] = useState<Record<string, any> | null>(translationsCache[language] || null);
  const [isLoading, setIsLoading] = useState(!translations);
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      const data = await fetchTranslations(language);
      setTranslations(data);
      setIsLoading(false);
    };
    loadTranslations();
  }, [language]);
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
  return { t, isLoading, language, translations };
};