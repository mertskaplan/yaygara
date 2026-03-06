import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslations } from '@/hooks/useTranslations';

interface VisibilityPauseModalProps {
    isOpen: boolean;
    onContinue: () => void;
}

export const VisibilityPauseModal: React.FC<VisibilityPauseModalProps> = ({ isOpen, onContinue }) => {
    const { t } = useTranslations();

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="rounded-3xl bg-card">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-center">
                        {t('game.visibilityPause.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-slate-600 dark:text-slate-400 text-base pt-2">
                        {t('game.visibilityPause.description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center pt-4">
                    <AlertDialogAction
                        onClick={onContinue}
                        className="h-14 w-full text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {t('game.visibilityPause.continue')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
