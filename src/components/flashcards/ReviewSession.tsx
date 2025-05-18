import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import { useFlashcards } from '../../contexts/FlashcardContext';
import FlashcardItem from './FlashcardItem';
import { Difficulty } from '../../types';
import { calculateUrgencyScore } from '../../utils/spacedRepetition';

interface ReviewSessionProps {
  deckId: string;
  onExit: () => void;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ deckId, onExit }) => {
  const { state, recordReview, startSession, endSession } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewedCards, setReviewedCards] = useState<string[]>([]);
  const [correctCards, setCorrectCards] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Get deck
  const deck = state.decks.find(d => d.id === deckId);
  if (!deck) return <div>Deck not found</div>;
  
  // Find all cards in this deck
  const deckCards = state.flashcards.filter(card => card.deckId === deckId);
  
  // Filter due cards (either no review or calculated as due)
  const dueCards = deckCards.filter(card => {
    const latestReview = state.reviews
      .filter(r => r.flashcardId === card.id)
      .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
      
    return !latestReview || calculateUrgencyScore(latestReview) < 20;
  });
  
  // Sort cards by urgency (lowest urgency score first)
  const sortedCards = [...dueCards].sort((a, b) => {
    const reviewA = state.reviews
      .filter(r => r.flashcardId === a.id)
      .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
      
    const reviewB = state.reviews
      .filter(r => r.flashcardId === b.id)
      .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
      
    return calculateUrgencyScore(reviewA) - calculateUrgencyScore(reviewB);
  });
  
  const currentCard = sortedCards[currentCardIndex];
  
  // Start a new session on component mount
  useEffect(() => {
    const id = startSession(deckId);
    setSessionId(id);
    
    // Cleanup when leaving the component
    return () => {
      if (!isComplete && sessionId) {
        endSession(sessionId, reviewedCards.length, correctCards.length);
      }
    };
  }, []);
  
  const handleReview = (difficulty: Difficulty) => {
    if (!currentCard) return;
    
    // Record this review in the system
    recordReview(currentCard.id, difficulty);
    
    // Update local state
    setReviewedCards(prev => [...prev, currentCard.id]);
    if (difficulty !== 'again') {
      setCorrectCards(prev => [...prev, currentCard.id]);
    }
    
    // Move to next card or finish session
    if (currentCardIndex < sortedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of session
      setIsComplete(true);
      endSession(sessionId, reviewedCards.length + 1, 
        correctCards.length + (difficulty !== 'again' ? 1 : 0));
    }
  };
  
  if (isComplete || sortedCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-6">
          {sortedCards.length === 0 ? 'Nothing to Review' : 'Session Complete!'}
        </h2>
        
        {sortedCards.length > 0 && (
          <div className="mb-8">
            <div className="text-4xl font-bold mb-2">
              {Math.round((correctCards.length / reviewedCards.length) * 100)}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              You got {correctCards.length} out of {reviewedCards.length} cards correct
            </p>
          </div>
        )}
        
        <Button 
          variant="primary" 
          icon={<ArrowLeft size={16} />}
          onClick={onExit}
        >
          Back to Deck
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={onExit}
        >
          Exit Review
        </Button>
        
        <div className="text-sm font-medium">
          Card {currentCardIndex + 1} of {sortedCards.length}
        </div>
      </div>
      
      {currentCard && (
        <FlashcardItem 
          front={currentCard.front}
          back={currentCard.back}
          onReview={handleReview}
        />
      )}
      
      <div className="mt-8 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentCardIndex) / sortedCards.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ReviewSession;