import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GenerateView from './components/GenerateView';
import BatchView from './components/BatchView';
import TemplatesView from './components/TemplatesView';
import HistoryView from './components/HistoryView';
import AccountView from './components/AccountView';
import AuthModal from './components/Auth/AuthModal';
import { getUserGenerations } from './services/supabase';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('generate');
  const [generationHistory, setGenerationHistory] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const { user, profile, loading, useCredits } = useAuth();

  useEffect(() => {
    if (user && profile) {
      loadUserHistory();
    }
  }, [user, profile]);

  const loadUserHistory = async () => {
    try {
      const history = await getUserGenerations(user.id);
      setGenerationHistory(history || []);
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };

  const addToHistory = (generation) => {
    setGenerationHistory(prev => [generation, ...prev]);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const renderCurrentView = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">Welcome to PixelFlow</h2>
            <p className="text-textSecondary mb-6">Sign in to start generating amazing AI images</p>
            <div className="space-x-4">
              <button
                onClick={() => openAuthModal('login')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="bg-surface border border-border text-textPrimary hover:bg-border px-6 py-3 rounded-lg font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'generate':
        return <GenerateView user={profile} addToHistory={addToHistory} useCredits={useCredits} />;
      case 'batch':
        return <BatchView user={profile} addToHistory={addToHistory} useCredits={useCredits} />;
      case 'templates':
        return <TemplatesView user={profile} addToHistory={addToHistory} useCredits={useCredits} />;
      case 'history':
        return <HistoryView history={generationHistory} />;
      case 'account':
        return <AccountView user={profile} />;
      default:
        return <GenerateView user={profile} addToHistory={addToHistory} useCredits={useCredits} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading PixelFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg text-textPrimary">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} user={user} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header user={profile} onAuthClick={openAuthModal} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderCurrentView()}
          </main>
        </div>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(210, 20%, 12%)',
            color: 'hsl(210, 10%, 90%)',
            border: '1px solid hsl(210, 20%, 20%)',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
