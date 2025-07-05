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
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-slate-500 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-amber-50 to-yellow-50 border-amber-200';
      case 2:
        return 'from-slate-50 to-gray-50 border-slate-200';
      case 3:
        return 'from-amber-50 to-orange-50 border-amber-200';
      default:
        return 'from-cyan-50 to-blue-50 border-cyan-200';
    }
  };

  return (
    <section id="leaderboard" className="py-20 bg-gradient-to-br from-slate-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/20 via-transparent to-blue-100/20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Global Leaderboard
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-primary">
            See where you rank among the world's top cybersecurity experts
          </p>
        </div>

        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm border border-cyan-200/50 rounded-xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 backdrop-blur-sm border border-cyan-300 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-cyan-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 font-heading mb-2">{leaderboard.length}</div>
            <div className="text-slate-600 font-primary">Active Hackers</div>
          </div>

          <div className="text-center p-6 bg-white/70 backdrop-blur-sm border border-cyan-200/50 rounded-xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 backdrop-blur-sm border border-blue-300 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 font-heading mb-2">
              {leaderboard.reduce((total, user) => total + user.totalScore, 0).toLocaleString()}
            </div>
            <div className="text-slate-600 font-primary">Points Earned</div>
          </div>

          <div className="text-center p-6 bg-white/70 backdrop-blur-sm border border-cyan-200/50 rounded-xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 backdrop-blur-sm border border-teal-300 flex items-center justify-center">
              <Star className="w-8 h-8 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 font-heading mb-2">
              {new Set(leaderboard.map(user => user.country)).size}
            </div>
            <div className="text-slate-600 font-primary">Countries</div>
          </div>
        </div>

        {/* Top Hackers */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-heading font-bold text-slate-800">
              Top Hackers This Month
            </h3>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300 rounded-lg text-cyan-700 font-semibold hover:from-cyan-200 hover:to-blue-200 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 backdrop-blur-sm border border-cyan-300 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-800 mb-4">
                  No Hackers Yet!
                </h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  Be the first to join the ranks of elite cybersecurity experts. 
                  Complete challenges to appear on this leaderboard.
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300 rounded-lg text-cyan-700 font-semibold">
                  <Star className="w-5 h-5 mr-2" />
                  Start Your Journey
                </div>
              </div>
            ) : (
              leaderboard.slice(0, 10).map((user) => (
                <div
                  key={user.id}
                  className={`group relative bg-gradient-to-r ${getRankGradient(user.rank)} backdrop-blur-sm border rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg ${currentUser?.id === user.id ? 'ring-2 ring-cyan-400/50' : ''}`}
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
                        className="w-12 h-12 rounded-full border-2 border-cyan-300"
                      />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-bold text-slate-800 font-heading truncate">
                          {user.username}
                          {currentUser?.id === user.id && <span className="text-cyan-600 ml-2">(You)</span>}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">
                          {user.badges[0] || 'Hacker'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                        <span>{user.country}</span>
                        <span>•</span>
                        <span>🔥 {user.streak} day streak</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-slate-800 font-heading">
                        {user.totalScore.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">points</div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/30 to-blue-100/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))
            )}
          </div>

          {/* View More Button */}
          {leaderboard.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300 rounded-lg text-cyan-700 font-semibold hover:from-cyan-200 hover:to-blue-200 transition-all duration-300 hover:shadow-lg">
                View Full Leaderboard
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
