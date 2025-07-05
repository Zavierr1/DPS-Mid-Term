import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  totalScore: number;
  rank: number;
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
  leaderboard: User[];
  userProgress: UserProgress[];
  updateUserScore: (challengeId: string, score: number, attempts: number, timeSpent: number) => void;
  completeChallenge: (challengeId: string, score: number) => void;
  initializeUser: (username: string) => void;
  refreshLeaderboard: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Helper function to get all registered users from localStorage
const getAllRegisteredUsers = (): User[] => {
  const registeredUsers = localStorage.getItem('hackquest-all-users');
  return registeredUsers ? JSON.parse(registeredUsers) : [];
};

// Helper function to save all registered users to localStorage
const saveAllRegisteredUsers = (users: User[]) => {
  localStorage.setItem('hackquest-all-users', JSON.stringify(users));
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  // Initialize leaderboard and user from localStorage
  useEffect(() => {
    // Load all registered users for leaderboard
    const allUsers = getAllRegisteredUsers();
    const sortedUsers = allUsers
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({ ...user, rank: index + 1 }));
    setLeaderboard(sortedUsers);

    // Load current user
    const savedUser = localStorage.getItem('hackquest-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
    }

    // Load user progress
    const savedProgress = localStorage.getItem('hackquest-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const initializeUser = (username: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      totalScore: 0,
      rank: leaderboard.length + 1,
      completedChallenges: [],
      streak: 0,
      country: 'Unknown',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      badges: ['Newbie Hacker']
    };

    setCurrentUser(newUser);
    localStorage.setItem('hackquest-user', JSON.stringify(newUser));

    // Add user to the global users list
    const allUsers = getAllRegisteredUsers();
    const updatedUsers = [...allUsers, newUser];
    saveAllRegisteredUsers(updatedUsers);

    // Update leaderboard
    const sortedUsers = updatedUsers
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({ ...user, rank: index + 1 }));
    setLeaderboard(sortedUsers);
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
      localStorage.setItem('hackquest-progress', JSON.stringify(updated));
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
      badges: [...currentUser.badges, ...getBadgesForScore(currentUser.totalScore + score)]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('hackquest-user', JSON.stringify(updatedUser));

    // Update user in global users list
    const allUsers = getAllRegisteredUsers();
    const updatedUsers = allUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    saveAllRegisteredUsers(updatedUsers);

    // Update leaderboard
    const sortedUsers = updatedUsers
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({ ...user, rank: index + 1 }));
    setLeaderboard(sortedUsers);
  };

  const getBadgesForScore = (score: number): string[] => {
    const badges = [];
    if (score >= 100 && !currentUser?.badges.includes('Century Club')) badges.push('Century Club');
    if (score >= 500 && !currentUser?.badges.includes('High Achiever')) badges.push('High Achiever');
    if (score >= 1000 && !currentUser?.badges.includes('Elite Scorer')) badges.push('Elite Scorer');
    if (score >= 5000 && !currentUser?.badges.includes('Master Hacker')) badges.push('Master Hacker');
    return badges.filter(badge => !currentUser?.badges.includes(badge));
  };

  const refreshLeaderboard = () => {
    // Refresh from localStorage and simulate real-time updates
    const allUsers = getAllRegisteredUsers();
    const updatedUsers = allUsers.map(user => ({
      ...user,
      lastActive: Math.random() > 0.7 ? new Date().toISOString() : user.lastActive
    }));
    
    const sortedUsers = updatedUsers
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({ ...user, rank: index + 1 }));
    
    setLeaderboard(sortedUsers);
  };

  return (
    <GameContext.Provider value={{
      currentUser,
      leaderboard,
      userProgress,
      updateUserScore,
      completeChallenge,
      initializeUser,
      refreshLeaderboard
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
