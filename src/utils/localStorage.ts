import { Deck, Flashcard, FlashcardReview, StudySession, UserStats, ThemeConfig } from '../types';

// Local storage keys
const KEYS = {
  DECKS: 'neurospark_decks',
  FLASHCARDS: 'neurospark_flashcards',
  REVIEWS: 'neurospark_reviews',
  SESSIONS: 'neurospark_sessions',
  USER_STATS: 'neurospark_user_stats',
  THEME: 'neurospark_theme',
};

// Generic save and load functions
const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
  }
};

const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Decks
export const saveDecks = (decks: Deck[]): void => {
  saveData(KEYS.DECKS, decks);
};

export const loadDecks = (): Deck[] => {
  return loadData<Deck[]>(KEYS.DECKS, []);
};

// Flashcards
export const saveFlashcards = (flashcards: Flashcard[]): void => {
  saveData(KEYS.FLASHCARDS, flashcards);
};

export const loadFlashcards = (): Flashcard[] => {
  return loadData<Flashcard[]>(KEYS.FLASHCARDS, []);
};

// Reviews
export const saveReviews = (reviews: FlashcardReview[]): void => {
  saveData(KEYS.REVIEWS, reviews);
};

export const loadReviews = (): FlashcardReview[] => {
  return loadData<FlashcardReview[]>(KEYS.REVIEWS, []);
};

// Study Sessions
export const saveSessions = (sessions: StudySession[]): void => {
  saveData(KEYS.SESSIONS, sessions);
};

export const loadSessions = (): StudySession[] => {
  return loadData<StudySession[]>(KEYS.SESSIONS, []);
};

// User Stats
export const saveUserStats = (stats: UserStats): void => {
  saveData(KEYS.USER_STATS, stats);
};

export const loadUserStats = (): UserStats => {
  return loadData<UserStats>(KEYS.USER_STATS, {
    totalReviews: 0,
    totalCorrect: 0,
    streakDays: 0,
    lastReviewDate: null,
  });
};

// Theme
export const saveTheme = (theme: ThemeConfig): void => {
  saveData(KEYS.THEME, theme);
};

export const loadTheme = (): ThemeConfig => {
  return loadData<ThemeConfig>(KEYS.THEME, {
    colorMode: 'light',
  });
};

// Data persistence layer
export const saveAllData = (
  decks: Deck[],
  flashcards: Flashcard[],
  reviews: FlashcardReview[],
  sessions: StudySession[],
  stats: UserStats,
  theme: ThemeConfig
): void => {
  saveDecks(decks);
  saveFlashcards(flashcards);
  saveReviews(reviews);
  saveSessions(sessions);
  saveUserStats(stats);
  saveTheme(theme);
};