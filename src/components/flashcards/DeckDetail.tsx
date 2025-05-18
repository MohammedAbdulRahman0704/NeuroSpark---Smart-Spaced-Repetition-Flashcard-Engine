import React, { useState } from 'react';
import { PlusCircle, Clock, BarChart3, Edit, Trash } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useFlashcards } from '../../contexts/FlashcardContext';
import CreateFlashcardForm from './CreateFlashcardForm';
import { calculateUrgencyScore } from '../../utils/spacedRepetition';

interface DeckDetailProps {
  deckId: string;
  onStartReview: (deckId: string) => void;
}

const DeckDetail: React.FC<DeckDetailProps> = ({ deckId, onStartReview }) => {
  const { state, deleteDeck, deleteFlashcard } = useFlashcards();
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const deck = state.decks.find(d => d.id === deckId);
  const flashcards = state.flashcards.filter(card => card.deckId === deckId);
  
  if (!deck) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Deck not found</h2>
      </div>
    );
  }
  
  // Get all reviews for cards in this deck
  const reviews = state.reviews.filter(review => 
    flashcards.some(card => card.id === review.flashcardId)
  );
  
  // Calculate cards due for review
  const cardsDue = flashcards.filter(card => {
    const latestReview = state.reviews
      .filter(r => r.flashcardId === card.id)
      .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
      
    // If no review or urgency score is low enough, it's due
    return !latestReview || calculateUrgencyScore(latestReview) < 20;
  });
  
  const handleDeleteDeck = () => {
    if (window.confirm(`Are you sure you want to delete the deck "${deck.name}"? This will also delete all flashcards in this deck.`)) {
      deleteDeck(deckId);
    }
  };
  
  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcard(cardId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          {deck.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{deck.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {deck.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash size={16} />}
            onClick={handleDeleteDeck}
          >
            Delete
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
          
          <Button
            variant="primary"
            icon={<Clock size={16} />}
            onClick={() => onStartReview(deckId)}
            disabled={cardsDue.length === 0}
          >
            {cardsDue.length > 0 
              ? `Review (${cardsDue.length} due)` 
              : 'Nothing to review'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Content className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold">{flashcards.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Cards</div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold">{cardsDue.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cards Due</div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold">{reviews.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reviews Completed</div>
          </Card.Content>
        </Card>
      </div>
      
      {isAddingCard ? (
        <CreateFlashcardForm 
          deckId={deckId} 
          onComplete={() => setIsAddingCard(false)} 
        />
      ) : (
        <Button 
          variant="outline" 
          icon={<PlusCircle size={16} />}
          onClick={() => setIsAddingCard(true)}
        >
          Add Flashcard
        </Button>
      )}
      
      <h2 className="text-xl font-bold mt-6">Flashcards</h2>
      {flashcards.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No flashcards in this deck yet</p>
          <Button 
            variant="primary" 
            className="mt-3"
            onClick={() => setIsAddingCard(true)}
          >
            Create your first flashcard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.map(card => {
            const latestReview = state.reviews
              .filter(r => r.flashcardId === card.id)
              .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
              
            const isDue = !latestReview || calculateUrgencyScore(latestReview) < 20;
            
            return (
              <Card key={card.id} className={isDue ? 'border-l-4 border-l-yellow-500' : ''}>
                <Card.Content className="p-4">
                  <div className="font-medium mb-1">{card.front}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{card.back}</div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-1">
                      {card.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDeleteCard(card.id)}
                      aria-label="Delete card"
                      icon={<Trash size={16} />}
                    />
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeckDetail;