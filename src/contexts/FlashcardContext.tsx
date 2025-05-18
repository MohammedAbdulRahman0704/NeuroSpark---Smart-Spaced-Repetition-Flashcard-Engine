import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Deck, 
  Flashcard, 
  FlashcardReview, 
  StudySession, 
  UserStats, 
  Difficulty 
} from '../types';
import { 
  loadDecks, 
  loadFlashcards, 
  loadReviews, 
  loadSessions, 
  loadUserStats,
  saveAllData 
} from '../utils/localStorage';
import { calculateNextReview } from '../utils/spacedRepetition';

// Define state shape
interface FlashcardState {
  decks: Deck[];
  flashcards: Flashcard[];
  reviews: FlashcardReview[];
  sessions: StudySession[];
  userStats: UserStats;
  loading: boolean;
}

// Define actions
type FlashcardAction =
  | { type: 'LOAD_DATA', payload: Omit<FlashcardState, 'loading'> }
  | { type: 'ADD_DECK', payload: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_DECK', payload: Deck }
  | { type: 'DELETE_DECK', payload: string }
  | { type: 'ADD_FLASHCARD', payload: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_FLASHCARD', payload: Flashcard }
  | { type: 'DELETE_FLASHCARD', payload: string }
  | { type: 'RECORD_REVIEW', payload: { flashcardId: string, difficulty: Difficulty } }
  | { type: 'START_SESSION', payload: { deckId: string } }
  | { type: 'END_SESSION', payload: { sessionId: string, cardsReviewed: number, cardsCorrect: number } };

// Initial state
const initialState: FlashcardState = {
  decks: [],
  flashcards: [],
  reviews: [],
  sessions: [],
  userStats: {
    totalReviews: 0,
    totalCorrect: 0,
    streakDays: 0,
    lastReviewDate: null,
  },
  loading: true,
};

// Reducer function
const flashcardReducer = (state: FlashcardState, action: FlashcardAction): FlashcardState => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
      
    case 'ADD_DECK': {
      const newDeck: Deck = {
        id: uuidv4(),
        ...action.payload,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      return {
        ...state,
        decks: [...state.decks, newDeck],
      };
    }
      
    case 'UPDATE_DECK': {
      const updatedDeck = {
        ...action.payload,
        updatedAt: Date.now(),
      };
      
      return {
        ...state,
        decks: state.decks.map(deck => 
          deck.id === updatedDeck.id ? updatedDeck : deck
        ),
      };
    }
      
    case 'DELETE_DECK': {
      const deckId = action.payload;
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== deckId),
        flashcards: state.flashcards.filter(card => card.deckId !== deckId),
      };
    }
      
    case 'ADD_FLASHCARD': {
      const newCard: Flashcard = {
        id: uuidv4(),
        ...action.payload,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      return {
        ...state,
        flashcards: [...state.flashcards, newCard],
      };
    }
      
    case 'UPDATE_FLASHCARD': {
      const updatedCard = {
        ...action.payload,
        updatedAt: Date.now(),
      };
      
      return {
        ...state,
        flashcards: state.flashcards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        ),
      };
    }
      
    case 'DELETE_FLASHCARD': {
      const cardId = action.payload;
      return {
        ...state,
        flashcards: state.flashcards.filter(card => card.id !== cardId),
        reviews: state.reviews.filter(review => review.flashcardId !== cardId),
      };
    }
      
    case 'RECORD_REVIEW': {
      const { flashcardId, difficulty } = action.payload;
      const now = Date.now();
      
      // Find the most recent review for this flashcard
      const previousReview = state.reviews
        .filter(r => r.flashcardId === flashcardId)
        .sort((a, b) => b.reviewedAt - a.reviewedAt)[0] || null;
      
      // Calculate next review parameters
      const { interval, easeFactor, streak } = calculateNextReview(previousReview, difficulty);
      
      // Create new review
      const newReview: FlashcardReview = {
        id: uuidv4(),
        flashcardId,
        reviewedAt: now,
        difficulty,
        interval,
        easeFactor,
        streak,
      };
      
      // Update user stats
      const isCorrect = difficulty !== 'again';
      const userStats = { 
        ...state.userStats,
        totalReviews: state.userStats.totalReviews + 1,
        totalCorrect: state.userStats.totalCorrect + (isCorrect ? 1 : 0),
        lastReviewDate: now,
      };
      
      // Check if streak should be updated (once per day)
      const lastDate = state.userStats.lastReviewDate
        ? new Date(state.userStats.lastReviewDate).setHours(0, 0, 0, 0)
        : null;
      const todayDate = new Date(now).setHours(0, 0, 0, 0);
      
      if (lastDate !== todayDate) {
        userStats.streakDays += 1;
      }
      
      return {
        ...state,
        reviews: [...state.reviews, newReview],
        userStats,
      };
    }
      
    case 'START_SESSION': {
      const newSession: StudySession = {
        id: uuidv4(),
        deckId: action.payload.deckId,
        startedAt: Date.now(),
        endedAt: null,
        cardsReviewed: 0,
        cardsCorrect: 0,
      };
      
      return {
        ...state,
        sessions: [...state.sessions, newSession],
      };
    }
      
    case 'END_SESSION': {
      const { sessionId, cardsReviewed, cardsCorrect } = action.payload;
      
      return {
        ...state,
        sessions: state.sessions.map(session => 
          session.id === sessionId 
            ? { 
                ...session, 
                endedAt: Date.now(),
                cardsReviewed,
                cardsCorrect,
              } 
            : session
        ),
      };
    }
      
    default:
      return state;
  }
};

