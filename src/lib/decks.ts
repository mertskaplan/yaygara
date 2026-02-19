import type { Deck } from '@/types';

let manifestPromise: Promise<string[]> | null = null;
const deckCache: Record<string, Promise<Deck>> = {};

/**
 * Fetches the manifest of all available word decks.
 * Returns a list of filenames.
 */
export const fetchDecksManifest = (): Promise<string[]> => {
    if (manifestPromise) {
        return manifestPromise;
    }

    manifestPromise = fetch('/decks-manifest.json')
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch decks-manifest.json');
            return res.json();
        })
        .catch(err => {
            console.error('Error fetching decks manifest:', err);
            manifestPromise = null; // Allow retry on failure
            throw err;
        });

    return manifestPromise;
};

/**
 * Fetches a full deck by filename with caching.
 */
export const fetchFullDeck = (filename: string): Promise<Deck> => {
    if (deckCache[filename]) {
        return deckCache[filename];
    }

    deckCache[filename] = fetch(`/decks/${filename}`)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch deck: ${filename}`);
            return res.json();
        })
        .catch(err => {
            console.error(`Error fetching deck ${filename}:`, err);
            delete deckCache[filename]; // Allow retry
            throw err;
        });

    return deckCache[filename];
};
