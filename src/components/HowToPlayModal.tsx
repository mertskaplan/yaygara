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
import { Gamepad2, Mic, Clapperboard, Quote, SkipForward, Timer } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const RuleStep = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 p-3 bg-sky-100 rounded-full">
      <Icon className="w-6 h-6 text-sky-600" />
    </div>
    <div>
      <h4 className="text-lg font-bold text-slate-800">{title}</h4>
      <p className="text-slate-600">{description}</p>
    </div>
  </div>
);
export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-amber-50 rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-slate-800 font-display text-center">
            {t('howToPlay.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-base pt-2">
            {t('howToPlay.description')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-80 w-full pr-4">
          <div className="space-y-6 py-4">
            <RuleStep
              icon={Gamepad2}
              title={t('howToPlay.goalTitle')}
              description={t('howToPlay.goalDescription')}
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
        <DialogFooter>
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