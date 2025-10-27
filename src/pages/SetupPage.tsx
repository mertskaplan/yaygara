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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, translations]);
  const usedColors = teams.map(t => t.color);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-700 font-display">{t('setup.customizeTitle')}</h2>
      <div className="space-y-4">
        {teams.map((team) => {
          const otherTeamsColors = usedColors.filter(c => c !== team.color);
          return (
            <div key={team.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-md">
              <div className="flex-shrink-0 grid grid-cols-4 gap-1 bg-slate-100 p-2 rounded-lg">
                {TEAM_COLORS.map(color => {
                  const isTaken = otherTeamsColors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => updateTeam(team.id, team.name, color)}
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-125 ${isTaken ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: color }}
                      disabled={isTaken}
                      aria-label={`Select color ${color}`}
                    >
                      {team.color === color && <Check className="w-4 h-4 text-white m-auto" />}
                    </button>
                  );
                })}
              </div>
              <Input
                type="text"
                value={team.name}
                onChange={(e) => updateTeam(team.id, e.target.value, team.color)}
                className="text-lg font-semibold border-2 focus:ring-sky-500"
                style={{ borderLeftColor: team.color, borderLeftWidth: '6px' }}
              />
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
            count: parsedDeck.words.length,
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
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-center text-slate-700 font-display">{t('setup.deckTitle')}</h2>
      <div className="space-y-3 max-h-80 overflow-y-auto p-1">
        {isLoadingDecks ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : (
          <>
            {decks.map((deck) => (
              <Button
                key={deck.id}
                onClick={() => selectDeck(deck)}
                variant={selectedDeck?.id === deck.id ? 'default' : 'outline'}
                className={`w-full h-16 text-lg justify-start font-semibold rounded-2xl ${selectedDeck?.id === deck.id ? 'bg-sky-500 text-white' : 'bg-white'}`}
              >
                <BookOpen className="mr-4 flex-shrink-0" />
                <span className="truncate">{deck.name}</span>
                <span className={`ml-2 text-sm ${selectedDeck?.id === deck.id ? 'text-white/80' : 'text-muted-foreground'}`}>{t('setup.deckWords', { count: deck.count })}</span>
              </Button>
            ))}
            {customDeck && (
              <Button
                key={customDeck.id}
                onClick={() => selectDeck(customDeck)}
                variant={selectedDeck?.id === customDeck.id ? 'default' : 'outline'}
                className={`w-full h-16 text-lg justify-start font-semibold rounded-2xl ${selectedDeck?.id === customDeck.id ? 'bg-sky-500 text-white' : 'bg-white'}`}
              >
                <Upload className="mr-4 flex-shrink-0" />
                <span className="truncate">{customDeck.name}</span>
                <span className={`ml-2 text-sm ${selectedDeck?.id === customDeck.id ? 'text-white/80' : 'text-muted-foreground'}`}>{t('setup.deckWords', { count: customDeck.count })}</span>
              </Button>
            )}
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