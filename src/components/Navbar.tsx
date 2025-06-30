import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Trophy, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-cyber-darker/80 backdrop-blur-md border-b border-cyber-blue/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyber-blue" />
              <div className="absolute inset-0 w-8 h-8 text-cyber-blue opacity-50 animate-pulse-slow" />
            </div>
            <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              HackQuest
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#challenges" className="text-gray-300 hover:text-cyber-blue transition-colors font-inter">
              Challenges
            </a>
            <a href="#leaderboard" className="text-gray-300 hover:text-cyber-blue transition-colors font-inter">
              Leaderboard
            </a>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-300 hover:text-cyber-blue transition-colors">
                <Trophy className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-300 hover:text-cyber-blue transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-cyber-blue transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-blue/20">
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <a href="#challenges" className="block text-gray-300 hover:text-cyber-blue transition-colors font-inter">
                Challenges
              </a>
              <a href="#leaderboard" className="block text-gray-300 hover:text-cyber-blue transition-colors font-inter">
                Leaderboard
              </a>
              <div className="flex items-center space-x-4 pt-4 border-t border-cyber-blue/20">
                <button className="p-2 text-gray-300 hover:text-cyber-blue transition-colors">
                  <Trophy className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-300 hover:text-cyber-blue transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;