import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gamepad2, Mic, Clapperboard, Quote, SkipForward, Timer, Users, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const RuleStep = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 p-3 bg-sky-100 dark:bg-sky-900/40 rounded-full">
      <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
    </div>
    <div>
      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  </div>
);
export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideClose className="sm:max-w-md w-full h-[95vh] sm:h-auto sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden border-0 dark:border-0 shadow-2xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-center text-balance">
            {t('howToPlay.title')}
          </DialogTitle>
          <DialogDescription
            className="text-center text-slate-600 dark:text-slate-400 text-base pt-2 text-balance"
            dangerouslySetInnerHTML={{ __html: t('howToPlay.description') }}
          />
        </DialogHeader>
        <ScrollArea className="flex-1 w-full pr-4 overflow-y-auto">
          <div className="space-y-6 py-4">
            <RuleStep
              icon={Gamepad2}
              title={t('howToPlay.goalTitle')}
              description={t('howToPlay.goalDescription')}
            />
            <RuleStep
              icon={Users}
              title={t('howToPlay.seatingTitle')}
              description={t('howToPlay.seatingDescription')}
            />
            <RuleStep
              icon={RefreshCw}
              title={t('howToPlay.flowTitle')}
              description={t('howToPlay.flowDescription')}
            />
            <RuleStep
              icon={Mic}
              title={t('howToPlay.round1Title')}
              description={t('howToPlay.round1Description')}
            />
            <RuleStep
              icon={Quote}
              title={t('howToPlay.round2Title')}
              description={t('howToPlay.round2Description')}
            />
            <RuleStep
              icon={Clapperboard}
              title={t('howToPlay.round3Title')}
              description={t('howToPlay.round3Description')}
            />
            <RuleStep
              icon={SkipForward}
              title={t('howToPlay.passingTitle')}
              description={t('howToPlay.passingDescription')}
            />
            <RuleStep
              icon={Timer}
              title={t('howToPlay.bonusTimeTitle')}
              description={t('howToPlay.bonusTimeDescription')}
            />
          </div>
        </ScrollArea>
        <DialogFooter className="flex-shrink-0 pt-4">
          <Button
            onClick={onClose}
            className="w-full text-lg font-bold h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {t('howToPlay.closeButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};