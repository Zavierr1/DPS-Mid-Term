import React, { useState } from 'react';
import { User, Gamepad2 } from 'lucide-react';

interface UserInitModalProps {
  isOpen: boolean;
  onUserCreate: (username: string) => void;
}

const UserInitModal: React.FC<UserInitModalProps> = ({ isOpen, onUserCreate }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onUserCreate(username.trim());
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cyber-darker/95 to-cyber-dark/95 backdrop-blur-lg border border-cyber-blue/30 rounded-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 backdrop-blur-sm border border-cyber-blue/30 flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-cyber-blue" />
          </div>
          <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
            Welcome to HackQuest
          </h2>
          <p className="text-gray-300 text-sm">
            Enter your hacker name to start your cybersecurity journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">
              Choose Your Hacker Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                className="w-full pl-10 pr-4 py-3 bg-cyber-dark/50 border border-cyber-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20"
                maxLength={20}
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Max 20 characters. This will be your display name on the leaderboard.
            </p>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyber-blue/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <span>Start Hacking</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="text-cyber-blue">
              <div className="font-bold">15K+</div>
              <div className="text-gray-400">Hackers</div>
            </div>
            <div className="text-cyber-green">
              <div className="font-bold">50+</div>
              <div className="text-gray-400">Challenges</div>
            </div>
            <div className="text-cyber-orange">
              <div className="font-bold">24/7</div>
              <div className="text-gray-400">Learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInitModal;
