import React, { useMemo } from 'react';
import { useFlashcards } from '../../contexts/FlashcardContext';
import Card from '../ui/Card';

const RetentionGraph: React.FC = () => {
  const { state } = useFlashcards();
  const { reviews } = state;

  const retentionData = useMemo(() => {
    // Last 7 days
    const days = 7;
    const data = Array(days).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Find all reviews on this day
      const dayReviews = reviews.filter(r => {
        const reviewDate = new Date(r.reviewedAt);
        return reviewDate.setHours(0, 0, 0, 0) === date.getTime();
      });
      
      // Calculate retention rate
      const total = dayReviews.length;
      const correct = dayReviews.filter(r => r.difficulty !== 'again').length;
      const rate = total > 0 ? (correct / total) * 100 : 0;
      
      return {
        date: date.toLocaleDateString(undefined, { weekday: 'short' }),
        timestamp: date.getTime(),
        total,
        correct,
        rate,
      };
    }).reverse();
    
    return data;
  }, [reviews]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Retention Rate</Card.Title>
        <Card.Description>Your daily retention performance</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="h-64">
          {retentionData.length === 0 || retentionData.every(d => d.total === 0) ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              No review data available
            </div>
          ) : (
            <div className="h-full flex items-end justify-between">
              {retentionData.map((day) => (
                <div key={day.timestamp} className="flex flex-col items-center w-full">
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className="w-4/5 bg-blue-200 dark:bg-blue-900 rounded-t"
                      style={{ 
                        height: day.total === 0 ? 0 : `${Math.max(5, (day.rate * 50) / 100)}%`,
                      }}
                    >
                      <div 
                        className="absolute bottom-0 w-4/5 bg-blue-600 dark:bg-blue-500 rounded-t"
                        style={{ 
                          height: day.total === 0 ? 0 : `${Math.max(2, day.rate * 50 / 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-medium">{day.date}</div>
                  {day.total > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(day.rate)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default RetentionGraph;