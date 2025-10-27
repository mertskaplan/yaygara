import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslations } from '@/hooks/useTranslations';
interface EndGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const EndGameModal: React.FC<EndGameModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslations();
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-extrabold text-slate-800 font-display text-center">
            {t('game.endGameConfirmation.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-slate-600 text-base pt-2">
            {t('game.endGameConfirmation.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
          <AlertDialogCancel className="h-14 text-lg font-bold rounded-2xl bg-white border-2 border-slate-200 hover:bg-slate-100 text-slate-700">
            {t('game.endGameConfirmation.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-14 text-lg font-bold rounded-2xl bg-rose-500 hover:bg-rose-600 text-white"
          >
            {t('game.endGameConfirmation.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};