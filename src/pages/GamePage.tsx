import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Check, X, Undo2, LogOut } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/components/WordCard';
import { TimerCircle } from '@/components/TimerCircle';
import { useTranslations } from '@/hooks/useTranslations';
import { TurnSummaryScreen } from '@/components/TurnSummaryScreen';
import { EndGameModal } from '@/components/EndGameModal';
import { VisibilityPauseModal } from '@/components/VisibilityPauseModal';
import { hexToHsl } from '@/lib/utils';
const GetReadyScreen = () => {
  const teams = useGameStore(useShallow((state) => state.teams));
  const currentTeamIndex = useGameStore(useShallow((state) => state.currentTeamIndex));
  const round = useGameStore(useShallow((state) => state.round));
  const startTurn = useGameStore(useShallow((state) => state.startTurn));
  const [initialRound] = useState(round);
  const [initialTeam] = useState(teams[currentTeamIndex]);

  const { t } = useTranslations();
  const roundTitles = [t('game.round1'), t('game.round2'), t('game.round3')];
  const roundDescriptions = [t('game.round1Description'), t('game.round2Description'), t('game.round3Description')];

  if (!initialTeam) return null;
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-3xl shadow-xl w-full max-w-md"
    >
      <h1 className="text-4xl font-extrabold font-display drop-shadow-lg text-balance" style={{ color: initialTeam.color }}>
        {t('game.getReadyTitle', { teamName: initialTeam.name })}
      </h1>
      <p className="text-2xl font-bold text-slate-700 dark:text-slate-100 mt-4 drop-shadow-md text-balance">{roundTitles[initialRound - 1]}</p>
      <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 max-w-xs text-balance">{roundDescriptions[initialRound - 1]}</p>
      <Button
        onClick={startTurn}
        className="mt-12 h-20 w-full text-3xl font-bold text-white rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: initialTeam.color }}
      >
        {t('game.start')}
      </Button>
    </m.div>
  );
};
const PlayingScreen = () => {
  const {
    currentWord, timeLeft, handleCorrect, handlePass, tick,
    lastGuessedWord, lastPassedWord, undoLastAction, endTurn,
    resetGame, turnDuration, gameStatus, unseenWords,
    isPaused, setIsPaused, theme, teams, currentTeamIndex
  } = useGameStore(useShallow((state) => ({
    currentWord: state.currentWord,
    timeLeft: state.timeLeft,
    handleCorrect: state.handleCorrect,
    handlePass: state.handlePass,
    tick: state.tick,
    lastGuessedWord: state.lastGuessedWord,
    lastPassedWord: state.lastPassedWord,
    undoLastAction: state.undoLastAction,
    endTurn: state.endTurn,
    resetGame: state.resetGame,
    turnDuration: state.turnDuration,
    gameStatus: state.gameStatus,
    unseenWords: state.unseenWords,
    isPaused: state.isPaused,
    setIsPaused: state.setIsPaused,
    theme: state.theme,
    teams: state.teams,
    currentTeamIndex: state.currentTeamIndex,
  })));

  const { t } = useTranslations();
  const navigate = useNavigate();
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [isActionLocked, setIsActionLocked] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameStatus === 'playing' && !isEndGameModalOpen && !isPaused) {
      timer = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [tick, gameStatus, isEndGameModalOpen, isPaused]);

  useEffect(() => {
    const handlePause = () => {
      if (gameStatus === 'playing' && !isEndGameModalOpen) {
        setIsPaused('visibility');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handlePause();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handlePause);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handlePause);
    };
  }, [gameStatus, isEndGameModalOpen, setIsPaused]);
  useEffect(() => {
    if (timeLeft <= 0 && gameStatus === 'playing') {
      endTurn();
    }
  }, [timeLeft, endTurn, gameStatus]);
  const { language, getLocalizedPath } = useTranslations();

  const handleConfirmEndGame = () => {
    resetGame();
    navigate(`/${language}`);
  };

  const handleActionClick = (action: 'pass' | 'correct') => {
    if (!isActionLocked) {
      if (action === 'pass') {
        handlePass();
      } else {
        handleCorrect();
      }
      setIsActionLocked(true);
      setTimeout(() => setIsActionLocked(false), 1200);
    }
  };

  const handleTimerClick = () => {
    if (!isActionLocked && !isEndGameModalOpen && !isPaused && currentWord && unseenWords.length > 0) {
      // Skip current word
      handleActionClick('pass');
      // Pause the game (this opens the modal)
      setIsPaused('manual');
    }
  };

  const currentTeam = teams[currentTeamIndex];

  const undoBgStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    if (currentTeam) {
      const lightness = theme === 'dark' ? 15 : 95;
      style.backgroundColor = `hsl(${hexToHsl(currentTeam.color, lightness)})`;
    }
    return style;
  }, [currentTeam, theme]);

  if (!currentTeam) return null;

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full max-w-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEndGameModalOpen(true)}
        className="absolute top-0 right-0 h-12 w-12 rounded-full text-slate-800 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10"
        aria-label="End Game"
      >
        <LogOut className="w-6 h-6" />
      </Button>
      <TimerCircle
        timeLeft={timeLeft}
        duration={turnDuration}
        color={currentTeam.color}
        className="w-32 h-32"
        isPaused={isEndGameModalOpen || !!isPaused}
        onClick={handleTimerClick}
      />
      <div className="flex-grow flex items-center justify-center w-full my-6">
        <AnimatePresence mode="wait">
          {currentWord ? (
            <WordCard key={currentWord.term} word={currentWord} />
          ) : (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 text-balance">{t('game.noMoreWords')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-balance">{t('game.noMoreWordsDesc')}</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative grid grid-cols-2 gap-4 w-full">
        <Button
          onClick={() => handleActionClick('pass')}
          disabled={!currentWord || isActionLocked || unseenWords.length === 0 || isEndGameModalOpen || !!isPaused}
          className="h-24 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl shadow-lg text-3xl font-bold"
        >
          <X className="w-12 h-12" />
        </Button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <Button
            onClick={undoLastAction}
            disabled={(!lastGuessedWord && !lastPassedWord) || isEndGameModalOpen || !!isPaused}
            variant="outline"
            className="h-14 w-14 rounded-full border-0 disabled:hidden z-20 pointer-events-auto shadow-md"
            style={undoBgStyle}
            aria-label="Undo last action"
          >
            <Undo2 className="w-6 h-6" />
          </Button>
        </div>
        <Button
          onClick={() => handleActionClick('correct')}
          disabled={!currentWord || isActionLocked || isEndGameModalOpen || !!isPaused}
          className="h-24 bg-green-500 hover:bg-green-600 text-white rounded-3xl shadow-lg text-3xl font-bold"
        >
          <Check className="w-12 h-12" />
        </Button>
      </div>
      <EndGameModal
        isOpen={isEndGameModalOpen}
        onClose={() => setIsEndGameModalOpen(false)}
        onConfirm={handleConfirmEndGame}
      />
      <VisibilityPauseModal
        isOpen={!!isPaused}
        pauseReason={isPaused}
        onContinue={() => setIsPaused(false)}
      />
    </div>
  );
};
export function GamePage() {
  const gameStatus = useGameStore(useShallow((state) => state.gameStatus));
  const teams = useGameStore(useShallow((state) => state.teams));
  const currentTeamIndex = useGameStore(useShallow((state) => state.currentTeamIndex));
  const navigate = useNavigate();
  const { language, getLocalizedPath } = useTranslations();
  useEffect(() => {
    if (gameStatus === 'game-over') {
      navigate(getLocalizedPath('score'));
    }
  }, [gameStatus, navigate, getLocalizedPath]);
  const theme = useGameStore((state) => state.theme);
  const dynamicBgStyle = useMemo(() => {
    if ((gameStatus === 'get-ready' || gameStatus === 'playing') && teams.length > 0 && teams[currentTeamIndex]) {
      const currentTeamColor = teams[currentTeamIndex].color;
      const lightness = theme === 'dark' ? 15 : 95;
      return { backgroundColor: `hsl(${hexToHsl(currentTeamColor, lightness)})` };
    }
    return {};
  }, [gameStatus, teams, currentTeamIndex, theme]);
  return (
    <div
      className="flex flex-col items-center justify-center h-screen-dvh bg-transparent p-6 transition-colors duration-300 overflow-hidden"
      style={dynamicBgStyle}
    >
      <AnimatePresence mode="wait">
        {gameStatus === 'get-ready' && <GetReadyScreen key="get-ready" />}
        {gameStatus === 'playing' && <PlayingScreen key="playing" />}
        {gameStatus === 'turn-summary' && <TurnSummaryScreen key="turn-summary" />}
      </AnimatePresence>
    </div>
  );
}