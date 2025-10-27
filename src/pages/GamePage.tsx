import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Undo2, LogOut } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/components/WordCard';
import { TimerCircle } from '@/components/TimerCircle';
import { useTranslations } from '@/hooks/useTranslations';
import { TurnSummaryScreen } from '@/components/TurnSummaryScreen';
import { EndGameModal } from '@/components/EndGameModal';
import { hexToHsl } from '@/lib/utils';
const TURN_DURATION = 45;
const GetReadyScreen = () => {
  const { teams, currentTeamIndex, round, startTurn, bonusTime } = useGameStore(
    useShallow((state) => ({
      teams: state.teams,
      currentTeamIndex: state.currentTeamIndex,
      round: state.round,
      startTurn: state.startTurn,
      bonusTime: state.bonusTime,
    }))
  );
  const { t } = useTranslations();
  const currentTeam = teams[currentTeamIndex];
  const roundTitles = [t('game.round1'), t('game.round2'), t('game.round3')];
  const roundDescriptions = [t('game.round1Description'), t('game.round2Description'), t('game.round3Description')];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-3xl shadow-xl w-full max-w-md"
    >
      <h1 className="text-5xl font-extrabold font-display drop-shadow-lg" style={{ color: currentTeam.color }}>
        {bonusTime ? t('game.bonusTurnTitle') : t('game.getReadyTitle', { teamName: currentTeam.name })}
      </h1>
      {bonusTime ? (
        <p className="text-lg text-slate-500 mt-2 max-w-xs">
          {t('game.bonusTurnDescription', { round, time: bonusTime })}
        </p>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-700 mt-4 drop-shadow-md">{roundTitles[round - 1]}</p>
          <p className="text-lg text-slate-500 mt-2 max-w-xs">{roundDescriptions[round - 1]}</p>
        </>
      )}
      <Button
        onClick={startTurn}
        className="mt-12 h-20 w-full text-3xl font-bold text-white rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: currentTeam.color }}
      >
        {t('game.start')}
      </Button>
    </motion.div>
  );
};
const PlayingScreen = () => {
  const { currentWord, timeLeft, handleCorrect, handlePass, tick, lastGuessedWord, lastPassedWord, undoLastAction, endTurn, resetGame } = useGameStore(
    useShallow((state) => ({
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
    }))
  );
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [tick]);
  useEffect(() => {
    if (timeLeft <= 0) {
      endTurn();
    }
  }, [timeLeft, endTurn]);
  const handleConfirmEndGame = () => {
    resetGame();
    navigate('/');
  };
  return (
    <div className="relative flex flex-col items-center justify-between h-full-vh w-full max-w-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEndGameModalOpen(true)}
        className="absolute top-0 right-0 h-12 w-12 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600"
        aria-label="End Game"
      >
        <LogOut className="w-6 h-6" />
      </Button>
      <TimerCircle timeLeft={timeLeft} duration={TURN_DURATION} className="w-32 h-32" />
      <div className="flex-grow flex items-center justify-center w-full my-6">
        <AnimatePresence mode="wait">
          {currentWord ? (
            <WordCard key={currentWord.term} word={currentWord} />
          ) : (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center">
              <h2 className="text-3xl font-bold text-slate-700">{t('game.noMoreWords')}</h2>
              <p className="text-slate-500">{t('game.noMoreWordsDesc')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative grid grid-cols-2 gap-4 w-full">
        <Button
          onClick={handlePass}
          disabled={!currentWord}
          className="h-24 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl shadow-lg text-3xl font-bold"
        >
          <X className="w-12 h-12" />
        </Button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <Button
            onClick={undoLastAction}
            disabled={!lastGuessedWord && !lastPassedWord}
            variant="outline"
            className="h-14 w-14 rounded-full bg-white/80 backdrop-blur-sm border-2 disabled:opacity-50 pointer-events-auto"
            aria-label="Undo last action"
          >
            <Undo2 className="w-6 h-6" />
          </Button>
        </div>
        <Button
          onClick={handleCorrect}
          disabled={!currentWord}
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
    </div>
  );
};
export function GamePage() {
  const { gameStatus, teams, currentTeamIndex } = useGameStore(
    useShallow((state) => ({
      gameStatus: state.gameStatus,
      teams: state.teams,
      currentTeamIndex: state.currentTeamIndex,
    }))
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (gameStatus === 'game-over') {
      navigate('/score');
    }
    if (gameStatus === 'setup') {
      navigate('/setup');
    }
  }, [gameStatus, navigate]);
  const dynamicBgStyle = useMemo(() => {
    if ((gameStatus === 'get-ready' || gameStatus === 'playing') && teams.length > 0) {
      const currentTeamColor = teams[currentTeamIndex].color;
      return { backgroundColor: `hsl(${hexToHsl(currentTeamColor)})` };
    }
    return {};
  }, [gameStatus, teams, currentTeamIndex]);
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background p-6 transition-colors duration-500"
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