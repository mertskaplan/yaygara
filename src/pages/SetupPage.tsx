import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowLeft, Users, Palette, BookOpen, Upload, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore, TEAM_COLORS } from '@/stores/useGameStore';
import { useShallow } from 'zustand/react/shallow';
import type { Deck } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-700 font-display">{t('setup.teamsTitle')}</h2>
      <div className="grid grid-cols-1 gap-4">
        {[2, 3, 4].map((count) => (
          <Button key={count} onClick={() => handleTeamSelect(count)} className="h-24 text-4xl font-extrabold bg-white text-sky-500 border-4 border-sky-500 hover:bg-sky-100 rounded-2xl shadow-lg">
            {count}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
const TeamCustomization = () => {
  const { teams, updateTeam, setSetupStep } = useGameStore(
    useShallow((state) => ({ teams: state.teams, updateTeam: state.updateTeam, setSetupStep: state.setSetupStep }))
  );
  const { t, language, translations } = useTranslations();
  useEffect(() => {
    const nameParts = translations?.teamNameGeneration;
    if (!nameParts) return;
    const usedNames = new Set(teams.filter(t => t.isNameCustomized).map(t => t.name));
    teams.forEach(team => {
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
  }, [language, translations, teams, updateTeam]);
  const usedColors = teams.map(t => t.color);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-700 font-display">{t('setup.customizeTitle')}</h2>
      <div className="space-y-6 h-setup-content overflow-y-auto p-1">
        {teams.map((team) => {
          const otherTeamsColors = usedColors.filter(c => c !== team.color);
          return (
            <div key={team.id} className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md">
              <Input
                type="text"
                value={team.name}
                onChange={(e) => updateTeam(team.id, e.target.value, team.color)}
                className={cn(
                  "w-full h-14 text-xl font-bold border-2 focus:ring-2 focus:ring-offset-2 rounded-xl px-4",
                  `focus:ring-[${team.color}]`
                )}
                style={{ color: team.color, borderColor: team.color }}
              />
              <div className="flex flex-wrap gap-3 pt-2">
                {TEAM_COLORS.map(color => {
                  const isTaken = otherTeamsColors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => updateTeam(team.id, team.name, color)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-transform hover:scale-110 ring-offset-2',
                        isTaken ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2',
                        team.color === color ? 'ring-2' : '',
                        `hover:ring-[${color}]`,
                        team.color === color ? `ring-[${color}]` : ''
                      )}
                      style={{ backgroundColor: color }}
                      disabled={isTaken}
                      aria-label={`Select color ${color}`}
                    >
                      {team.color === color && <Check className="w-5 h-5 text-white m-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Button onClick={() => setSetupStep('deck')} className="w-full h-14 text-lg font-bold bg-sky-500 hover:bg-sky-600 rounded-2xl">
        {t('setup.continue')}
      </Button>
    </motion.div>
  );
};
const deckFilenames = ['animals.en.json', 'objects.en.json', 'food.tr.json', 'places.tr.json'];
const DeckSelection = () => {
  const { language, selectDeck, selectedDeck, startGame, customDeck, setCustomDeck } = useGameStore(
    useShallow((state) => ({
      language: state.language,
      selectDeck: state.selectDeck,
      selectedDeck: state.selectedDeck,
      startGame: state.startGame,
      customDeck: state.customDeck,
      setCustomDeck: state.setCustomDeck,
    }))
  );
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const handleStartGame = () => {
    if (!selectedDeck || !selectedDeck.words) {
      alert(`Error: Deck "${selectedDeck?.name}" has no words or is invalid.`);
      return;
    }
    startGame(selectedDeck.words);
    navigate('/play');
  };
  const DeckButton = ({ deck, icon: Icon }: { deck: Deck, icon: React.ElementType }) => {
    const wordCount = deck.words?.length || 0;
    const isSelected = selectedDeck?.id === deck.id;
    return (
      <Button
        onClick={() => selectDeck(deck)}
        variant={isSelected ? 'default' : 'outline'}
        className={`w-full h-auto text-left font-semibold rounded-2xl p-4 flex items-center gap-4 ${isSelected ? 'bg-sky-500 text-white' : 'bg-white'}`}
      >
        <Icon className="w-8 h-8 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-lg truncate">{deck.name}</p>
          <div className={`flex items-center gap-2 text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
            <span>{t('setup.deckWords', { count: wordCount })}</span>
            <span>&bull;</span>
            <span>{t(`deckDifficulty.${deck.difficulty}`)}</span>
          </div>
        </div>
      </Button>
    );
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-700 font-display">{t('setup.deckTitle')}</h2>
      <div className="space-y-3 h-setup-content overflow-y-auto p-1">
        {isLoadingDecks ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : (
          <>
            {decks.map((deck) => <DeckButton key={deck.id} deck={deck} icon={BookOpen} />)}
            {customDeck && <DeckButton key={customDeck.id} deck={customDeck} icon={Upload} />}
          </>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        <Button onClick={handleFileUploadClick} variant="outline" className="w-full h-16 text-lg justify-start font-semibold rounded-2xl bg-white/80 border-dashed">
          <Upload className="mr-4" /> {t('setup.uploadDeck')}
        </Button>
      </div>
      <Button onClick={handleStartGame} disabled={!selectedDeck} className="w-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 rounded-2xl disabled:bg-slate-300">
        {t('setup.completeAndPlay')}
      </Button>
    </motion.div>
  );
};
const STEPS: { [key: string]: { component: React.FC, icon: React.FC<any> } } = {
  teams: { component: TeamCountSelection, icon: Users },
  customize: { component: TeamCustomization, icon: Palette },
  deck: { component: DeckSelection, icon: BookOpen },
};
export function SetupPage() {
  const { setupStep, setSetupStep, resetSetup } = useGameStore(
    useShallow((state) => ({ setupStep: state.setupStep, setSetupStep: state.setSetupStep, resetSetup: state.resetSetup }))
  );
  const navigate = useNavigate();
  const handleBack = () => {
    if (setupStep === 'teams') {
      resetSetup();
      navigate('/');
    } else if (setupStep === 'customize') {
      setSetupStep('teams');
    } else if (setupStep === 'deck') {
      setSetupStep('customize');
    }
  };
  const CurrentStepComponent = STEPS[setupStep].component;
  const stepKeys = Object.keys(STEPS);
  const currentStepIndex = stepKeys.indexOf(setupStep);
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-6 overflow-hidden">
      <div className="w-full max-w-md">
        <header className="relative flex items-center justify-center mb-8">
          <Button onClick={handleBack} variant="ghost" size="icon" className="absolute left-0 rounded-full h-12 w-12">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center justify-center gap-3">
            {stepKeys.map((key, index) => {
              const Icon = STEPS[key].icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              return (
                <div key={key} className={`p-3 rounded-full transition-colors ${isActive ? 'bg-sky-500 text-white' : isCompleted ? 'bg-green-400 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  <Icon className="h-6 w-6" />
                </div>
              );
            })}
          </div>
        </header>
        <main className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <CurrentStepComponent key={setupStep} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}