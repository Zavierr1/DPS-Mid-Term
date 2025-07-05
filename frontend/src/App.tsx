import { useEffect, useState } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChallengeGrid from './components/ChallengeGrid';
import Footer from './components/Footer';
import UserInitModal from './components/UserInitModal';
import { GameProvider, useGame } from './context/GameContext';

function AppContent() {
  const { currentUser, initializeUser } = useGame();
  const [showUserInit, setShowUserInit] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle URL errors (like email confirmation errors)
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.log('URL Error:', error, errorDescription);
      // Clear the URL error
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for existing local session
    const checkSession = () => {
      try {
        const currentUser = localStorage.getItem('hackquest-current-user');
        
        if (currentUser) {
          // User is authenticated locally
          if (!window.location.pathname.includes('hackquest-user')) {
            initializeUser(currentUser);
          }
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [initializeUser]);

  useEffect(() => {
    if (!currentUser && !isAuthenticated && !isLoading) {
      setShowUserInit(true);
    }
  }, [currentUser, isAuthenticated, isLoading]);

  const handleUserCreate = (username: string) => {
    initializeUser(username);
    setShowUserInit(false);
    setIsAuthenticated(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      // Clear local session
      localStorage.removeItem('hackquest-current-user');
      localStorage.removeItem('hackquest-user');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center border border-cyan-300/50">
            <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Initializing HackQuest...</h2>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50">
        <Navbar onLogout={handleLogout} />
        <Hero/>
        <ChallengeGrid />
        <Footer />
      </div>
      <UserInitModal
        isOpen={showUserInit}
        onUserCreate={handleUserCreate}
      />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;