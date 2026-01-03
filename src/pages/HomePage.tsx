import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameStore, Language } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { useTranslations } from '@/hooks/useTranslations';
import { FlagIcon } from '@/components/FlagIcon';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Logo } from '@/components/Logo';
const LanguageSelector = () => {
  const language = useGameStore(useShallow((state) => state.language));
  const setLanguage = useGameStore(useShallow((state) => state.setLanguage));
  const selectLang = (lang: Language) => {
    setLanguage(lang);
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
  const { t } = useTranslations();
  const handleStartGame = () => {
    resetSetup();
    navigate('/setup');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center overflow-hidden">
      <main className="flex flex-col items-center justify-center space-y-10 z-10 w-full max-w-md">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: 0.2
          }}
          className="w-full"
        >
          <Logo className="w-full h-auto text-sky-500 drop-shadow-sm" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4"
        >
          <p className="text-xl font-medium text-slate-600 tracking-tight">
            {t('home.slogan')}
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
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
            className="text-slate-500 text-base font-semibold"
            onClick={() => setIsHowToPlayOpen(true)}
          >
            {t('home.howToPlay')}
          </Button>
        </motion.div>
      </main>
      <footer className="absolute bottom-6 text-center text-slate-500/80 text-sm">
        <p>{t('home.footer')}</p>
      </footer>
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <PWAInstallPrompt />
    </div>
  );
}