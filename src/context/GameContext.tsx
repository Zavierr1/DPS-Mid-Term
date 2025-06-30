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

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'CyberNinja',
    totalScore: 15420,
    rank: 1,
    completedChallenges: ['sql-injection', 'buffer-overflow', 'crypto-hash'],
    streak: 47,
    country: 'US',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    joinDate: '2024-01-15',
    lastActive: new Date().toISOString(),
    badges: ['Elite Hacker', 'Speed Demon', 'First Blood']
  },
  {
    id: '2',
    username: 'QuantumBreaker',
    totalScore: 14850,
    rank: 2,
    completedChallenges: ['crypto-hash', 'network-analysis'],
    streak: 32,
    country: 'DE',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    joinDate: '2024-02-08',
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    badges: ['Crypto Master', 'Persistent']
  },
  {
    id: '3',
    username: 'BinaryWitch',
    totalScore: 14230,
    rank: 3,
    completedChallenges: ['buffer-overflow', 'reverse-engineering'],
    streak: 28,
    country: 'JP',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    joinDate: '2024-01-22',
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    badges: ['Exploit Expert', 'Binary Master']
  },
  {
    id: '4',
    username: 'DataViper',
    totalScore: 13680,
    rank: 4,
    completedChallenges: ['sql-injection', 'web-security'],
    streak: 21,
    country: 'CA',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    joinDate: '2024-03-01',
    lastActive: new Date(Date.now() - 14400000).toISOString(),
    badges: ['Web Warrior', 'SQL Slayer']
  },
  {
    id: '5',
    username: 'CryptoPunk',
    totalScore: 13120,
    rank: 5,
    completedChallenges: ['crypto-hash'],
    streak: 19,
    country: 'GB',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    joinDate: '2024-02-14',
    lastActive: new Date(Date.now() - 21600000).toISOString(),
    badges: ['Hash Hunter', 'Crypto Enthusiast']
  }
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>(mockUsers);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  // Initialize user from localStorage or create new
  useEffect(() => {
    const savedUser = localStorage.getItem('hackquest-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      // Update leaderboard with saved user if not already present
      setLeaderboard(prev => {
        const exists = prev.find(u => u.id === user.id);
        if (!exists) {
          return [...prev, user].sort((a, b) => b.totalScore - a.totalScore).map((u, index) => ({
            ...u,
            rank: index + 1
          }));
        }
        return prev;
      });
    }

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

    // Update leaderboard
    setLeaderboard(prev => {
      const updated = prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      
      if (!updated.find(u => u.id === updatedUser.id)) {
        updated.push(updatedUser);
      }

      return updated
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((user, index) => ({ ...user, rank: index + 1 }));
    });
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
    // Simulate real-time updates
    setLeaderboard(prev => 
      prev.map(user => ({
        ...user,
        lastActive: Math.random() > 0.7 ? new Date().toISOString() : user.lastActive
      }))
    );
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
