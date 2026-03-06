import { useGameStore } from '@/stores/useGameStore';

export const translationsCache: Record<string, any> = {};
const SUPPORTED_LANGUAGES = ['en', 'tr'];
const pendingFetches: Record<string, Promise<any>> = {};

export const fetchTranslations = async (lang: string) => {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }
  if (pendingFetches[lang]) {
    return pendingFetches[lang];
  }
  const fetchPromise = fetch(`/locales/${lang}.json`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${lang}.json`);
      }
      const data = await response.json();
      translationsCache[lang] = data;

      // Update global store if this is the currently active language
      const currentLanguage = useGameStore.getState().language;
      if (lang === currentLanguage) {
        useGameStore.getState().setTranslations(data);
      }

      delete pendingFetches[lang];
      return data;
    })
    .catch((error) => {
      console.error(`Could not load translations for language: ${lang}`, error);
      delete pendingFetches[lang];
      // Fallback to English if the selected language fails
      if (lang !== 'en') {
        return fetchTranslations('en');
      }
      return {}; // Return empty object if English also fails
    });
  pendingFetches[lang] = fetchPromise;
  return fetchPromise;
};

let preloadPromise: Promise<any[]> | null = null;
export const preloadTranslations = () => {
  if (!preloadPromise) {
    console.log('Preloading all translations...');
    preloadPromise = Promise.all(SUPPORTED_LANGUAGES.map(lang => fetchTranslations(lang)));
  }
  return preloadPromise;
};

/**
 * Forcefully refreshes all translations from the network.
 * Used during app initialization to ensure the latest versions are loaded in the background.
 */
export const refreshTranslations = async () => {
  console.log('Refreshing all translations in the background...');
  // Clear the in-memory cache to force a fresh fetch
  SUPPORTED_LANGUAGES.forEach(lang => {
    delete translationsCache[lang];
    delete pendingFetches[lang];
  });

  // Create a new preloadPromise to allow future calls to preloadTranslations 
  // to return the new, fresh data.
  preloadPromise = Promise.all(SUPPORTED_LANGUAGES.map(lang => fetchTranslations(lang)));
  return preloadPromise;
};