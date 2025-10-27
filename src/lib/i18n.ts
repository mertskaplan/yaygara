export const translationsCache: Record<string, any> = {};
const SUPPORTED_LANGUAGES = ['en', 'tr'];
let preloadPromise: Promise<void[]> | null = null;
export const preloadTranslations = () => {
  if (!preloadPromise) {
    console.log('Preloading all translations...');
    preloadPromise = Promise.all(
      SUPPORTED_LANGUAGES.map(async (lang) => {
        try {
          if (translationsCache[lang]) return;
          const response = await fetch(`/locales/${lang}.json`);
          if (!response.ok) throw new Error(`Failed to fetch ${lang}.json`);
          const data = await response.json();
          translationsCache[lang] = data;
          console.log(`Successfully preloaded and cached translations for: ${lang}`);
        } catch (error) {
          console.error(`Could not preload translations for language: ${lang}`, error);
        }
      })
    );
  }
  return preloadPromise;
};