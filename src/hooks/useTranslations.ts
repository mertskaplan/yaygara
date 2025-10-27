import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { translationsCache } from '@/lib/i18n';
// Helper to get a nested property from an object using a dot-separated path
const get = (obj: any, path: string): string | undefined =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);
export const useTranslations = () => {
  const { language } = useGameStore(useShallow(state => ({ language: state.language })));
  const [translations, setTranslations] = useState<Record<string, any> | null>(translationsCache[language] || null);
  const [isLoading, setIsLoading] = useState(!translations);
  useEffect(() => {
    const loadTranslations = async () => {
      if (translationsCache[language]) {
        setTranslations(translationsCache[language]);
        setIsLoading(false);
        return;
      }
      // This path is a fallback for when preloading hasn't completed yet.
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        translationsCache[language] = data;
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translations for language: ${language}`, error);
        // Fallback to English if the selected language fails and English is cached
        if (language !== 'en' && translationsCache['en']) {
          setTranslations(translationsCache['en']);
        }
      } finally {
        setIsLoading(false);
      }
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