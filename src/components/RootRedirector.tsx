import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, Language } from '@/stores/useGameStore';

export const RootRedirector: React.FC = () => {
    const navigate = useNavigate();
    const language = useGameStore((state) => state.language);

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        const targetLang: Language = browserLang === 'tr' ? 'tr' : 'en';
        navigate(`/${targetLang}`, { replace: true });
    }, [navigate]);

    return null;
};
