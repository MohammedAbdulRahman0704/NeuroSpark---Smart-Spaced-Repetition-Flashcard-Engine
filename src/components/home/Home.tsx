import React from 'react';
import { PlusCircle, ArrowRight, Brain, BarChart3, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useFlashcards } from '../../contexts/FlashcardContext';
import { calculateUrgencyScore } from '../../utils/spacedRepetition';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { state } = useFlashcards();
  const { decks, flashcards, reviews } = state;
  
  // Calculate cards due today
  const cardsDue = flashcards.filter(card => {
    const latestReview = reviews
      .filter(r => r.flashcardId === card.id)
      .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
      
    return !latestReview || calculateUrgencyScore(latestReview) < 20;
  });
  
  // Group due cards by deck
  const dueByDeck = decks.map(deck => {
    const dueCards = cardsDue.filter(card => card.deckId === deck.id);
    return {
      ...deck,
      dueCount: dueCards.length
    };
  }).filter(deck => deck.dueCount > 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome to NeuroSpark</h1>
          <p className="text-gray-600 dark:text-gray-400">Your personalized learning assistant</p>
        </div>
        
        <Button 
          variant="primary" 
          icon={<PlusCircle size={16} />}
          onClick={() => onNavigate('create-deck')}
        >
          Create Deck
        </Button>
      </div>
      
      {cardsDue.length > 0 ? (
        <Card>
          <Card.Header>
            <Card.Title>
              <div className="flex items-center text-yellow-600 dark:text-yellow-500">
                <Clock size={18} className="mr-2" />
                Due for Review
              </div>
            </Card.Title>
            <Card.Description>You have {cardsDue.length} flashcards waiting for review</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {dueByDeck.map(deck => (
                <div key={deck.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <div>
                    <h3 className="font-medium">{deck.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {deck.dueCount} cards due
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight size={16} />}
                    onClick={() => onNavigate(`deck-${deck.id}`)}
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      ) : (
        decks.length > 0 ? (
          <Card>
            <Card.Content className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You've reviewed all your due flashcards. Check back later!
              </p>
            </Card.Content>
          </Card>
        ) : null
      )}
      
      {decks.length === 0 ? (
        <div className="mt-8 text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Start Your Learning Journey</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Create your first flashcard deck to begin learning with spaced repetition
          </p>
          <Button 
            variant="primary" 
            icon={<PlusCircle size={16} />}
            onClick={() => onNavigate('create-deck')}
          >
            Create Your First Deck
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="flex flex-col">
            <Card.Content className="flex flex-col items-center text-center p-6 h-full">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Study Now</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                Start a review session with your due flashcards
              </p>
              <Button 
                variant="outline"
                fullWidth
                onClick={() => onNavigate('review')}
                disabled={cardsDue.length === 0}
              >
                {cardsDue.length > 0 ? 'Start Reviewing' : 'No Cards Due'}
              </Button>
            </Card.Content>
          </Card>
          
          <Card className="flex flex-col">
            <Card.Content className="flex flex-col items-center text-center p-6 h-full">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                View your learning statistics and analytics
              </p>
              <Button 
                variant="outline"
                fullWidth
                onClick={() => onNavigate('dashboard')}
              >
                View Dashboard
              </Button>
            </Card.Content>
          </Card>
          
          <Card className="flex flex-col">
            <Card.Content className="flex flex-col items-center text-center p-6 h-full">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
                <PlusCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Content</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                Add new decks and flashcards to expand your knowledge
              </p>
              <Button 
                variant="outline"
                fullWidth
                onClick={() => onNavigate('create-deck')}
              >
                Create New Deck
              </Button>
            </Card.Content>
          </Card>
        </div>
      )}
      
      {decks.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-3">Your Decks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map(deck => {
              const deckCards = flashcards.filter(card => card.deckId === deck.id);
              const deckCardsDue = cardsDue.filter(card => card.deckId === deck.id);
              
              return (
                <Card key={deck.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(`deck-${deck.id}`)}>
                  <Card.Content className="p-4">
                    <h3 className="font-medium truncate">{deck.name}</h3>
                    {deck.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {deck.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span>{deckCards.length} cards</span>
                      {deckCardsDue.length > 0 && (
                        <span className="text-yellow-600 dark:text-yellow-500 font-medium">
                          {deckCardsDue.length} due
                        </span>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;