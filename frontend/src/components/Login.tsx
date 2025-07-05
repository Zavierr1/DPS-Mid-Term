import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Lock, User, Terminal, Zap } from 'lucide-react';

interface LoginProps {
  onLogin?: () => void;
}

interface UserData {
  username: string;
  password: string;
  createdAt: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  // Terminal animation effect
  useEffect(() => {
    const messages = [
      'Initializing secure connection...',
      'Establishing encrypted tunnel...',
      'Authentication system online...',
      'Ready for agent verification...'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    
    const typeWriter = () => {
      if (messageIndex < messages.length) {
        if (charIndex < messages[messageIndex].length) {
          setTerminalText(prev => prev + messages[messageIndex].charAt(charIndex));
          charIndex++;
          setTimeout(typeWriter, 50);
        } else {
          setTimeout(() => {
            setTerminalText(prev => prev + '\n');
            messageIndex++;
            charIndex = 0;
            if (messageIndex < messages.length) {
              setTimeout(typeWriter, 300);
            }
          }, 500);
        }
      }
    };

    typeWriter();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

  const authenticateUser = (username: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return !!user;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        if (authenticateUser(formData.username, formData.password)) {
          // Store current user session
          localStorage.setItem('hackquest-current-user', formData.username);
          if (onLogin) onLogin();
        } else {
          throw new Error('Invalid username or password');
        }
      } else {
        // Handle registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (formData.username.length < 3) {
          throw new Error('Username must be at least 3 characters long');
        }

        const users = getUsers();
        const existingUser = users.find(u => u.username === formData.username);
        
        if (existingUser) {
          throw new Error('Username already exists');
        }

        // Create new user
        const newUser: UserData = {
          username: formData.username,
          password: formData.password,
          createdAt: new Date().toISOString()
        };

        saveUser(newUser);
        
        // Store current user session
        localStorage.setItem('hackquest-current-user', formData.username);
        
        // Switch to login mode and show success message
        setIsLogin(true);
        setFormData({
          username: formData.username,
          password: '',
          confirmPassword: ''
        });
        
        if (onLogin) onLogin();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300CED1%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Terminal */}
        <div className="hidden lg:block">
          <div className="bg-slate-800/90 rounded-lg border border-cyan-400/30 p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center mb-4">
              <Terminal className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-cyan-400 font-mono text-sm">HACKQUEST_TERMINAL v2.1.0</span>
            </div>
            <div className="h-64 overflow-hidden">
              <pre className="text-cyan-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {terminalText}
                <span className="animate-pulse">█</span>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-cyan-200/50 p-8 shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center border border-cyan-300/50">
                <Shield className="w-8 h-8 text-cyan-600" />
              </div>
              <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-800 bg-clip-text text-transparent mb-2">
                HackQuest
              </h1>
              <p className="text-slate-600 font-primary">
                {isLogin ? 'Agent Authentication' : 'Agent Registration'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 font-primary">
                  Agent ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                    placeholder={isLogin ? "Enter your agent ID" : "Choose your agent ID"}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 font-primary">
                  Security Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                    placeholder="Enter your security key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Registration only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 font-primary">
                    Confirm Security Key
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                      placeholder="Confirm your security key"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-heading"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      {isLogin ? 'Authenticating...' : 'Creating Agent...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      {isLogin ? 'Access Granted' : 'Join HackQuest'}
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-cyan-600 hover:text-blue-600 transition-colors font-primary"
                >
                  {isLogin ? "New agent? Register here" : "Already an agent? Login here"}
                </button>
              </div>
            </form>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-center mt-4">
                <button className="text-sm text-slate-500 hover:text-cyan-600 transition-colors font-primary">
                  Forgot your security key?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;