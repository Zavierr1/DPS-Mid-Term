import { useEffect, useState } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChallengeGrid from './components/ChallengeGrid';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';
import UserInitModal from './components/UserInitModal';
import { GameProvider, useGame } from './context/GameContext';

function AppContent() {
  const { currentUser, initializeUser } = useGame();
  const [showUserInit, setShowUserInit] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!currentUser && !isAuthenticated) {
      setShowUserInit(true);
    }
  }, [currentUser, isAuthenticated]);

  const handleUserCreate = (username: string) => {
    initializeUser(username);
    setShowUserInit(false);
    setIsAuthenticated(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50">
        <Navbar />
        <Hero/>
        <ChallengeGrid />
        <Leaderboard />
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