export type Difficulty = 'easy' | 'good' | 'hard' | 'again';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface FlashcardReview {
  id: string;
  flashcardId: string;
  reviewedAt: number;
  difficulty: Difficulty;
  interval: number;
  easeFactor: number;
  streak: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  startedAt: number;
  endedAt: number | null;
  cardsReviewed: number;
  cardsCorrect: number;
}

export interface UserStats {
  totalReviews: number;
  totalCorrect: number;
  streakDays: number;
  lastReviewDate: number | null;
}

export interface ThemeConfig {
  colorMode: 'light' | 'dark';
}