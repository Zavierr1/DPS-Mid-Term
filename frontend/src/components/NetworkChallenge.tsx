import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Lightbulb, Target, Wifi, Zap } from 'lucide-react';
import MatchResultDisplay from './MatchResultDisplay';

interface NetworkChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface Challenge {
  id: number;
  question: string;
  hint: string;
  answerKey: string; // Key to look up in the dataset - now required
  details: string; // Renamed from vulnerableCode for clarity
  explanation: string;
  points: number;
}

const networkChallenges: Challenge[] = [
    {
        id: 1,
        question: "A system is using a Class C private IP address: 192.168.1.10. What is its default subnet mask?",
        hint: "Class C networks dedicate the first three octets to the network portion. How would you represent that in a subnet mask?",
        answerKey: "subnet_mask_class_c",
        details: "IP Address: 192.168.1.10\nClass: C (Private Range: 192.168.0.0 - 192.168.255.255)\nNetwork Bits: 24\nHost Bits: 8",
        explanation: "Correct. Class C networks use a /24 prefix, meaning the first 24 bits are for the network address. This corresponds to a subnet mask of 255.255.255.0.",
        points: 20
    },
    {
        id: 2,
        question: "You are scanning a web server and find port 443 is open. What service is most likely running on this port?",
        hint: "This port is used for the secure version of the standard web protocol.",
        answerKey: "port_443_service",
        details: "Common Web Ports:\n- Port 80: HTTP (Hypertext Transfer Protocol)\n- Port 443: ???\n- Port 8080: HTTP Alternate (Proxy/Web Cache)",
        explanation: "Exactly. Port 443 is the standard port for HTTPS (HTTP Secure), which encrypts web traffic using TLS/SSL.",
        points: 15
    },
    {
        id: 3,
        question: "What type of attack involves overwhelming a server with a flood of traffic from many different sources, making it unavailable?",
        hint: "The key here is 'from many different sources'. It's a 'Distributed' form of a common attack.",
        answerKey: "ddos_attack",
        details: "Attack Signature:\n- Source IPs: Multiple, geographically diverse\n- Traffic Volume: Extremely high (Gbps or Tbps)\n- Goal: Resource exhaustion (CPU, bandwidth, memory)",
        explanation: "That's right. A Distributed Denial of Service (DDoS) attack uses a botnet of compromised machines to simultaneously attack a single target.",
        points: 30
    },
    {
        id: 4,
        question: "An attacker is intercepting and relaying communication between two parties without their knowledge. What is this attack called?",
        hint: "The attacker secretly positions themselves 'in the middle' of the conversation.",
        answerKey: "mitm_attack",
        details: "Attack Vector: Unsecured Wi-Fi Network\nTechnique: ARP Spoofing\nObjective: Intercept credentials from a login page.",
        explanation: "Correct. A Man-in-the-Middle (MITM) attack allows the adversary to eavesdrop on, and even alter, the communication between two victims.",
        points: 40
    },
    {
        id: 5,
        question: "What protocol is responsible for translating a domain name like 'google.com' into an IP address like '142.250.191.78'?",
        hint: "Think of it as the phonebook of the internet.",
        answerKey: "dns_protocol",
        details: "Query Process:\n1. User -> google.com\n2. PC asks Recursive Resolver\n3. Resolver asks Root Server -> .com TLD Server -> Authoritative Server\n4. IP Address -> User",
        explanation: "Perfect. The Domain Name System (DNS) is the hierarchical and decentralized naming system used to locate computers and services on the internet.",
        points: 25
    }
];


