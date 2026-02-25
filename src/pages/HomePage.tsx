import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameStore, Language } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { useTranslations } from '@/hooks/useTranslations';
import { FlagIcon } from '@/components/FlagIcon';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AboutModal } from '@/components/AboutModal';
import { Info } from 'lucide-react';
const LanguageSelector = () => {
  const language = useGameStore(useShallow((state) => state.language));
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectLang = (lang: Language) => {
    if (lang === language) return;

    // Map current path to target language path
    // e.g. /en/setup -> /tr/kurulum
    const parts = pathname.split('/').filter(Boolean);
    const currentPage = parts[1] || ''; // 'setup', 'kurulum', etc.

    const SLUG_MAP: Record<string, Record<Language, string>> = {
      'setup': { en: 'setup', tr: 'kurulum' },
      'kurulum': { en: 'setup', tr: 'kurulum' },
      'play': { en: 'play', tr: 'oyun' },
      'oyun': { en: 'play', tr: 'oyun' },
      'score': { en: 'score', tr: 'skor' },
      'skor': { en: 'score', tr: 'skor' },
    };

    const targetSlug = currentPage && SLUG_MAP[currentPage] ? SLUG_MAP[currentPage][lang] : currentPage;
    navigate(`/${lang}${targetSlug ? '/' + targetSlug : ''}`, { replace: true });
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => selectLang('en')}
        className={`transition-transform duration-300 ease-in-out hover:scale-110 ${language !== 'en' ? 'opacity-50 grayscale' : ''}`}
        aria-label="Select English"
      >
        <FlagIcon lang="en" className="w-12 h-auto rounded-lg shadow-md" />
      </button>
      <button
        onClick={() => selectLang('tr')}
        className={`transition-transform duration-300 ease-in-out hover:scale-110 ${language !== 'tr' ? 'opacity-50 grayscale' : ''}`}
        aria-label="Select Turkish"
      >
        <FlagIcon lang="tr" className="w-12 h-auto rounded-lg shadow-md" />
      </button>
    </div>
  );
};

export function HomePage() {
  const navigate = useNavigate();
  const resetSetup = useGameStore((state) => state.resetSetup);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { t, getLocalizedPath } = useTranslations();

  const handleStartGame = () => {
    resetSetup();
    navigate(getLocalizedPath('setup'));
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen-dvh bg-transparent p-6 text-center overflow-hidden relative">
      <ThemeToggle className="!fixed !top-4 !right-4 z-50 shadow-lg" />
      <button
        onClick={() => setIsAboutOpen(true)}
        className="!fixed !top-[4.5rem] !right-4 z-50 p-3 rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        aria-label={t('home.about')}
      >
        <Info className="w-6 h-6" />
      </button>
      <main className="flex flex-col items-center justify-center space-y-10 z-10 w-full max-w-md">
        <m.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 12,
            delay: 0.1
          }}
          className="w-full"
        >
          <Logo className="w-full h-auto text-sky-500 drop-shadow-sm" />
        </m.div>
        <m.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="space-y-4"
        >
          <h1 className="text-xl font-medium text-slate-600 dark:text-slate-400 tracking-tight text-balance">
            <span className="sr-only">Yaygara - </span>
            {t('home.slogan')}
          </h1>
        </m.div>
        <m.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="w-full space-y-6"
        >
          <LanguageSelector />
          <Button
            onClick={handleStartGame}
            className="w-full text-xl font-bold h-16 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {t('home.startGame')}
          </Button>
          <Button
            variant="link"
            className="text-slate-500 dark:text-slate-400 text-base font-semibold"
            onClick={() => setIsHowToPlayOpen(true)}
          >
            {t('home.howToPlay')}
          </Button>
        </m.div>
      </main>
      <footer className="absolute bottom-6 text-center text-slate-500/80 dark:text-slate-400/80 text-sm">
        <p>{t('home.footer')}</p>
      </footer>
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <PWAInstallPrompt />
    </div>
  );
}