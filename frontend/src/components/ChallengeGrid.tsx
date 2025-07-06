import React, { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import SQLInjectionChallenge from './SQLInjectionChallenge';
import XSSChallenge from './XSSChallenge';
import CryptoChallenge from './CryptoChallenge';
import NetworkChallenge from './NetworkChallenge';
import { useGame } from '../context/GameContext';

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate';
  category: string;
  points: number;
  participants: number;
  timeEstimate: string;
  completionRate: number;
}

interface ChallengeGridProps {
  onChallengeStateChange?: (isOpen: boolean) => void;
}

// Mock data remains the same
const mockChallenges: Challenge[] = [
    { id: 1, title: 'SQL Injection Mastery', description: 'Master SQL injection attacks from basic bypasses to advanced techniques including blind injection and WAF bypass.', difficulty: 'Beginner', category: 'Web Security', points: 300, participants: 2843, timeEstimate: '45 min', completionRate: 78 },
    { id: 2, title: 'Cross-Site Scripting (XSS)', description: 'Learn to exploit XSS vulnerabilities including reflected, stored, and DOM-based attacks with CSP bypasses.', difficulty: 'Intermediate', category: 'Web Security', points: 250, participants: 1847, timeEstimate: '35 min', completionRate: 65 },
    { id: 3, title: 'Cryptography Challenges', description: 'Break classical ciphers, analyze weak implementations, and crack hashes using various cryptanalysis techniques.', difficulty: 'Intermediate', category: 'Cryptography', points: 275, participants: 1247, timeEstimate: '50 min', completionRate: 42 },
    { id: 4, title: 'Network Security Fundamentals', description: 'Test your knowledge of network protocols, security concepts, and common attack vectors in network environments.', difficulty: 'Beginner', category: 'Network Security', points: 200, participants: 3156, timeEstimate: '25 min', completionRate: 71 },
];

const ChallengeGrid: React.FC<ChallengeGridProps> = ({ onChallengeStateChange }) => {
  const [filter, setFilter] = useState<string>('All');
  const [showSQLChallenge, setShowSQLChallenge] = useState(false);
  const [showXSSChallenge, setShowXSSChallenge] = useState(false);
  const [showCryptoChallenge, setShowCryptoChallenge] = useState(false);
  const [showNetworkChallenge, setShowNetworkChallenge] = useState(false);
  const { completeChallenge, updateUserScore } = useGame();

  const handleChallengeComplete = (score: number) => {
    completeChallenge('challenge-completed', score);
    updateUserScore('challenge-completed', score, 1, 0);
  };

  const handleChallengeClick = (challenge: Challenge) => {
    // Notify parent that a challenge is opening
    if (onChallengeStateChange) {
      onChallengeStateChange(true);
    }
    
    switch (challenge.title) {
      case 'SQL Injection Mastery':
        setShowSQLChallenge(true);
        break;
      case 'Cross-Site Scripting (XSS)':
        setShowXSSChallenge(true);
        break;
      case 'Cryptography Challenges':
        setShowCryptoChallenge(true);
        break;
      case 'Network Security Fundamentals':
        setShowNetworkChallenge(true);
        break;
      default:
        alert(`${challenge.title} challenge coming soon!`);
    }
  };

  const categories = ['All', 'Web Security', 'Cryptography', 'Network Security'];

  const difficultyColors = {
    'Beginner': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    'Intermediate': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  const filteredChallenges = mockChallenges.filter(challenge =>
    filter === 'All' || challenge.category === filter
  );

  const handleClose = () => {
    setShowSQLChallenge(false);
    setShowXSSChallenge(false);
    setShowCryptoChallenge(false);
    setShowNetworkChallenge(false);
    
    // Notify parent that challenge is closing
    if (onChallengeStateChange) {
      onChallengeStateChange(false);
    }
    
    // Ensure user stays on the challenge grid when closing modals
    setTimeout(() => {
      const challengesSection = document.getElementById('challenges');
      if (challengesSection) {
        challengesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Small delay to ensure modal is closed first
  };

  return (
    <section id="challenges" className="relative py-20 overflow-hidden min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50">
        {/* Animated Background from Login Page */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300CED1%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Cybersecurity Challenges
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Test your skills across multiple domains of cybersecurity. From web application vulnerabilities to cryptographic challenges.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                filter === category
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border-transparent transform scale-105'
                  : 'bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-cyan-500/10 hover:text-cyan-600 border-slate-200 hover:border-cyan-400/50 hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => handleChallengeClick(challenge)}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl border border-cyan-200/50 shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">
                      {challenge.title}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-600">{challenge.points}</div>
                    <div className="text-xs text-slate-500">points</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-slate-500 border-t border-b border-slate-200/80 py-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs font-medium">{challenge.timeEstimate}</span>
                  </div>
                </div>

                {/* Progress Bar & Success Rate */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-cyan-700">Success Rate</span>
                        <span className="text-xs font-bold text-slate-600">{challenge.completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${challenge.completionRate}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/80">
                  <span className="text-sm text-slate-500">{challenge.category}</span>
                  <div className="flex items-center text-cyan-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-semibold mr-1">
                      Start Challenge
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Challenge Modals */}
            <SQLInjectionChallenge isOpen={showSQLChallenge} onClose={handleClose} onComplete={handleChallengeComplete} />
            <XSSChallenge isOpen={showXSSChallenge} onClose={handleClose} onComplete={handleChallengeComplete} />
            <CryptoChallenge isOpen={showCryptoChallenge} onClose={handleClose} onComplete={handleChallengeComplete} />
            <NetworkChallenge isOpen={showNetworkChallenge} onClose={handleClose} onComplete={handleChallengeComplete} />
      </div>
    </section>
  );
};

export default ChallengeGrid;