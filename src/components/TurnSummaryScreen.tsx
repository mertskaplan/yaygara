import React, { useState } from 'react';
import { m } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { CheckCircle, Hourglass, Trophy } from 'lucide-react';
export const TurnSummaryScreen: React.FC = () => {
  const {
    teams,
    currentTeamIndex,
    wordsGuessedThisTurn,
    unseenWords,
    proceedToNextTurn,
    turnEndReason,
    bonusTime,
    round,
  } = useGameStore(
    useShallow((state) => ({
      teams: state.teams,
      currentTeamIndex: state.currentTeamIndex,
      wordsGuessedThisTurn: state.wordsGuessedThisTurn,
      unseenWords: state.unseenWords,
      proceedToNextTurn: state.proceedToNextTurn,
      turnEndReason: state.turnEndReason,
      bonusTime: state.bonusTime,
      round: state.round,
    }))
  );
  const { t } = useTranslations();
  const [initialTeam] = useState(teams[currentTeamIndex]);
  const [initialBonusTime] = useState(bonusTime);
  const [initialRound] = useState(round);
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  return (
    <m.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-md"
    >
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-balance">
        {initialBonusTime ? t('game.bonusTurnTitle') : (
          turnEndReason === 'words-exhausted'
            ? t('game.turnSummary.wordsExhaustedTitle')
            : t('game.turnSummary.subtitle')
        )}
      </h1>
      <p className="text-xl text-slate-500 dark:text-slate-400 mt-1 text-balance">
        {initialBonusTime
          ? t('game.bonusTurnDescription', { round: initialRound + 1, time: initialBonusTime })
          : t('game.turnSummary.title', { teamName: initialTeam.name })}
      </p>
      <div className="grid grid-cols-2 gap-4 w-full my-3">
        <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/40 rounded-2xl">
          <span className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">{t('game.turnSummary.guessedThisTurn')}</span>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-4xl font-extrabold text-green-700 dark:text-green-200">
              {wordsGuessedThisTurn.length}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center p-4 bg-sky-100 dark:bg-sky-900/40 rounded-2xl">
          <span className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-1">{t('game.turnSummary.wordsLeft')}</span>
          <div className="flex items-center gap-3">
            <Hourglass className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            <span className="text-4xl font-extrabold text-sky-700 dark:text-sky-200">
              {unseenWords.length}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full space-y-3">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">{t('scoreboard.scoresTitle')}</h3>
        {sortedTeams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-white"
            style={{ backgroundColor: team.color }}
          >
            <div className="flex items-center gap-3">
              {index === 0 ? <Trophy className="w-5 h-5 text-amber-300" /> : <span className="font-bold w-5 text-center">{index + 1}.</span>}
              <span className="font-bold text-lg text-balance">{team.name}</span>
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-2xl font-extrabold font-display leading-none">{team.score}</span>
              <span className="text-[12px] font-bold tracking-widest opacity-80 ">{t('scoreboard.score')}</span>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={proceedToNextTurn}
        className="mt-8 h-16 w-full text-xl font-bold bg-sky-500 hover:bg-sky-600 rounded-2xl shadow-lg"
      >
        {t('game.turnSummary.continue')}
      </Button>
    </m.div>
  );
};