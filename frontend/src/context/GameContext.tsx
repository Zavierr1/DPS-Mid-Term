import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  totalScore: number;
  completedChallenges: string[];
  streak: number;
  country: string;
  avatar: string;
  joinDate: string;
  lastActive: string;
  badges: string[];
}

interface UserProgress {
  challengeId: string;
  score: number;
  completedAt: string;
  attempts: number;
  timeSpent: number;
}

interface GameContextType {
  currentUser: User | null;
  userProgress: UserProgress[];
  updateUserScore: (challengeId: string, score: number, attempts: number, timeSpent: number) => void;
  completeChallenge: (challengeId: string, score: number) => void;
  initializeUser: (username: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  const initializeUser = (username: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      totalScore: 0,
      completedChallenges: [],
      streak: 0,
      country: 'Unknown',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      badges: ['Newbie Hacker']
    };

    setCurrentUser(newUser);
  };

  const updateUserScore = (challengeId: string, score: number, attempts: number, timeSpent: number) => {
    if (!currentUser) return;

    const newProgress: UserProgress = {
      challengeId,
      score,
      completedAt: new Date().toISOString(),
      attempts,
      timeSpent
    };

    setUserProgress(prev => {
      const updated = [...prev.filter(p => p.challengeId !== challengeId), newProgress];
      return updated;
    });
  };

  const completeChallenge = (challengeId: string, score: number) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      totalScore: currentUser.totalScore + score,
      completedChallenges: [...currentUser.completedChallenges.filter(id => id !== challengeId), challengeId],
      streak: currentUser.streak + 1,
      lastActive: new Date().toISOString(),
      badges: [...currentUser.badges]
    };

    setCurrentUser(updatedUser);
  };

  return (
    <GameContext.Provider value={{
      currentUser,
      userProgress,
      updateUserScore,
      completeChallenge,
      initializeUser
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
