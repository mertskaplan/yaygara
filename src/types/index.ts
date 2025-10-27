export interface Word {
  term: string;
  hint: string;
  difficulty: 1 | 2 | 3;
}
export interface Deck {
  id: string;
  name: string;
  language: string;
  words?: Word[];
  count?: number;
}
export interface Team {
  id: number;
  name: string;
  color: string;
  score: number;
  members?: string[];
  isNameCustomized?: boolean;
}