const NetworkChallenge: React.FC<NetworkChallengeProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [acceptableAnswers, setAcceptableAnswers] = useState<any[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOpen) {
      const startTime = Date.now();
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
        if(timer) clearInterval(timer);
    }
  }, [isOpen]);

  // Lock body scroll when challenge is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch acceptable answers from backend when challenge changes
  useEffect(() => {
    const challenge = networkChallenges[currentChallenge];
    if (challenge.answerKey) {
      fetch(`/api/challenges/network`)
        .then(res => res.json())
        .then((data: Record<string, any[]>) => {
          if (challenge.answerKey && data[challenge.answerKey]) {
            setAcceptableAnswers(data[challenge.answerKey]);
          } else {
            setAcceptableAnswers([]);
          }
        })
        .catch(() => {
          setAcceptableAnswers([]);
        });
    } else {
      setAcceptableAnswers([]);
    }
  }, [currentChallenge]);

  const resetForNextChallenge = () => {
    setUserInput('');
    setIsCorrect(null);
    setMatchDetails(null);
    setAttempts(0);
    setShowHint(false);
  };

  const checkAnswer = async () => {
    if (!userInput.trim()) return;
    const challenge = networkChallenges[currentChallenge];
    let isAnswerCorrect = false;
    let resultDetails = { matchType: 'none', confidence: 0, similarity: 0 };
    if (challenge.answerKey) {
      if (acceptableAnswers.length > 0) {
        // Call backend for answer validation
        const res = await fetch('/api/challenges/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeType: 'network',
            answerKey: challenge.answerKey,
            userInput
          })
        });
        if (res.ok) {
          const result = await res.json();
          isAnswerCorrect = result.isMatch;
          resultDetails = result;
        }
      }
    } else {
      // Backend service unavailable
      isAnswerCorrect = false;
      resultDetails = { matchType: 'none', confidence: 0, similarity: 0 };
    }
    setAttempts(prev => prev + 1);
    setIsCorrect(isAnswerCorrect);
    setMatchDetails(resultDetails);
    if (isAnswerCorrect) {
      let baseMultiplier = Math.max(1 - (attempts * 0.15), 0.4);
      if (resultDetails.matchType === 'exact') {
        baseMultiplier *= 1.0;
      } else if (resultDetails.matchType === 'synonym' || resultDetails.matchType === 'abbreviation') {
        baseMultiplier *= 0.95;
      } else if (resultDetails.matchType === 'fuzzy') {
        baseMultiplier *= 0.85;
      }
      const earnedPoints = Math.round(challenge.points * baseMultiplier);
      const newTotalScore = totalScore + earnedPoints;
      setTotalScore(newTotalScore);
      setTimeout(() => {
        if (currentChallenge < networkChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          resetForNextChallenge();
        } else {
          onComplete(newTotalScore);
          onClose();
        }
      }, 2500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const challenge = networkChallenges[currentChallenge];
  const progressPercentage = ((currentChallenge) / networkChallenges.length) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-cyan-200/50 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                Network Security Challenge
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>Challenge: <span className="font-semibold text-slate-600">{currentChallenge + 1} / {networkChallenges.length}</span></span>
                <span>Score: <span className="font-semibold text-cyan-600">{totalScore}</span></span>
                <span>Time: <span className="font-semibold text-slate-600">{formatTime(timeElapsed)}</span></span>
                <span>Attempts: <span className="font-semibold text-slate-600">{attempts}</span></span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-cyan-600 transition-colors rounded-full p-2 hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 flex-shrink-0">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Question */}
          <div className="bg-white/70 p-5 rounded-lg border border-slate-200/80">
            <div className="flex items-start space-x-4">
              <Target className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Objective</h3>
                <p className="text-slate-600">{challenge.question}</p>
              </div>
            </div>
          </div>

          {/* Network Details */}
          <div>
            <h4 className="text-slate-700 font-semibold mb-2 flex items-center">
              <Wifi className="w-5 h-5 mr-2 text-slate-500" />
              Network Intelligence
            </h4>
            <pre className="text-cyan-300 font-mono text-sm bg-slate-800 p-4 rounded-lg overflow-x-auto shadow-inner">
              <code>{challenge.details}</code>
            </pre>
          </div>

          {/* Input Field */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-semibold">Your Answer:</label>
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your answer and press Enter..."
                className="w-full p-4 pl-5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-mono transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                disabled={isCorrect === true}
              />
              {isCorrect !== null && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isCorrect ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              )}
            </div>
          </div>

          {/* Hint & Submit */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors font-semibold"
            >
              <Lightbulb className="w-5 h-5" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
            
            <button
              onClick={checkAnswer}
              disabled={!userInput.trim() || isCorrect === true}
              className="w-40 group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Submit
              </span>
            </button>
          </div>

          {showHint && (
            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <p className="text-amber-700"><strong className="font-semibold">Hint:</strong> {challenge.hint}</p>
            </div>
          )}

          {/* Result */}
          <MatchResultDisplay
            isCorrect={isCorrect}
            matchType={matchDetails?.matchType}
            similarity={matchDetails?.similarity}
            confidence={matchDetails?.confidence}
            explanation={isCorrect ? challenge.explanation : undefined}
            showDetails={true}
          />

          {isCorrect && currentChallenge < networkChallenges.length - 1 && (
            <div className="text-center">
              <p className="text-cyan-600 font-semibold animate-pulse">Loading next challenge...</p>
            </div>
          )}

          {isCorrect && currentChallenge >= networkChallenges.length - 1 && (
            <div className="text-center">
              <p className="text-green-600 font-semibold">All challenges completed! Network mastery achieved!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkChallenge;
