import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This will log you out and delete all users, progress, and leaderboard data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-cyan-200/50 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-600" />
              <div className="absolute inset-0 w-8 h-8 text-cyan-600 opacity-50 animate-pulse-slow" />
            </div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              GoonerQuest
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              {/* Reset Database Button */}
              <button
                onClick={handleReset}
                className="px-3 py-2 font-semibold text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                style={{ minWidth: 0 }}
                title="Reset all app data (for testing)"
              >
                Reset Database

              </button>
              {onLogout && (
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-600 hover:text-cyan-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-cyan-200/50 shadow-lg">
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <div className="flex items-center space-x-4 pt-4 border-t border-cyan-200/50 justify-end">
                {/* Reset Database Button (Mobile) */}
                <button
                  onClick={handleReset}
                  className="px-3 py-2 font-semibold text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  style={{ minWidth: 0 }}
                  title="Reset all app data (for testing)"
                >
                  Reset Database
                </button>
                {onLogout && (
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
