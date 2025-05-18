import { Difficulty, FlashcardReview } from '../types';

// SM-2+ algorithm constants
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const EASE_FACTOR_MODIFIER = {
  again: -0.2,
  hard: -0.15,
  good: 0,
  easy: 0.15,
};

const INTERVAL_MODIFIER = {
  again: 0,
  hard: 0.7,
  good: 1,
  easy: 1.5,
};

// First interval in days
const INITIAL_INTERVALS = {
  again: 0.1, // ~2.4 hours
  hard: 0.5,  // 12 hours
  good: 1,    // 1 day
  easy: 3,    // 3 days
};

// Calculate next review date using SM-2+ algorithm
export const calculateNextReview = (
  previousReview: FlashcardReview | null,
  difficulty: Difficulty
): {
  interval: number;
  easeFactor: number;
  streak: number;
  nextReviewDate: Date;
} => {
  // No previous reviews, use initial intervals
  if (!previousReview) {
    const initialInterval = INITIAL_INTERVALS[difficulty];
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + initialInterval);
    
    return {
      interval: initialInterval,
      easeFactor: DEFAULT_EASE_FACTOR,
      streak: difficulty === 'again' ? 0 : 1,
      nextReviewDate,
    };
  }
  
  // Reset streak if answer is wrong
  const streak = difficulty === 'again' ? 0 : previousReview.streak + 1;
  
  // Calculate new ease factor (bounded to prevent becoming too small)
  let easeFactor = previousReview.easeFactor + EASE_FACTOR_MODIFIER[difficulty];
  easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor);
  
  // Calculate new interval
  let interval: number;
  
  if (difficulty === 'again') {
    // Failed card, reset to a fraction of the previous interval
    interval = INITIAL_INTERVALS.again;
  } else if (previousReview.interval < 1) {
    // Card in learning phase
    interval = INITIAL_INTERVALS[difficulty];
  } else {
    // Apply interval modifier based on difficulty
    interval = previousReview.interval * easeFactor * INTERVAL_MODIFIER[difficulty];
    
    // Apply streak bonus for consistent correct answers
    if (streak > 3 && difficulty !== 'hard') {
      const streakBonus = Math.min(1.2, 1 + (streak - 3) * 0.05);
      interval *= streakBonus;
    }
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    interval,
    easeFactor,
    streak,
    nextReviewDate,
  };
};

// Calculate card urgency score (lower means more urgent to review)
export const calculateUrgencyScore = (
  review: FlashcardReview | null,
  currentDate: Date = new Date()
): number => {
  if (!review) {
    return 0; // New cards have highest priority
  }
  
  const now = currentDate.getTime();
  const reviewDate = review.reviewedAt + review.interval * 24 * 60 * 60 * 1000;
  const daysOverdue = (now - reviewDate) / (24 * 60 * 60 * 1000);
  
  if (daysOverdue < 0) {
    // Not due yet
    return 100 + Math.abs(daysOverdue);
  }
  
  // Overdue cards: higher priority with lower ease factor
  return (10 - review.easeFactor) * (1 + daysOverdue / 3);
};

// Calculate memory strength on a scale of 0-100%
export const calculateMemoryStrength = (review: FlashcardReview | null): number => {
  if (!review) return 0;
  
  const now = Date.now();
  const daysSinceReview = (now - review.reviewedAt) / (1000 * 60 * 60 * 24);
  const intervalDays = review.interval;
  
  // Calculate decay using a modified exponential decay formula
  // 100% at review time, decaying to ~20% at scheduled review time
  if (daysSinceReview <= 0) return 100;
  
  // Decay formula: strength = 100 * e^(-k * time)
  // Where k is calibrated so that strength = 20 when time = interval
  const k = Math.log(100 / 20) / intervalDays;
  const strength = 100 * Math.exp(-k * daysSinceReview);
  
  return Math.max(0, Math.min(100, strength));
};