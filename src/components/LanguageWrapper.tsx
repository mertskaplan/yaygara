import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGameStore, Language } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';

const SUPPORTED_LANGUAGES: Language[] = ['en', 'tr'];
const DEFAULT_LANGUAGE: Language = 'en';

export const LanguageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { lang } = useParams<{ lang: string }>();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { language, setLanguage } = useGameStore(
        useShallow((state) => ({
            language: state.language,
            setLanguage: state.setLanguage,
        }))
    );

    useEffect(() => {
        const currentLang = lang as Language;

        if (!currentLang || !SUPPORTED_LANGUAGES.includes(currentLang)) {
            // If no lang or unsupported lang, redirect to default or detected lang
            // For now, let's just handle this in the root redirector, 
            // but as a fallback, we can redirect to /en
            if (!currentLang) {
                return; // Let the root redirector handle it
            }
            navigate(`/${DEFAULT_LANGUAGE}`, { replace: true });
            return;
        }

        if (currentLang !== language) {
            setLanguage(currentLang);
        }

        // Update HTML lang and dir
        document.documentElement.lang = currentLang;
        document.documentElement.dir = 'ltr';

        // Update SEO Tags
        updateSEOTags(currentLang, pathname);
    }, [lang, language, setLanguage, navigate, pathname]);

    return <>{children}</>;
};

function updateSEOTags(lang: Language, pathname: string) {
    const baseUrl = 'https://yaygara.mertskaplan.com';
    const languages: Language[] = ['en', 'tr'];

    // Remove existing Canonical and Hreflang tags to avoid duplicates
    document.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Canonical
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${baseUrl}${pathname}`);
    document.head.appendChild(canonical);

    // Update Meta Description and OG tags
    const descriptions: Record<Language, string> = {
        en: 'Fun party game based on narration and guessing',
        tr: 'Anlatma ve tahmine dayalı eğlenceli parti oyunu'
    };

    const ogTitles: Record<Language, string> = {
        en: 'Yaygara: Fun party game based on narration and guessing',
        tr: 'Yaygara: Anlatma ve tahmine dayalı eğlenceli parti oyunu'
    };

    const titles: Record<Language, string> = {
        en: 'Yaygara | Fun party game based on narration and guessing',
        tr: 'Yaygara | Anlatma ve tahmine dayalı eğlenceli parti oyunu'
    };

    document.title = titles[lang];

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', descriptions[lang]);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', ogTitles[lang]);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descriptions[lang]);

    // Hreflang Tags (en, tr)
    languages.forEach(l => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', l);
        const targetPath = getLocalizedPath(pathname, l);
        link.setAttribute('href', `${baseUrl}${targetPath}`);
        document.head.appendChild(link);
    });

    // x-default
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', `${baseUrl}${getLocalizedPath(pathname, 'en')}`);
    document.head.appendChild(xDefault);
}

// Map of slugs for path translation
const SLUG_MAP: Record<string, Record<Language, string>> = {
    'setup': { en: 'setup', tr: 'kurulum' },
    'kurulum': { en: 'setup', tr: 'kurulum' },
    'play': { en: 'play', tr: 'oyun' },
    'oyun': { en: 'play', tr: 'oyun' },
    'score': { en: 'score', tr: 'skor' },
    'skor': { en: 'score', tr: 'skor' },
};

function getLocalizedPath(pathname: string, targetLang: Language): string {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return `/${targetLang}`;

    // parts[0] is the current lang
    const remainingParts = parts.slice(1);
    const localizedParts = remainingParts.map(part => {
        const mapping = SLUG_MAP[part];
        return mapping ? mapping[targetLang] : part;
    });

    return `/${targetLang}${localizedParts.length > 0 ? '/' + localizedParts.join('/') : ''}`;
}
