import React, { useEffect, useRef } from 'react';
import { Zap, Target, Code } from 'lucide-react';

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
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-cyan-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300CED1%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="particle absolute w-2 h-2 bg-cyan-400 rounded-full" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
          <div className="particle absolute w-1 h-1 bg-blue-500 rounded-full" style={{top: '60%', left: '80%', animationDelay: '2s'}}></div>
          <div className="particle absolute w-3 h-3 bg-cyan-300 rounded-full" style={{top: '40%', left: '70%', animationDelay: '4s'}}></div>
          <div className="particle absolute w-1 h-1 bg-teal-400 rounded-full" style={{top: '80%', left: '20%', animationDelay: '1s'}}></div>
          <div className="particle absolute w-2 h-2 bg-blue-400 rounded-full" style={{top: '30%', left: '50%', animationDelay: '3s'}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-800 bg-clip-text text-transparent animate-gradient">
              HackGoon
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 font-primary leading-relaxed">
            Master cybersecurity through gamified challenges, compete with hackers worldwide, 
            and unlock your potential in the digital frontier.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
              onClick={() => {
                const el = document.getElementById('challenges');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                View Challenges
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 backdrop-blur-sm border border-cyan-300 flex items-center justify-center">
                <Target className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800 font-heading">4</div>
              <div className="text-slate-600 font-primary">Challenges</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 backdrop-blur-sm border border-teal-300 flex items-center justify-center">
                <Code className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800 font-heading">1</div>
              <div className="text-slate-600 font-primary">Hackers</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 backdrop-blur-sm border border-blue-300 flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800 font-heading">24/7</div>
              <div className="text-slate-600 font-primary">Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;