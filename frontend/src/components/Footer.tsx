import React from 'react';
import { Shield, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-900 pt-12 pb-8 overflow-hidden">
      {/* Gradient Border Accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23FFFFFF%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Logo & Description */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HackQuest
              </span>
            </div>
            <p className="text-slate-400 font-primary leading-relaxed max-w-md">
              The world's leading gamified cybersecurity platform. Master ethical hacking and advance your career.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transform hover:scale-110 transition-all duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transform hover:scale-110 transition-all duration-200">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-shrink-0 mt-4 md:mt-0">
            <h4 className="text-slate-200 font-semibold mb-4 font-heading">Platform</h4>
            <ul className="space-y-3 font-primary">
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Challenges</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm font-primary">
            © {new Date().getFullYear()} HackQuest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-primary">
               Privacy Policy
             </a>
             <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-primary">
               Terms of Service
             </a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;