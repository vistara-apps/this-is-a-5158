import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GenerateView from './components/GenerateView';
import BatchView from './components/BatchView';
import TemplatesView from './components/TemplatesView';
import HistoryView from './components/HistoryView';
import AccountView from './components/AccountView';

function App() {
  const [currentView, setCurrentView] = useState('generate');
  const [user, setUser] = useState({
    email: 'user@example.com',
    credits: 45,
    subscriptionTier: 'Pro',
  });
  const [generationHistory, setGenerationHistory] = useState([]);

  const addToHistory = (generation) => {
    setGenerationHistory(prev => [generation, ...prev]);
  };

  const useCredits = (amount) => {
    setUser(prev => ({
      ...prev,
      credits: Math.max(0, prev.credits - amount)
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'generate':
        return <GenerateView user={user} addToHistory={addToHistory} useCredits={useCredits} />;
      case 'batch':
        return <BatchView user={user} addToHistory={addToHistory} useCredits={useCredits} />;
      case 'templates':
        return <TemplatesView user={user} addToHistory={addToHistory} useCredits={useCredits} />;
      case 'history':
        return <HistoryView history={generationHistory} />;
      case 'account':
        return <AccountView user={user} setUser={setUser} />;
      default:
        return <GenerateView user={user} addToHistory={addToHistory} useCredits={useCredits} />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg text-textPrimary">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header user={user} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;