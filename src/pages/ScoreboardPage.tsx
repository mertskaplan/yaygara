import React from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { Trophy, ArrowRight, Home } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
export function ScoreboardPage() {
  const teams = useGameStore(useShallow((state) => state.teams));
  const gameStatus = useGameStore(useShallow((state) => state.gameStatus));
  const resetGame = useGameStore(useShallow((state) => state.resetGame));
  const navigate = useNavigate();
  const { language, t } = useTranslations();
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = gameStatus === 'game-over' ? sortedTeams[0] : null;
  const handleBackToHome = () => {
    resetGame();
    navigate(`/${language}`);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen-dvh bg-transparent p-6 text-center overflow-hidden">
      <main className="w-full max-w-md space-y-8">
        {winner ? (
          <m.div
            initial={{ scale: 0.5, y: -100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="flex flex-col items-center space-y-4"
          >
            <Trophy className="w-20 h-20 text-amber-400" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-balance">
              {t('scoreboard.winnerTitle', { teamName: winner.name })}
            </h2>
          </m.div>
        ) : (
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-balance">{t('scoreboard.scoresTitle')}</h1>
        )}
        <m.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }}
        >
          {sortedTeams.map((team, index) => (
            <m.div
              key={team.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 rounded-2xl shadow-md text-white"
              style={{ backgroundColor: team.color }}
            >
              <div className="flex items-center">
                {index === 0 ? <Trophy className="w-5 h-5 text-amber-300 ml-1 mr-2" /> : <span className="text-[1.375rem] font-bold w-8">{index + 1}.</span>}
                <span className="text-[1.375rem] font-bold text-balance">{team.name}</span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="text-2xl font-extrabold font-display leading-none">{team.score}</span>
                <span className="text-[12px] font-bold tracking-widest opacity-80 ">{t('scoreboard.score')}</span>
              </div>
            </m.div>
          ))}
        </m.div>
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            {t('scoreboard.backToHome')}
          </Button>
        </div>
      </main>
    </div>
  );
}
