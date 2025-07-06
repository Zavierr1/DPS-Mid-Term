import React, { useState } from 'react';
import { User, Terminal, Zap, Mail } from 'lucide-react';
import { signUpUser } from '../firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth'; // Import the Firebase user type

// Define the types for the component's props
interface UserInitModalProps {
  isOpen: boolean;
  onUserCreate: (user: FirebaseUser) => void;
}

// Apply the props interface to the component
const UserInitModal: React.FC<UserInitModalProps> = ({ isOpen, onUserCreate }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.username.trim() || !formData.password.trim()) {
        setError("Please fill out all fields.");
        return;
    };

    setIsSubmitting(true);
    setError('');

    try {
      // Create user with Firebase
      const userCredential = await signUpUser(formData.email, formData.password, formData.username);
      console.log('User created successfully:', userCredential.user);

      // Call the parent handler with the user object
      onUserCreate(userCredential.user);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
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
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 font-primary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="agent@hackquest.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 font-primary">
              Agent Callsign
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="e.g., Ghost, Viper, Neo"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                maxLength={20}
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
              <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Choose a secure password"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
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
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInitModal;