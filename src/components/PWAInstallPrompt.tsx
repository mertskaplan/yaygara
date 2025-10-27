import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
export const PWAInstallPrompt: React.FC = () => {
  const { canInstall, promptInstall } = usePWAInstall();
  const { t } = useTranslations();
  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 flex items-center gap-4 border">
            <div className="p-3 bg-sky-100 rounded-full">
              <DownloadCloud className="w-6 h-6 text-sky-600" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-slate-800">{t('pwa.installTitle')}</h3>
              <p className="text-sm text-slate-600">{t('pwa.installDescription')}</p>
            </div>
            <Button
              onClick={promptInstall}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl px-4 py-2 h-auto flex-shrink-0"
            >
              {t('pwa.installButton')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};