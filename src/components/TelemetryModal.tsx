import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { getTelemetryUrl } from '@/lib/env';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryModal: React.FC<TelemetryModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    language,
    selectedDeck,
    words,
    gameStartTime,
    gameEndTime,
    activePlaySeconds,
    teams,
    gameId
  } = useGameStore(useShallow((state) => ({
    language: state.language,
    selectedDeck: state.selectedDeck,
    words: state.words,
    gameStartTime: state.gameStartTime,
    gameEndTime: state.gameEndTime,
    activePlaySeconds: state.activePlaySeconds,
    teams: state.teams,
    gameId: state.gameId
  })));

  const handleSubmit = async () => {
    if (liked === null || !selectedDeck || !gameStartTime || !gameEndTime) return;

    setIsSubmitting(true);

    // Calculate estimated time (same logic as SetupPage)
    const difficultyFactor = selectedDeck.difficulty === 'hard' ? 2 : selectedDeck.difficulty === 'medium' ? 3 : 4;
    const estimatedTimeMin = Math.round((words.length * 3) / difficultyFactor);

    // Build the specific JSON structure requested by the server
    const payload = {
      session_id: gameId || 'ygr-unknown',
      timestamp: new Date().toISOString(),
      interface_language: language,
      deck_id: selectedDeck.id,
      total_words_played: words.length,
      estimated_duration_min: estimatedTimeMin,
      duration_total_min: Math.max(1, Math.round((gameEndTime - gameStartTime) / 60000)),
      duration_active_min: Math.max(0, Math.round(activePlaySeconds / 60)),
      scores: teams.map((team, index) => ({
        team_id: index + 1,
        score: team.score
      })),
      liked: liked,
      verification_code: gameId?.split('-').pop()?.toUpperCase() || 'UNKNOWN'
    };

    const url = getTelemetryUrl();
    console.log('Sending telemetry to:', url);

    try {
      if (url) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error('Failed to send telemetry');
        }
      } else {
        console.warn('Telemetry URL is not configured. Simulating success.');
      }
      // Show success regardless of errors to not block the user
      setIsSuccess(true);
    } catch (error) {
      console.error('Error sending telemetry:', error);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    onClose();
    useGameStore.getState().resetGame();
    window.location.href = `/${language}`;
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent hideClose className="sm:max-w-md w-full bg-white dark:bg-background rounded-3xl p-8 flex flex-col items-center text-center border-0 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
            Teşekkürler
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Yaygara'yı daha iyi hale getirmek için oyun verilerinizi ilettiğiniz için teşekkürler
          </DialogDescription>
          <Button
            onClick={handleReturnHome}
            className="w-full h-14 bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold rounded-2xl shadow-lg transition-all"
          >
            Ana sayfaya dön
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideClose className="sm:max-w-md w-full bg-white dark:bg-background rounded-3xl p-8 flex flex-col border-0 shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
            Telemetri Onayı
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm pt-2">
            Oyunun ve kelime destesinin daha iyi hale getirilebilmesi için oynanılan deste, oyun süresi ve takım puanları gibi oyuna dair veriler anonim olarak oyun yapımcısına iletebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 py-2">
          <div className="space-y-4">
            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">
              Bu oyundaki kelime destesini beğendiniz mi?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLiked(true)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${liked === true
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
              >
                <ThumbsUp className={`w-6 h-6 mb-2 ${liked === true ? 'fill-sky-500' : ''}`} />
                <span className="font-bold">Evet</span>
              </button>
              <button
                onClick={() => setLiked(false)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${liked === false
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
              >
                <ThumbsDown className={`w-6 h-6 mb-2 ${liked === false ? 'fill-rose-500' : ''}`} />
                <span className="font-bold">Hayır</span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-14 text-slate-500 font-bold"
          >
            İptal
          </Button>
          <Button
            disabled={liked === null || isSubmitting}
            onClick={handleSubmit}
            className="flex-1 h-14 bg-sky-500 hover:bg-sky-600 text-white text-base font-bold rounded-2xl shadow-lg transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Oyun verilerini ilet
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
