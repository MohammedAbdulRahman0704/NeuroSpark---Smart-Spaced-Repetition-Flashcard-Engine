import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useFlashcards } from '../../contexts/FlashcardContext';

const StudyHeatmap: React.FC = () => {
  const { state } = useFlashcards();
  const { reviews } = state;

  const heatmapData = useMemo(() => {
    // Last 49 days (7 weeks) for the heatmap
    const days = 49;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Create array of the last 'days' days
    const daysArray = Array(days).fill(0).map((_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      return date.getTime();
    }).reverse();
    
    // Count reviews for each day
    const counts = daysArray.map(timestamp => {
      const dayReviews = reviews.filter(r => {
        const reviewDate = new Date(r.reviewedAt);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate.getTime() === timestamp;
      });
      
      return {
        date: timestamp,
        count: dayReviews.length,
      };
    });
    
    // Group by weeks (7 days per row)
    const weeks = [];
    for (let i = 0; i < counts.length; i += 7) {
      weeks.push(counts.slice(i, i + 7));
    }
    
    return weeks;
  }, [reviews]);

  // Function to determine color intensity based on count
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count < 5) return 'bg-blue-200 dark:bg-blue-900';
    if (count < 10) return 'bg-blue-300 dark:bg-blue-800';
    if (count < 20) return 'bg-blue-400 dark:bg-blue-700';
    if (count < 30) return 'bg-blue-500 dark:bg-blue-600';
    return 'bg-blue-600 dark:bg-blue-500';
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Study Activity</Card.Title>
        <Card.Description>Your study pattern over the last 7 weeks</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col space-y-1">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex space-x-1">
              {week.map((day) => {
                const date = new Date(day.date);
                return (
                  <div 
                    key={day.date}
                    className={`h-4 w-4 rounded-sm ${getIntensity(day.count)}`}
                    title={`${date.toLocaleDateString()}: ${day.count} reviews`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-2">Less</span>
          <div className="flex space-x-1">
            <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" />
            <div className="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" />
            <div className="h-3 w-3 rounded-sm bg-blue-400 dark:bg-blue-700" />
            <div className="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" />
            <div className="h-3 w-3 rounded-sm bg-blue-600 dark:bg-blue-500" />
          </div>
          <span className="ml-2">More</span>
        </div>
      </Card.Content>
    </Card>
  );
};

export default StudyHeatmap;