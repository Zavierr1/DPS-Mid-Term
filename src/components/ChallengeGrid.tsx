import React, { useState } from 'react';
import { Lock, Clock, Users, Trophy, ChevronRight } from 'lucide-react';
import SQLInjectionChallenge from './SQLInjectionChallenge';
import { useGame } from '../context/GameContext';

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  points: number;
  participants: number;
  timeEstimate: string;
  isLocked: boolean;
  completionRate: number;
}

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: 'SQL Injection Basics',
    description: 'Learn the fundamentals of SQL injection attacks and how to exploit vulnerable web applications.',
    difficulty: 'Beginner',
    category: 'Web Security',
    points: 100,
    participants: 2843,
    timeEstimate: '30 min',
    isLocked: false,
    completionRate: 78
  },
  {
    id: 2,
    title: 'Buffer Overflow Exploitation',
    description: 'Master the art of buffer overflow attacks and exploit memory corruption vulnerabilities.',
    difficulty: 'Advanced',
    category: 'Binary Exploitation',
    points: 500,
    participants: 1247,
    timeEstimate: '2 hrs',
    isLocked: false,
    completionRate: 34
  },
  {
    id: 3,
    title: 'Cryptographic Hash Cracking',
    description: 'Break various hash algorithms and understand cryptographic weaknesses.',
    difficulty: 'Intermediate',
    category: 'Cryptography',
    points: 250,
    participants: 1876,
    timeEstimate: '1 hr',
    isLocked: false,
    completionRate: 52
  },
  {
    id: 4,
    title: 'Advanced Persistent Threat',
    description: 'Simulate an APT attack chain and maintain persistence in enterprise networks.',
    difficulty: 'Expert',
    category: 'Network Security',
    points: 1000,
    participants: 456,
    timeEstimate: '4 hrs',
    isLocked: true,
    completionRate: 12
  },
  {
    id: 5,
    title: 'XSS Attack Vectors',
    description: 'Explore cross-site scripting vulnerabilities and bypass modern web defenses.',
    difficulty: 'Intermediate',
    category: 'Web Security',
    points: 200,
    participants: 3241,
    timeEstimate: '45 min',
    isLocked: false,
    completionRate: 65
  },
  {
    id: 6,
    title: 'Reverse Engineering Malware',
    description: 'Analyze and reverse engineer sophisticated malware samples.',
    difficulty: 'Expert',
    category: 'Malware Analysis',
    points: 800,
    participants: 678,
    timeEstimate: '3 hrs',
    isLocked: true,
    completionRate: 23
  }
];

const ChallengeGrid: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [showSQLChallenge, setShowSQLChallenge] = useState(false);
  const { completeChallenge, updateUserScore } = useGame();

  const handleChallengeComplete = (score: number) => {
    completeChallenge('sql-injection', score);
    updateUserScore('sql-injection', score, 1, 0);
  };

  const handleChallengeClick = (challenge: Challenge) => {
    if (challenge.title === 'SQL Injection Basics') {
      setShowSQLChallenge(true);
    } else {
      // Placeholder for other challenges
      alert(`${challenge.title} challenge coming soon!`);
    }
  };

  const categories = ['All', 'Web Security', 'Binary Exploitation', 'Cryptography', 'Network Security', 'Malware Analysis'];
  
  const difficultyColors = {
    'Beginner': 'from-cyber-green to-cyber-blue',
    'Intermediate': 'from-cyber-blue to-cyber-purple',
    'Advanced': 'from-cyber-purple to-cyber-pink',
    'Expert': 'from-cyber-orange to-cyber-pink'
  };

  const filteredChallenges = mockChallenges.filter(challenge => 
    filter === 'All' || challenge.category === filter
  );

  return (
    <section id="challenges" className="py-20 bg-cyber-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%2300D4FF%22 fill-opacity=%221%22%3E%3Cpath d=%22M20 20h20v20H20V20zm-20 0h20v20H0V20z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Cybersecurity Challenges
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-inter">
            Test your skills against real-world scenarios and climb the leaderboard
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === category
                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white shadow-lg shadow-cyber-blue/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 backdrop-blur-sm border border-white/10'
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
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-cyber-blue/10"
            >
              {/* Lock Overlay */}
              {challenge.isLocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-cyber-orange mx-auto mb-2" />
                    <p className="text-cyber-orange font-semibold">Complete Prerequisites</p>
                  </div>
                </div>
              )}

              {/* Difficulty Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[challenge.difficulty]} text-white text-sm font-semibold`}>
                {challenge.difficulty}
              </div>

              {/* Category */}
              <div className="text-cyber-blue text-sm font-semibold mb-2 font-inter">
                {challenge.category}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 font-orbitron group-hover:text-cyber-blue transition-colors">
                {challenge.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 mb-6 text-sm leading-relaxed font-inter">
                {challenge.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-cyber-orange" />
                  <span>{challenge.points} pts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-cyber-blue" />
                  <span>{challenge.participants.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-cyber-green" />
                  <span>{challenge.timeEstimate}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Completion Rate</span>
                  <span>{challenge.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyber-green to-cyber-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${challenge.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleChallengeClick(challenge)}
                disabled={challenge.isLocked}
                className="w-full py-3 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30 rounded-lg text-cyber-blue font-semibold hover:from-cyber-blue/30 hover:to-cyber-purple/30 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-cyber-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{challenge.isLocked ? 'Locked' : 'Start Challenge'}</span>
                {!challenge.isLocked && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        {/* SQL Injection Challenge Modal */}
        <SQLInjectionChallenge
          isOpen={showSQLChallenge}
          onClose={() => setShowSQLChallenge(false)}
          onComplete={handleChallengeComplete}
        />
      </div>
    </section>
  );
};

export default ChallengeGrid;