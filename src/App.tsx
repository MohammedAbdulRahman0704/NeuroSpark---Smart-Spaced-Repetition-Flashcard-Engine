import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
import CreateDeckForm from './components/flashcards/CreateDeckForm';
import DeckDetail from './components/flashcards/DeckDetail';
import ReviewSession from './components/flashcards/ReviewSession';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [reviewingDeckId, setReviewingDeckId] = useState<string | null>(null);
  
  // Extract deck ID from page name if it starts with "deck-"
  const deckId = activePage.startsWith('deck-') ? activePage.substring(5) : '';
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    
    // Reset reviewing state if navigating away from review
    if (reviewingDeckId && page !== 'review') {
      setReviewingDeckId(null);
    }
  };
  
  const handleStartReview = (deckId: string) => {
    setReviewingDeckId(deckId);
    setActivePage('review');
  };
  
  const handleExitReview = () => {
    setReviewingDeckId(null);
    
    // Navigate back to the deck detail
    if (deckId) {
      setActivePage(`deck-${deckId}`);
    } else {
      setActivePage('home');
    }
  };
  
  // Update page title
  useEffect(() => {
    let title = 'NeuroSpark';
    
    switch (activePage) {
      case 'home':
        title = 'NeuroSpark - Smart Flashcards';
        break;
      case 'dashboard':
        title = 'Dashboard - NeuroSpark';
        break;
      case 'create-deck':
        title = 'Create Deck - NeuroSpark';
        break;
      case 'review':
        title = 'Review Session - NeuroSpark';
        break;
      default:
        if (activePage.startsWith('deck-')) {
          title = 'Deck Details - NeuroSpark';
        }
    }
    
    document.title = title;
  }, [activePage]);
  
  return (
    <ThemeProvider>
      <FlashcardProvider>
        <Layout 
          activePage={activePage}
          setActivePage={handleNavigate}
        >
          {activePage === 'home' && <Home onNavigate={handleNavigate} />}
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'create-deck' && (
            <CreateDeckForm onComplete={() => handleNavigate('home')} />
          )}
          {activePage.startsWith('deck-') && !reviewingDeckId && (
            <DeckDetail deckId={deckId} onStartReview={handleStartReview} />
          )}
          {activePage === 'review' && reviewingDeckId && (
            <ReviewSession deckId={reviewingDeckId} onExit={handleExitReview} />
          )}
        </Layout>
      </FlashcardProvider>
    </ThemeProvider>
  );
};

export default App;