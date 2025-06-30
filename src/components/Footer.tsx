import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cyber-darker border-t border-cyber-blue/20 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-8 h-8 text-cyber-blue" />
              <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                HackQuest
              </span>
            </div>
            <p className="text-gray-400 font-inter leading-relaxed max-w-md">
              The world's leading gamified cybersecurity platform. Master ethical hacking, 
              compete with peers, and advance your security career through hands-on challenges.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-orbitron">Platform</h4>
            <ul className="space-y-2 font-inter">
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Challenges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Leaderboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Learning Paths</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Certifications</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-orbitron">Support</h4>
            <ul className="space-y-2 font-inter">
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyber-blue/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-inter">
            © 2025 HackQuest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors text-sm font-inter">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors text-sm font-inter">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors text-sm font-inter">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;