import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useFlashcards } from '../../contexts/FlashcardContext';

interface CreateFlashcardFormProps {
  deckId: string;
  onComplete: () => void;
}

const CreateFlashcardForm: React.FC<CreateFlashcardFormProps> = ({ deckId, onComplete }) => {
  const { addFlashcard } = useFlashcards();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!front.trim()) {
      setError('Front side content is required');
      return;
    }
    
    if (!back.trim()) {
      setError('Back side content is required');
      return;
    }
    
    // Create new flashcard
    addFlashcard({
      front: front.trim(),
      back: back.trim(),
      deckId,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    
    // Reset form
    setFront('');
    setBack('');
    setTags('');
    setError('');
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Header>
        <Card.Title>Create Flashcard</Card.Title>
        <Card.Description>Add a new flashcard to your deck</Card.Description>
      </Card.Header>
      
      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="card-front" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Front Side *
            </label>
            <textarea
              id="card-front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                        bg-white dark:bg-gray-800"
              placeholder="Question or prompt"
            />
          </div>
          
          <div>
            <label htmlFor="card-back" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Back Side *
            </label>
            <textarea
              id="card-back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                        bg-white dark:bg-gray-800"
              placeholder="Answer or explanation"
            />
          </div>
          
          <div>
            <label htmlFor="card-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              id="card-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                        bg-white dark:bg-gray-800"
              placeholder="grammar, verb, important (comma separated)"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Separate tags with commas
            </p>
          </div>
        </Card.Content>
        
        <Card.Footer className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Card
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default CreateFlashcardForm;