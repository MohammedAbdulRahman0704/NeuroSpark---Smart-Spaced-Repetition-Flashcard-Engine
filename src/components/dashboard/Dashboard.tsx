import React from 'react';
import { Brain, Award, Clock, Activity } from 'lucide-react';
import Card from '../ui/Card';
import { useFlashcards } from '../../contexts/FlashcardContext';
import RetentionGraph from './RetentionGraph';
import StudyHeatmap from './StudyHeatmap';
import { calculateUrgencyScore } from '../../utils/spacedRepetition';

const Dashboard: React.FC = () => {
  const { state } = useFlashcards();
  const { decks, flashcards, reviews, sessions, userStats } = state;
  
  // Calculate cards due today
  const cardsDue = flashcards.filter(card => {
    const latestReview = reviews
      .filter(r => r.flashcardId === card.id)
      .sort((a, b) => b.reviewedAt - a.reviewedAt)[0];
      
    return !latestReview || calculateUrgencyScore(latestReview) < 20;
  });
  
  // Calculate overall retention rate
  const retentionRate = userStats.totalReviews > 0 
    ? Math.round((userStats.totalCorrect / userStats.totalReviews) * 100) 
    : 0;
  
  // Count cards by deck
  const cardsByDeck = decks.map(deck => {
    const count = flashcards.filter(card => card.deckId === deck.id).length;
    return { ...deck, count };
  });
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Learning Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cards</p>
                <h3 className="text-3xl font-bold mt-1">{flashcards.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Retention Rate</p>
                <h3 className="text-3xl font-bold mt-1">{retentionRate}%</h3>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cards Due</p>
                <h3 className="text-3xl font-bold mt-1">{cardsDue.length}</h3>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Day Streak</p>
                <h3 className="text-3xl font-bold mt-1">{userStats.streakDays}</h3>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetentionGraph />
        <StudyHeatmap />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Your Decks</Card.Title>
            <Card.Description>Overview of your study materials</Card.Description>
          </Card.Header>
          <Card.Content>
            {cardsByDeck.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No decks created yet
              </div>
            ) : (
              <div className="space-y-4">
                {cardsByDeck.map(deck => {
                  // Count cards due in this deck
                  const deckCardsDue = cardsDue.filter(card => card.deckId === deck.id).length;
                  
                  // Calculate progress
                  const progress = deck.count > 0 
                    ? 100 - Math.min(100, (deckCardsDue / deck.count) * 100)
                    : 0;
                    
                  return (
                    <div key={deck.id} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{deck.name}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {deck.count} cards
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 dark:bg-blue-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="ml-3 text-sm font-medium">
                          {deckCardsDue > 0 ? `${deckCardsDue} due` : 'All reviewed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;