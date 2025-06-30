import React, { useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Star, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Leaderboard: React.FC = () => {
  const { leaderboard, currentUser, refreshLeaderboard } = useGame();

  useEffect(() => {
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(refreshLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [refreshLeaderboard]);

  const handleRefresh = () => {
    refreshLeaderboard();
  };
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-cyber-orange" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-cyber-orange/20 to-cyber-pink/20 border-cyber-orange/40';
      case 2:
        return 'from-gray-500/20 to-gray-300/20 border-gray-400/40';
      case 3:
        return 'from-amber-600/20 to-amber-400/20 border-amber-500/40';
      default:
        return 'from-cyber-blue/20 to-cyber-purple/20 border-cyber-blue/30';
    }
  };

  return (
    <section id="leaderboard" className="py-20 bg-cyber-darker relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-purple/5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-cyber-orange to-cyber-pink bg-clip-text text-transparent">
              Global Leaderboard
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-inter">
            See where you rank among the world's top cybersecurity experts
          </p>
        </div>

        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-orange/20 to-cyber-pink/20 backdrop-blur-sm border border-cyber-orange/30 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-cyber-orange" />
            </div>
            <div className="text-2xl font-bold text-white font-orbitron mb-2">98,547</div>
            <div className="text-gray-400 font-inter">Active Hackers</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 backdrop-blur-sm border border-cyber-blue/30 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-cyber-blue" />
            </div>
            <div className="text-2xl font-bold text-white font-orbitron mb-2">2.4M</div>
            <div className="text-gray-400 font-inter">Points Earned</div>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-green/20 to-cyber-blue/20 backdrop-blur-sm border border-cyber-green/30 flex items-center justify-center">
              <Star className="w-8 h-8 text-cyber-green" />
            </div>
            <div className="text-2xl font-bold text-white font-orbitron mb-2">156</div>
            <div className="text-gray-400 font-inter">Countries</div>
          </div>
        </div>

        {/* Top Hackers */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-orbitron font-bold text-white">
              Top Hackers This Month
            </h3>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30 rounded-lg text-cyber-blue font-semibold hover:from-cyber-blue/30 hover:to-cyber-purple/30 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-4">
            {leaderboard.slice(0, 10).map((user) => (
              <div
                key={user.id}
                className={`group relative bg-gradient-to-r ${getRankGradient(user.rank)} backdrop-blur-sm border rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl ${currentUser?.id === user.id ? 'ring-2 ring-cyber-orange/50' : ''}`}
              >
                <div className="flex items-center space-x-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full border-2 border-cyber-blue/50"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-bold text-white font-orbitron truncate">
                        {user.username}
                        {currentUser?.id === user.id && <span className="text-cyber-orange ml-2">(You)</span>}
                      </h4>
                      <span className="text-xs px-2 py-1 bg-cyber-blue/20 text-cyber-blue rounded-full">
                        {user.badges[0] || 'Hacker'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{user.country}</span>
                      <span>•</span>
                      <span>🔥 {user.streak} day streak</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-white font-orbitron">
                      {user.totalScore.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">points</div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30 rounded-lg text-cyber-blue font-semibold hover:from-cyber-blue/30 hover:to-cyber-purple/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-blue/20">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;