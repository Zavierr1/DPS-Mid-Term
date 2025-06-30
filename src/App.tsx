import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!currentUser) {
      setShowUserInit(true);
    }
  }, [currentUser]);

  const handleUserCreate = (username: string) => {
    initializeUser(username);
    setShowUserInit(false);
  };

  return (
    <>
      <div className="min-h-screen bg-cyber-darker">
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