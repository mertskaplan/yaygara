import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Deck, Team, Word } from '@/types';
export type Language = 'en' | 'tr';
export type GameStatus = 'setup' | 'get-ready' | 'playing' | 'turn-summary' | 'game-over';
export type SetupStep = 'teams' | 'customize' | 'deck' | 'word-count';
export type TurnEndReason = 'time-up' | 'words-exhausted' | null;
export const TEAM_COLORS = [
  '#3e73d9', // Blue
  '#d14756', // Red
  '#33b864', // Green
  '#7c5ee0', // Purple
  '#e47b4f', // Orange
  '#2f2f2f', // Black
];
const TURN_DURATION = 45;
interface GameState {
  language: Language;
  teams: Team[];
  selectedDeck: Deck | null;
  customDeck: Deck | null;
  selectedWordCount: number | null;
  gameStatus: GameStatus;
  setupStep: SetupStep;
  round: number;
  currentTeamIndex: number;
  words: Word[];
  unseenWords: Word[];
  guessedWordsThisRound: Word[];
  currentWord: Word | null;
  lastGuessedWord: Word | null;
  lastPassedWord: Word | null;
  wordsGuessedThisTurn: Word[];
  timeLeft: number;
  turnEndReason: TurnEndReason;
  bonusTime: number | null;
  setLanguage: (lang: Language) => void;
  setTeamCount: (count: number, nameParts: { adjectives: string[], nouns: string[] }) => void;
  updateTeam: (id: number, name: string, color: string) => void;
  regenerateTeamName: (teamId: number, nameParts: { adjectives: string[], nouns: string[] }) => void;
  setSetupStep: (step: SetupStep) => void;
  selectDeck: (deck: Deck) => void;
  setCustomDeck: (deck: Deck) => void;
  setWordCount: (count: number) => void;
  startGame: (words: Word[]) => void;
  startTurn: () => void;
  endTurn: () => void;
  proceedToNextTurn: () => void;
  handleCorrect: () => void;
  handlePass: () => void;
  undoLastAction: () => void;
  tick: () => void;
  resetSetup: () => void;
  resetGame: () => void;
}
export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      language: 'en',
      teams: [],
      selectedDeck: null,
      customDeck: null,
      selectedWordCount: null,
      gameStatus: 'setup',
      setupStep: 'teams',
      round: 1,
      currentTeamIndex: 0,
      words: [],
      unseenWords: [],
      guessedWordsThisRound: [],
      currentWord: null,
      lastGuessedWord: null,
      lastPassedWord: null,
      wordsGuessedThisTurn: [],
      timeLeft: TURN_DURATION,
      turnEndReason: null,
      bonusTime: null,
      setLanguage: (lang) => set({ language: lang, setupStep: 'teams', teams: [], selectedDeck: null, customDeck: null, selectedWordCount: null }),
      setTeamCount: (count, nameParts) => {
        set((state) => {
          const usedNames = new Set<string>();
          state.teams = Array.from({ length: count }, (_, i) => {
            let name = '';
            // Ensure unique random names
            do {
              const adj = nameParts.adjectives[Math.floor(Math.random() * nameParts.adjectives.length)];
              const noun = nameParts.nouns[Math.floor(Math.random() * nameParts.nouns.length)];
              name = `${adj} ${noun}`;
            } while (usedNames.has(name));
            usedNames.add(name);
            return {
              id: i,
              name,
              color: TEAM_COLORS[i % TEAM_COLORS.length],
              score: 0,
              isNameCustomized: false,
            };
          });
          state.setupStep = 'customize';
        });
      },
      updateTeam: (id, name, color) => {
        set((state) => {
          const team = state.teams.find((t) => t.id === id);
          if (team) {
            if (team.name !== name) {
              team.isNameCustomized = true;
            }
            team.name = name;
            team.color = color;
          }
        });
      },
      regenerateTeamName: (teamId, nameParts) => {
        set((state) => {
          const teamToUpdate = state.teams.find((t) => t.id === teamId);
          if (teamToUpdate) {
            const usedNames = new Set(state.teams.filter(t => t.id !== teamId).map((t) => t.name));
            let newName = '';
            let attempts = 0;
            do {
              const adj = nameParts.adjectives[Math.floor(Math.random() * nameParts.adjectives.length)];
              const noun = nameParts.nouns[Math.floor(Math.random() * nameParts.nouns.length)];
              newName = `${adj} ${noun}`;
              attempts++;
            } while (usedNames.has(newName) && attempts < 50); // safety break
            teamToUpdate.name = newName;
            teamToUpdate.isNameCustomized = true; // Treat regeneration as a user customization
          }
        });
      },
      setSetupStep: (step) => set({ setupStep: step }),
      selectDeck: (deck) => set({ selectedDeck: deck }),
      setCustomDeck: (deck) => {
        set({ customDeck: deck, selectedDeck: deck });
      },
      setWordCount: (count) => set({ selectedWordCount: count }),
      startGame: (words) => {
        set((state) => {
          const count = state.selectedWordCount ?? words.length;
          const shuffledWords = [...words].sort(() => Math.random() - 0.5);
          const gameWords = shuffledWords.slice(0, count);
          state.gameStatus = 'get-ready';
          state.words = gameWords;
          state.unseenWords = [...gameWords].sort(() => Math.random() - 0.5);
          state.guessedWordsThisRound = [];
          state.currentTeamIndex = 0;
          state.round = 1;
          state.bonusTime = null;
          state.teams.forEach(t => t.score = 0);
        });
      },
      startTurn: () => {
        set((state) => {
          state.gameStatus = 'playing';
          state.timeLeft = state.bonusTime ?? TURN_DURATION;
          state.bonusTime = null;
          state.lastGuessedWord = null;
          state.lastPassedWord = null;
          state.wordsGuessedThisTurn = [];
          state.turnEndReason = null;
          if (state.unseenWords.length > 0) {
            state.currentWord = state.unseenWords.pop()!;
          } else {
            state.currentWord = null;
          }
        });
      },
      endTurn: () => {
        set((state) => {
          if (state.currentWord) {
            const expiredWord = state.currentWord;
            const insertIndex = Math.floor(Math.random() * (state.unseenWords.length + 1));
            state.unseenWords.splice(insertIndex, 0, expiredWord);
            state.currentWord = null;
          }
          state.gameStatus = 'turn-summary';
          state.turnEndReason = 'time-up';
        });
      },
      proceedToNextTurn: () => {
        set((state) => {
          const { teams, round, unseenWords, words, currentTeamIndex } = state;
          const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
          if (unseenWords.length === 0) {
            if (round === 3) {
              state.gameStatus = 'game-over';
              return;
            }
            state.round += 1;
            state.guessedWordsThisRound = [];
            state.unseenWords = [...words].sort(() => Math.random() - 0.5);
            state.currentTeamIndex = nextTeamIndex;
            state.gameStatus = 'get-ready';
          } else {
            state.currentTeamIndex = nextTeamIndex;
            state.gameStatus = 'get-ready';
          }
        });
      },
      handleCorrect: () => {
        set((state) => {
          if (state.currentWord) {
            const team = state.teams[state.currentTeamIndex];
            team.score += state.currentWord.difficulty;
            state.wordsGuessedThisTurn.push(state.currentWord);
            state.guessedWordsThisRound.push(state.currentWord);
            state.lastGuessedWord = state.currentWord;
            state.lastPassedWord = null;
          }
          if (state.unseenWords.length > 0) {
            state.currentWord = state.unseenWords.pop()!;
          } else {
            state.currentWord = null;
            if (state.timeLeft > 3 && state.round < 3) {
              state.bonusTime = state.timeLeft;
              state.round += 1;
              state.guessedWordsThisRound = [];
              state.unseenWords = [...state.words].sort(() => Math.random() - 0.5);
              state.gameStatus = 'get-ready'; // Same team plays again
            } else {
              state.gameStatus = 'turn-summary';
              state.turnEndReason = 'words-exhausted';
            }
          }
        });
      },
      handlePass: () => {
        set((state) => {
          if (state.currentWord && state.unseenWords.length > 0) {
            const passedWord = state.currentWord;
            state.lastPassedWord = passedWord;
            state.lastGuessedWord = null;
            state.currentWord = state.unseenWords.pop()!;
            const insertIndex = Math.floor(Math.random() * Math.ceil(state.unseenWords.length / 2));
            state.unseenWords.splice(insertIndex, 0, passedWord);
          }
        });
      },
      undoLastAction: () => {
        set((state) => {
          if (state.lastGuessedWord) {
            const team = state.teams[state.currentTeamIndex];
            team.score -= state.lastGuessedWord.difficulty;
            state.wordsGuessedThisTurn.pop();
            state.guessedWordsThisRound = state.guessedWordsThisRound.filter(
              (word) => word.term !== state.lastGuessedWord!.term
            );
            if (state.currentWord) {
              state.unseenWords.push(state.currentWord);
            }
            state.currentWord = state.lastGuessedWord;
            state.lastGuessedWord = null;
          } else if (state.lastPassedWord) {
            const wordToRestoreAsCurrent = state.lastPassedWord;
            const wordToReturnToDeck = state.currentWord;
            state.unseenWords = state.unseenWords.filter(
              (word) => word.term !== wordToRestoreAsCurrent.term
            );
            if (wordToReturnToDeck) {
              state.unseenWords.push(wordToReturnToDeck);
            }
            state.currentWord = wordToRestoreAsCurrent;
            state.lastPassedWord = null;
          }
        });
      },
      tick: () => {
        set((state) => {
          state.timeLeft -= 1;
        });
      },
      resetSetup: () => {
        set({
          teams: [],
          selectedDeck: null,
          customDeck: null,
          gameStatus: 'setup',
          setupStep: 'teams',
          selectedWordCount: null,
        });
      },
      resetGame: () => {
        set({
          teams: [],
          selectedDeck: null,
          customDeck: null,
          gameStatus: 'setup',
          setupStep: 'teams',
          round: 1,
          currentTeamIndex: 0,
          words: [],
          unseenWords: [],
          guessedWordsThisRound: [],
          currentWord: null,
          lastGuessedWord: null,
          lastPassedWord: null,
          wordsGuessedThisTurn: [],
          timeLeft: TURN_DURATION,
          turnEndReason: null,
          bonusTime: null,
          selectedWordCount: null,
        });
      },
    })),
    {
      name: 'vocab-rush-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);