import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onLogout?: () => void;
  isDisabled?: boolean;
  user?: {
    username?: string;
    email?: string;
    avatar?: string;
  };
  currentUser?: any; // Add Firebase user as fallback
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, isDisabled, user, currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Effect to handle navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-cyan-200/50 shadow-sm' 
          : 'bg-slate-200/50 backdrop-blur-md border-b border-cyan-200/50 shadow-none'
      } ${isDisabled ? 'pointer-events-none blur-sm opacity-50' : ''}`}
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
              HackQuest
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              {/* User Icon/Avatar - Always show when user is logged in */}
              {currentUser && (
                <div className="relative">
                  <button
                    className="flex items-center focus:outline-none hover:scale-105 transition-transform"
                    onClick={() => setShowUserDropdown((v) => !v)}
                    title={`User: ${user?.username || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Agent'}`}
                  >
                    {user?.avatar ? (
                      <>
                        <img
                          src={user.avatar}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full border-2 border-cyan-400 shadow-sm"
                          onError={(e) => {
                            console.log("Avatar image failed to load, falling back to icon");
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentNode?.querySelector('.fallback-icon');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <UserIcon className="fallback-icon hidden w-8 h-8 text-cyan-600 hover:text-cyan-700 transition-colors" />
                      </>
                    ) : (
                      <UserIcon className="w-8 h-8 text-cyan-600 hover:text-cyan-700 transition-colors" />
                    )}
                  </button>
                  {showUserDropdown && currentUser && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-cyan-100 rounded-lg shadow-lg z-50 p-4 text-left">
                      <div className="flex items-center space-x-3 mb-3">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt="User Avatar" 
                            className="w-10 h-10 rounded-full border-2 border-cyan-400"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <UserIcon className={`w-10 h-10 text-cyan-600 ${user?.avatar ? 'hidden' : ''}`} />
                        <div>
                          <div className="font-bold text-cyan-700 text-lg">{user?.username || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Agent'}</div>
                          <div className="text-xs text-slate-500">{user?.email || currentUser?.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              {onLogout && !currentUser && (
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
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-cyan-200/50 shadow-lg"
          >
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <div className="flex items-center space-x-4 pt-4 border-t border-cyan-200/50 justify-between">
                {/* User Icon for Mobile */}
                {currentUser && (
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border-2 border-cyan-400 shadow-sm"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-cyan-600" />
                    )}
                    <div>
                      <div className="font-bold text-cyan-700">{user?.username || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Agent'}</div>
                      <div className="text-xs text-slate-500">{user?.email || currentUser?.email}</div>
                    </div>
                  </div>
                )}
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