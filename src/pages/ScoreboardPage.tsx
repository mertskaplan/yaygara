import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Home } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
export function ScoreboardPage() {
  const teams = useGameStore((state) => state.teams);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const resetGame = useGameStore((state) => state.resetGame);
  const navigate = useNavigate();
  const { t } = useTranslations();
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = gameStatus === 'game-over' ? sortedTeams[0] : null;
  const handleNext = () => {
    resetGame();
    navigate('/');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <main className="w-full max-w-md space-y-10">
        {winner ? (
          <motion.div
            initial={{ scale: 0.5, y: -100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="w-32 h-32 text-amber-400 drop-shadow-lg" />
              </motion.div>
              <div className="absolute -top-4 -right-4 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">WINNER!</div>
            </div>
            <div className="space-y-2">
              <h1 className="text-6xl font-black text-slate-800 font-display tracking-tight leading-none">
                {t('scoreboard.winnerTitle', { teamName: winner.name })}
              </h1>
              <p className="text-xl text-slate-500 font-medium">Champion Performance!</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-800 font-display">{t('scoreboard.scoresTitle')}</h1>
            <p className="text-slate-500">How did everyone do?</p>
          </div>
        )}
        <motion.div
          className="space-y-3 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }}
        >
          {sortedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-5 rounded-3xl shadow-lg text-white border-b-4 border-black/10 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: team.color }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl">
                  {index + 1}
                </div>
                <span className="text-2xl font-black tracking-tight">{team.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-black font-display leading-none">{team.score}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">points</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="space-y-4 pt-6">
          <Button
            onClick={handleNext}
            className="w-full h-18 text-2xl font-black bg-sky-500 hover:bg-sky-600 text-white rounded-3xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {t('scoreboard.playAgain')}
            <ArrowRight className="ml-3 h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleNext}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </main>
      {/* Background decoration elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden opacity-10">
        <div className="absolute top-10 left-[10%] w-24 h-24 bg-sky-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[15%] w-32 h-32 bg-amber-400 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}