import React, { useState } from 'react';
import { Difficulty } from '../../types';
import Button from '../ui/Button';

interface FlashcardItemProps {
  front: string;
  back: string;
  onReview: (difficulty: Difficulty) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ front, back, onReview }) => {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  
  const handleFlip = () => {
    if (animating) return;
    
    setAnimating(true);
    setFlipped(prev => !prev);
    
    // Show rating buttons after flip to back
    if (!flipped) {
      setTimeout(() => {
        setShowButtons(true);
      }, 300);
    } else {
      setShowButtons(false);
    }
    
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };
  
  const handleReview = (difficulty: Difficulty) => {
    onReview(difficulty);
    setFlipped(false);
    setShowButtons(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative w-full aspect-[3/2] md:aspect-[2/1] cursor-pointer
          perspective-1000 
        `}
        onClick={handleFlip}
      >
        <div 
          className={`
            relative w-full h-full transition-transform duration-300 transform-style-preserve-3d
            ${flipped ? 'rotate-y-180' : ''}
            ${animating ? 'pointer-events-none' : ''}
          `}
        >
          {/* Front side */}
          <div 
            className={`
              absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8
              flex items-center justify-center backface-hidden
              border-2 border-gray-200 dark:border-gray-700
            `}
          >
            <div className="text-lg md:text-xl text-center">{front}</div>
          </div>
          
          {/* Back side */}
          <div 
            className={`
              absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8
              flex items-center justify-center backface-hidden rotate-y-180
              border-2 border-blue-200 dark:border-blue-900
            `}
          >
            <div className="text-lg md:text-xl text-center">{back}</div>
          </div>
        </div>
      </div>
      
      {/* Rating buttons */}
      {showButtons && (
        <div className="mt-8 flex flex-wrap justify-center gap-3 w-full transition-opacity duration-300">
          <Button 
            variant="danger" 
            onClick={() => handleReview('again')}
          >
            Again
          </Button>
          <Button 
            variant="warning" 
            onClick={() => handleReview('hard')}
          >
            Hard
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleReview('good')}
          >
            Good
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleReview('easy')}
          >
            Easy
          </Button>
        </div>
      )}
      
      {!showButtons && (
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          {flipped ? 'Rate your answer' : 'Tap to flip'}
        </div>
      )}
    </div>
  );
};

export default FlashcardItem;