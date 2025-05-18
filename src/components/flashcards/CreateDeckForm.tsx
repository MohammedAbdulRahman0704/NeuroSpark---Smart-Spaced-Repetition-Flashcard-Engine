import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useFlashcards } from '../../contexts/FlashcardContext';

interface CreateDeckFormProps {
  onComplete: () => void;
}

const CreateDeckForm: React.FC<CreateDeckFormProps> = ({ onComplete }) => {
  const { addDeck } = useFlashcards();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Deck name is required');
      return;
    }
    
    // Create new deck
    addDeck({
      name: name.trim(),
      description: description.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    
    // Reset form and navigate
    setName('');
    setDescription('');
    setTags('');
    setError('');
    onComplete();
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Header>
        <Card.Title>Create New Deck</Card.Title>
        <Card.Description>Create a new flashcard deck to organize your study materials</Card.Description>
      </Card.Header>
      
      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deck Name *
            </label>
            <input
              id="deck-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                        bg-white dark:bg-gray-800"
              placeholder="e.g., Spanish Vocabulary"
            />
          </div>
          
          <div>
            <label htmlFor="deck-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="deck-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                        bg-white dark:bg-gray-800"
              placeholder="A brief description of this deck"
            />
          </div>
          
          <div>
            <label htmlFor="deck-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              id="deck-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                        bg-white dark:bg-gray-800"
              placeholder="language, spanish, vocabulary (comma separated)"
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
            Create Deck
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default CreateDeckForm;