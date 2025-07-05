import React, { useState } from 'react';
import { User, Terminal, Zap } from 'lucide-react';

interface UserInitModalProps {
  isOpen: boolean;
  onUserCreate: (username: string) => void;
}

interface UserData {
  username: string;
  password: string;
  createdAt: string;
}

const DEFAULT_PASSWORD = '123456';

const UserInitModal: React.FC<UserInitModalProps> = ({ isOpen, onUserCreate }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions for local authentication
  const getUsers = (): UserData[] => {
    const users = localStorage.getItem('hackquest-users');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (userData: UserData) => {
    const users = getUsers();
    const existingUserIndex = users.findIndex(u => u.username === userData.username);
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = userData;
    } else {
      users.push(userData);
    }
    localStorage.setItem('hackquest-users', JSON.stringify(users));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsSubmitting(true);
    try {
      // Add user to hackquest-users with default password
      const newUser: UserData = {
        username: username.trim(),
        password: DEFAULT_PASSWORD,
        createdAt: new Date().toISOString()
      };
      saveUser(newUser);
      // Store the username in localStorage for the current session
      localStorage.setItem('hackquest-current-user', username.trim());
      // Call the parent handler to initialize the user
      onUserCreate(username.trim());
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-cyan-200/50 w-full max-w-md p-8 shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center border border-cyan-300/50">
            <Terminal className="w-8 h-8 text-cyan-600" />
          </div>
          <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-800 bg-clip-text text-transparent mb-2">
            Welcome, Agent
          </h2>
          <p className="text-slate-600">
            Choose your callsign to begin the mission.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 font-primary">
              Agent Callsign
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., Ghost, Viper, Neo"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                maxLength={20}
                required
              />
            </div>
             <p className="text-xs text-slate-500 mt-2">
                Max 20 characters. This will be your legend on the leaderboard.<br/>
                <span className="text-cyan-600 font-bold">Default password: {DEFAULT_PASSWORD}</span>
             </p>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isSubmitting}
            className="w-full group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-heading"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Initializing Profile...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  <span>Go Online</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Footer Stats */}
        <div className="mt-8 pt-6 border-t border-slate-200/80">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-cyan-600">15K+</div>
              <div className="text-slate-500 text-xs">Agents Online</div>
            </div>
            <div>
              <div className="font-bold text-cyan-600">50+</div>
              <div className="text-slate-500 text-xs">Live Challenges</div>
            </div>
            <div>
              <div className="font-bold text-cyan-600">24/7</div>
              <div className="text-slate-500 text-xs">Learning Hub</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserInitModal;