// Context interface
interface FlashcardContextProps {
  state: FlashcardState;
  addDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeck: (deck: Deck) => void;
  deleteDeck: (deckId: string) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFlashcard: (flashcard: Flashcard) => void;
  deleteFlashcard: (cardId: string) => void;
  recordReview: (flashcardId: string, difficulty: Difficulty) => void;
  startSession: (deckId: string) => string;
  endSession: (sessionId: string, cardsReviewed: number, cardsCorrect: number) => void;
}

// Create context
const FlashcardContext = createContext<FlashcardContextProps | undefined>(undefined);

// Provider component
export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(flashcardReducer, initialState);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadAllData = () => {
      const decks = loadDecks();
      const flashcards = loadFlashcards();
      const reviews = loadReviews();
      const sessions = loadSessions();
      const userStats = loadUserStats();

      dispatch({
        type: 'LOAD_DATA',
        payload: { decks, flashcards, reviews, sessions, userStats },
      });
    };

    loadAllData();
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (!state.loading) {
      saveAllData(
        state.decks, 
        state.flashcards, 
        state.reviews, 
        state.sessions, 
        state.userStats,
        { colorMode: 'light' } // This is handled by ThemeContext
      );
    }
  }, [state]);

  // Context functions
  const addDeck = (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_DECK', payload: deck });
  };

  const updateDeck = (deck: Deck) => {
    dispatch({ type: 'UPDATE_DECK', payload: deck });
  };

  const deleteDeck = (deckId: string) => {
    dispatch({ type: 'DELETE_DECK', payload: deckId });
  };

  const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_FLASHCARD', payload: flashcard });
  };

  const updateFlashcard = (flashcard: Flashcard) => {
    dispatch({ type: 'UPDATE_FLASHCARD', payload: flashcard });
  };

  const deleteFlashcard = (cardId: string) => {
    dispatch({ type: 'DELETE_FLASHCARD', payload: cardId });
  };

  const recordReview = (flashcardId: string, difficulty: Difficulty) => {
    dispatch({ type: 'RECORD_REVIEW', payload: { flashcardId, difficulty } });
  };

  const startSession = (deckId: string) => {
    const sessionId = uuidv4();
    dispatch({ type: 'START_SESSION', payload: { deckId } });
    return sessionId;
  };

  const endSession = (sessionId: string, cardsReviewed: number, cardsCorrect: number) => {
    dispatch({ type: 'END_SESSION', payload: { sessionId, cardsReviewed, cardsCorrect } });
  };

  return (
    <FlashcardContext.Provider
      value={{
        state,
        addDeck,
        updateDeck,
        deleteDeck,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        recordReview,
        startSession,
        endSession,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

// Custom hook for using this context
export const useFlashcards = (): FlashcardContextProps => {
  const context = useContext(FlashcardContext);
  
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  
  return context;
};