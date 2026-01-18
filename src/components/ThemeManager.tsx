import React, { useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';

export const ThemeManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useGameStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Handle system preference changes if we want to sync
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            // Only sync if user hasn't manually set a preference?
            // For now, we prioritize the store (which persists).
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return <>{children}</>;
};
