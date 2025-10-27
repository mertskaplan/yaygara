import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
export function ScoreboardPage() {
  const { teams, gameStatus, resetGame } = useGameStore(
    useShallow((state) => ({
      teams: state.teams,
      gameStatus: state.gameStatus,
      resetGame: state.resetGame,
    }))
  );
  const navigate = useNavigate();
  const { t } = useTranslations();
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = gameStatus === 'game-over' ? sortedTeams[0] : null;
  const handleNext = () => {
    if (gameStatus === 'game-over') {
      resetGame();
      navigate('/');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <main className="w-full max-w-md space-y-8">
        {winner ? (
          <motion.div
            initial={{ scale: 0.5, y: -100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="flex flex-col items-center space-y-4"
          >
            <Trophy className="w-24 h-24 text-amber-400" />
            <h1 className="text-5xl font-extrabold text-slate-800 font-display">
              {t('scoreboard.winnerTitle', { teamName: winner.name })}
            </h1>
          </motion.div>
        ) : (
          <h1 className="text-5xl font-extrabold text-slate-800 font-display">{t('scoreboard.scoresTitle')}</h1>
        )}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }}
        >
          {sortedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 rounded-2xl shadow-md text-white"
              style={{ backgroundColor: team.color }}
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold w-8">{index + 1}.</span>
                <span className="text-2xl font-bold">{team.name}</span>
              </div>
              <span className="text-3xl font-extrabold font-display">{team.score}</span>
            </motion.div>
          ))}
        </motion.div>
        <Button
          onClick={handleNext}
          className="w-full h-16 text-xl font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg"
        >
          {t('scoreboard.playAgain')}
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </main>
    </div>
  );
}