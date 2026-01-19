import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, setTheme } = useGameStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    }))
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-3 rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95 dark:bg-slate-800",
        className
      )}
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ y: -30, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 30, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute"
            >
              <Sun className="w-6 h-6 text-amber-500 fill-amber-500/20" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: -30, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 30, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute"
            >
              <Moon className="w-6 h-6 text-sky-300 fill-sky-300/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
};
