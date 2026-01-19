import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowLeft, Users, Palette, BookOpen, Upload, Check, Loader2, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useGameStore, TEAM_COLORS } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import type { Deck } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
import { AIDeckConstructorModal } from '@/components/AIDeckConstructorModal';
const containerVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  exit: { opacity: 0, x: -100, transition: { ease: 'easeInOut' } },
};
const TeamCountSelection = () => {
  const setTeamCount = useGameStore((state) => state.setTeamCount);
  const { t, translations } = useTranslations();
  const handleTeamSelect = (count: number) => {
    const nameParts = translations?.teamNameGeneration || { adjectives: ['Team'], nouns: [`${count}`] };
    setTeamCount(count, nameParts);
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center text-slate-700 dark:text-slate-200 font-display mb-6">{t('setup.teamsTitle')}</h2>
      <div className="flex-1 flex flex-col justify-center gap-4">
        {[2, 3, 4].map((count) => (
          <Button key={count} onClick={() => handleTeamSelect(count)} className="h-24 text-4xl font-extrabold bg-white dark:bg-sky-500 text-sky-500 dark:text-white border-4 border-sky-500 hover:bg-sky-100 dark:hover:bg-sky-600 rounded-2xl shadow-lg">
            {count}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
const TeamCustomization = () => {
  const teams = useGameStore((state) => state.teams);
  const updateTeam = useGameStore((state) => state.updateTeam);
  const setSetupStep = useGameStore((state) => state.setSetupStep);
  const regenerateTeamName = useGameStore((state) => state.regenerateTeamName);
  const { t, language, translations } = useTranslations();
  const [rotations, setRotations] = useState<Record<number, number>>({});
  // Ref to track the language names were last generated for to avoid loops
  const lastProcessedLanguageRef = useRef<string | null>(null);
  useEffect(() => {
    const nameParts = translations?.teamNameGeneration;
    if (!nameParts || !language) return;
    // Only run the initialization logic if the language has actually changed
    if (lastProcessedLanguageRef.current === language) return;

    // Get current teams snapshot to avoid dependency
    const currentTeams = useGameStore.getState().teams;
    const usedNames = new Set(currentTeams.filter(t => t.isNameCustomized).map(t => t.name));

    currentTeams.forEach(team => {
      if (!team.isNameCustomized) {
        let name = '';
        do {
          const adj = nameParts.adjectives[Math.floor(Math.random() * nameParts.adjectives.length)];
          const noun = nameParts.nouns[Math.floor(Math.random() * nameParts.nouns.length)];
          name = `${adj} ${noun}`;
        } while (usedNames.has(name));
        usedNames.add(name);
        updateTeam(team.id, name, team.color);
      }
    });
    lastProcessedLanguageRef.current = language;
  }, [language, translations?.teamNameGeneration, updateTeam]);
  const handleRegenerateName = (teamId: number) => {
    const nameParts = translations?.teamNameGeneration;
    if (!nameParts) return;
    regenerateTeamName(teamId, nameParts);
    setRotations(prev => ({
      ...prev,
      [teamId]: (prev[teamId] || 0) + 360,
    }));
  };
  const usedColors = teams.map(t => t.color);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center text-slate-700 dark:text-slate-200 font-display mb-6">{t('setup.customizeTitle')}</h2>
      <div className="h-setup-content space-y-6 p-1">
        {teams.map((team) => {
          const otherTeamsColors = usedColors.filter(c => c !== team.color);
          return (
            <div key={team.id} className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
              <div className="relative w-full">
                <Input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, e.target.value, team.color)}
                  className="w-full h-14 text-xl font-bold border-2 focus:ring-2 focus:ring-offset-2 rounded-xl px-4 pr-12 transition-all"
                  style={{
                    color: team.color,
                    borderColor: team.color,
                    boxShadow: `0 0 0 2px transparent`
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${team.color}44`)}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 rounded-lg hover:bg-slate-50"
                  onClick={() => handleRegenerateName(team.id)}
                  aria-label="Generate new random name"
                >
                  <motion.div animate={{ rotate: rotations[team.id] || 0 }} transition={{ duration: 0.5 }}>
                    <RefreshCw className="w-5 h-5" style={{ color: team.color }} />
                  </motion.div>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                {TEAM_COLORS.map(color => {
                  const isTaken = otherTeamsColors.includes(color);
                  const isSelected = team.color === color;
                  return (
                    <button
                      key={color}
                      onClick={() => !isTaken && updateTeam(team.id, team.name, color)}
                      className={cn(
                        'w-9 h-9 rounded-full transition-all flex items-center justify-center ring-offset-2 relative',
                        isTaken ? 'opacity-20 cursor-not-allowed scale-90' : 'hover:scale-110 active:scale-95 cursor-pointer'
                      )}
                      style={{
                        backgroundColor: color,
                        boxShadow: isSelected ? `0 0 0 3px white, 0 0 0 6px ${color}` : 'none'
                      }}
                      disabled={isTaken}
                      aria-label={`Select color ${color}`}
                    >
                      {isSelected && <Check className="w-6 h-6 text-white drop-shadow-sm" />}
                      {isTaken && !isSelected && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[2px] bg-white/50 rotate-45" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <Button onClick={() => setSetupStep('deck')} className="w-full h-14 text-lg font-bold bg-sky-500 hover:bg-sky-600 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]">
          {t('setup.continue')}
        </Button>
      </div>
    </motion.div>
  );
};
const deckFilenames = ['baslangic.tr.json', 'zihin-acici.tr.json', 'karanlik-seruven.tr.json', 'uygarligin-izleri.tr.json', 'argo.tr.json'];
const DeckSelection = () => {
  const language = useGameStore((state) => state.language);
  const selectDeck = useGameStore((state) => state.selectDeck);
  const selectedDeck = useGameStore((state) => state.selectedDeck);
  const setSetupStep = useGameStore((state) => state.setSetupStep);
  const customDeck = useGameStore((state) => state.customDeck);
  const setCustomDeck = useGameStore((state) => state.setCustomDeck);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { t } = useTranslations();
  useEffect(() => {
    const fetchDecks = async () => {
      setIsLoadingDecks(true);
      try {
        const allDecks = await Promise.all(
          deckFilenames.map(async (filename) => {
            try {
              const res = await fetch(`/decks/${filename}`);
              if (!res.ok) throw new Error(`Failed to fetch deck: ${filename}`);
              const deckData: Deck = await res.json();
              return deckData;
            } catch (error) {
              console.error(error);
              return null;
            }
          })
        );
        const validDecks = allDecks.filter((deck): deck is Deck => deck !== null);
        setDecks(validDecks.filter(deck => deck.language === language));
      } catch (error) {
        console.error("Failed to fetch decks", error);
      } finally {
        setIsLoadingDecks(false);
      }
    };
    fetchDecks();
  }, [language]);
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedDeck = JSON.parse(content);
        if (Array.isArray(parsedDeck.words)) {
          const newDeck: Deck = {
            id: `custom-${Date.now()}`,
            name: parsedDeck.name || file.name.replace('.json', ''),
            language: language,
            words: parsedDeck.words,
            difficulty: parsedDeck.difficulty || 'medium',
          };
          setCustomDeck(newDeck);
        } else {
          alert('Invalid deck format. Make sure it has a "words" array.');
        }
      } catch (error) {
        alert('Failed to parse JSON file.');
        console.error("JSON parsing error:", error);
      }
    };
    reader.readAsText(file);
  };
  const handleContinue = () => {
    if (!selectedDeck) return;
    setSetupStep('word-count');
  };
  const DeckButton = ({ deck, icon: Icon }: { deck: Deck, icon: React.ElementType }) => {
    const wordCount = deck.words?.length || 0;
    const isSelected = selectedDeck?.id === deck.id;
    const difficultyFactor = {
      easy: 4,
      medium: 3,
      hard: 2,
    }[deck.difficulty] || 3;
    const estimatedTime = Math.round((wordCount * 3) / difficultyFactor);
    return (
      <Button
        onClick={() => selectDeck(deck)}
        variant={isSelected ? 'default' : 'outline'}
        className={`w-full h-auto text-left font-semibold rounded-2xl p-3 flex items-center gap-3 transition-all duration-300 ${isSelected ? 'bg-sky-500 text-white scale-[1.02] shadow-md border-transparent' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700'}`}
      >
        <div className={cn("p-2 rounded-xl", isSelected ? "bg-white/20" : "bg-sky-50 dark:bg-sky-900/40 text-sky-500 dark:text-sky-400")}>
          <Icon className="w-8 h-8 flex-shrink-0" />
        </div>
        <div className="flex-grow">
          <p className="text-lg truncate">{deck.name}</p>
          <div className={`flex items-center gap-2 text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
            <span>{t('setup.deckWords', { count: wordCount })}</span>
            <span>&bull;</span>
            <span>{t(`deckDifficulty.${deck.difficulty}`)}</span>
            <span>&bull;</span>
            <span>{t('setup.estimatedTime', { time: estimatedTime })}</span>
          </div>
        </div>
      </Button>
    );
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center text-slate-700 dark:text-slate-200 font-display mb-6">{t('setup.deckTitle')}</h2>
      <div className="h-setup-content space-y-3 p-1">
        {isLoadingDecks ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
          </div>
        ) : (
          <>
            {decks.map((deck) => <DeckButton key={deck.id} deck={deck} icon={BookOpen} />)}
            {customDeck && <DeckButton key={customDeck.id} deck={customDeck} icon={Upload} />}
          </>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        <Button onClick={handleFileUploadClick} variant="outline" className="w-full h-16 text-lg justify-start font-semibold rounded-2xl bg-white/80 dark:bg-slate-800/80 border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20">
          <Upload className="mr-4 text-sky-500" /> {t('setup.uploadDeck')}
        </Button>
        {/* AI Deck Constructor Link */}
        <div className="flex justify-center mt-2">
          <Button
            variant="link"
            className="text-slate-500 dark:text-slate-400 text-base font-semibold"
            onClick={() => setIsAIModalOpen(true)}
          >
            {t('setup.createWithAI')}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <Button onClick={handleContinue} disabled={!selectedDeck} className="w-full h-14 text-lg font-bold bg-sky-500 hover:bg-sky-600 rounded-2xl disabled:bg-slate-300 shadow-lg">
          {t('setup.continue')}
        </Button>
      </div>
      <AIDeckConstructorModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </motion.div>
  );
};
const WordCountSelection = () => {
  const selectedDeck = useGameStore((state) => state.selectedDeck);
  const setWordCount = useGameStore((state) => state.setWordCount);
  const startGame = useGameStore((state) => state.startGame);
  const turnDuration = useGameStore((state) => state.turnDuration);
  const setTurnDuration = useGameStore((state) => state.setTurnDuration);
  const navigate = useNavigate();
  const { t } = useTranslations();
  const maxWords = selectedDeck?.words?.length || 5;
  const minWords = Math.min(5, maxWords);
  const [count, setCount] = useState(maxWords);
  useEffect(() => {
    if (selectedDeck) {
      setCount(selectedDeck.words?.length || 5);
    }
  }, [selectedDeck]);
  if (!selectedDeck || !selectedDeck.words) {
    return null;
  }
  const handleStartGame = () => {
    setWordCount(count);
    startGame(selectedDeck.words!);
    navigate('/play');
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center text-slate-700 dark:text-slate-200 font-display mb-6">{t('setup.wordCountTitle')}</h2>
      <div className="h-setup-content space-y-4 p-1">
        <div className="space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-center px-4">{t('setup.wordCountDescription')}</p>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-md space-y-3 border border-slate-100 dark:border-slate-700">
            <div className="text-center">
              <span className="text-5xl font-black text-sky-500 dark:text-sky-400 font-display drop-shadow-sm">{count}</span>
              <p className="text-slate-400 dark:text-slate-500 tracking-widest text-xs">{t('setup.deckWords', { count: '' }).trim()}</p>
            </div>
            <Slider
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
              min={minWords}
              max={maxWords}
              step={1}
            />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-center px-4">{t('setup.turnDurationDescription')}</p>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-md space-y-3 border border-slate-100 dark:border-slate-700">
            <div className="text-center">
              <span className="text-5xl font-black text-sky-500 dark:text-sky-400 font-display drop-shadow-sm">{turnDuration}</span>
              <p className="text-slate-400 dark:text-slate-500 tracking-widest text-xs">{t('setup.seconds')}</p>
            </div>
            <Slider
              value={[turnDuration]}
              onValueChange={(value) => setTurnDuration(value[0])}
              min={15}
              max={90}
              step={5}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Button onClick={handleStartGame} className="w-full h-16 text-xl font-bold bg-green-500 hover:bg-green-600 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]">
          {t('setup.play')}
        </Button>
      </div>
    </motion.div>
  );
};
const STEPS: { [key: string]: { component: React.FC, icon: React.FC<any> } } = {
  teams: { component: TeamCountSelection, icon: Users },
  customize: { component: TeamCustomization, icon: Palette },
  deck: { component: DeckSelection, icon: BookOpen },
  'word-count': { component: WordCountSelection, icon: Clock },
};
export function SetupPage() {
  const setupStep = useGameStore((state) => state.setupStep);
  const setSetupStep = useGameStore((state) => state.setSetupStep);
  const resetSetup = useGameStore((state) => state.resetSetup);
  const navigate = useNavigate();
  const handleBack = () => {
    if (setupStep === 'teams') {
      resetSetup();
      navigate('/');
    } else if (setupStep === 'customize') {
      setSetupStep('teams');
    } else if (setupStep === 'deck') {
      setSetupStep('customize');
    } else if (setupStep === 'word-count') {
      setSetupStep('deck');
    }
  };
  const CurrentStepComponent = STEPS[setupStep].component;
  const stepKeys = Object.keys(STEPS);
  const currentStepIndex = stepKeys.indexOf(setupStep);
  return (
    <div className="flex flex-col items-center h-[100dvh] bg-background p-6 overflow-hidden">
      <div className="w-full max-w-md h-full flex flex-col">
        <header className="relative flex-shrink-0 flex items-center justify-center mb-8">
          <Button onClick={handleBack} variant="ghost" size="icon" className="absolute left-0 rounded-full h-12 w-12 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center justify-center gap-3">
            {stepKeys.map((key, index) => {
              const Icon = STEPS[key].icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              return (
                <div key={key} className={`p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-sky-500 text-white scale-110 shadow-lg' : isCompleted ? 'bg-green-400 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
              );
            })}
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center min-h-0">
          <AnimatePresence mode="wait">
            <CurrentStepComponent key={setupStep} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}