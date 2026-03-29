import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { Deck } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface DeckButtonProps {
  deck: Deck;
  icon: React.ElementType;
  isSelected: boolean;
  progress: number;
  onSelect: (deck: Deck) => void;
}

export const DeckButton: React.FC<DeckButtonProps> = ({ deck, icon: Icon, isSelected, progress, onSelect }) => {
  const { t } = useTranslations();
  const wordCount = deck.words?.length || 0;
  
  const difficultyFactor = {
    easy: 4,
    medium: 3,
    hard: 2,
  }[deck.difficulty] || 3;
  
  const estimatedTime = Math.round((wordCount * 3) / difficultyFactor);
  
  return (
    <Button
      onClick={() => onSelect(deck)}
      variant="outline"
      className={cn(
        "relative overflow-hidden w-full h-auto text-left font-semibold rounded-2xl p-3 flex items-center gap-3 whitespace-normal transition-colors duration-200 shadow-none",
        isSelected 
          ? 'bg-sky-500 text-white border-sky-500' 
          : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-sky-300 dark:hover:border-sky-700',
        progress === 4 && !isSelected ? 'opacity-90' : ''
      )}
    >
      <div className={cn("relative p-2 rounded-xl", isSelected ? "bg-white/20" : "bg-sky-50 dark:bg-sky-900/40 text-sky-500 dark:text-sky-400")}>
        <Icon className="w-8 h-8 flex-shrink-0" />
        {progress === 4 && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full flex items-center justify-center w-4 h-4">
            <Check className="w-2 h-2 text-white p-1" />
          </div>
        )}
      </div>
      <div className="flex-grow pb-1">
        <p className="text-lg text-balance">{deck.name}</p>
        <div className={cn("flex items-center gap-2 text-sm", isSelected ? 'text-white/80' : 'text-muted-foreground')}>
          <span>{t('setup.deckWords', { count: wordCount })}</span>
          <span>&bull;</span>
          <span>{t(`deckDifficulty.${deck.difficulty}`)}</span>
          <span>&bull;</span>
          <span>{t('setup.estimatedTime', { time: estimatedTime })}</span>
        </div>
      </div>
      {/* Progress Bar Container */}
      {progress > 0 && (
        <div className="absolute bottom-1 left-0 right-0 h-1 flex px-4">
          <div className={cn("h-full rounded-l-full flex-1 mx-[1px]", progress >= 1 ? (isSelected ? 'bg-white' : 'bg-sky-400') : (isSelected ? 'bg-black/10' : 'bg-slate-100 dark:bg-border'))} />
          <div className={cn("h-full flex-1 mx-[1px]", progress >= 2 ? (isSelected ? 'bg-white' : 'bg-sky-400') : (isSelected ? 'bg-black/10' : 'bg-slate-100 dark:bg-border'))} />
          <div className={cn("h-full rounded-r-full flex-1 mx-[1px]", progress >= 3 ? (isSelected ? 'bg-white' : 'bg-sky-400') : (isSelected ? 'bg-black/10' : 'bg-slate-100 dark:bg-border'))} />
        </div>
      )}
    </Button>
  );
};
