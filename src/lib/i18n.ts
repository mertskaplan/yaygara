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