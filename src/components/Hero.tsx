import React, { useEffect, useRef } from 'react';
import { ChevronDown, Zap, Target, Code } from 'lucide-react';

const HeroSection: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-pulse-slow');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300D4FF%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="particle absolute w-2 h-2 bg-cyber-blue rounded-full" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
          <div className="particle absolute w-1 h-1 bg-cyber-purple rounded-full" style={{top: '60%', left: '80%', animationDelay: '2s'}}></div>
          <div className="particle absolute w-3 h-3 bg-cyber-pink rounded-full" style={{top: '40%', left: '70%', animationDelay: '4s'}}></div>
          <div className="particle absolute w-1 h-1 bg-cyber-green rounded-full" style={{top: '80%', left: '20%', animationDelay: '1s'}}></div>
          <div className="particle absolute w-2 h-2 bg-cyber-orange rounded-full" style={{top: '30%', left: '50%', animationDelay: '3s'}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent animate-gradient">
              HackQuest
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-inter leading-relaxed">
            Master cybersecurity through gamified challenges, compete with hackers worldwide, 
            and unlock your potential in the digital frontier.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg font-semibold text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-blue/25">
              <span className="relative z-10 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Start Hacking
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="px-8 py-4 border-2 border-cyber-blue/50 rounded-lg font-semibold text-cyber-blue hover:bg-cyber-blue/10 transition-all duration-300 backdrop-blur-sm">
              View Challenges
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 backdrop-blur-sm border border-cyber-blue/30 flex items-center justify-center">
                <Target className="w-8 h-8 text-cyber-blue" />
              </div>
              <div className="text-2xl font-bold text-white font-orbitron">500+</div>
              <div className="text-gray-400 font-inter">Challenges</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-green/20 to-cyber-blue/20 backdrop-blur-sm border border-cyber-green/30 flex items-center justify-center">
                <Code className="w-8 h-8 text-cyber-green" />
              </div>
              <div className="text-2xl font-bold text-white font-orbitron">50K+</div>
              <div className="text-gray-400 font-inter">Hackers</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-orange/20 to-cyber-pink/20 backdrop-blur-sm border border-cyber-orange/30 flex items-center justify-center">
                <Zap className="w-8 h-8 text-cyber-orange" />
              </div>
              <div className="text-2xl font-bold text-white font-orbitron">24/7</div>
              <div className="text-gray-400 font-inter">Active</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;