import React, { useState, useEffect } from 'react';
import { X, Terminal, CheckCircle, XCircle, Lightbulb, Target, Zap } from 'lucide-react';
import { matchAnswer } from '../utils/answerMatcher';
import { getAnswersForChallenge } from '../data/challengeAnswers';

interface CryptoChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface Challenge {
  id: number;
  question: string;
  hint: string;
  expectedPayload: string;
  answerKey?: string; // Key to look up in the dataset
  vulnerableCode: string; // Renamed for consistency, was cryptographicDetails
  explanation: string;
  points: number;
}

const cryptoChallenges: Challenge[] = [
    {
        id: 1,
        question: "A message was intercepted: 'KHOOR, ZRUOG!'. It's encrypted with a simple Caesar cipher with a shift of 3. What is the original message?",
        hint: "In a Caesar cipher, each letter is shifted by a fixed number of places down the alphabet. To decode, you must shift them back. 'A' would become 'X', 'B' would become 'Y', etc.",
        expectedPayload: "HELLO, WORLD!",
        answerKey: "caesar_cipher_hello_world",
        vulnerableCode: "Cipher: Caesar | Shift: 3\n\nExample Decryption:\nD -> A\nE -> B\nF -> C",
        explanation: "Correct! A Caesar cipher is a basic substitution cipher. By shifting each letter back by 3 positions in the alphabet, you successfully decrypted the message.",
        points: 20
    },
    {
        id: 2,
        question: "You've found a Base64 encoded string: 'U2VjdXJpdHkgaXMgYW4gaWxsdXNpb24u'. What does it decode to?",
        hint: "Base64 is an encoding scheme, not an encryption method. Use any standard Base64 decoder to reveal the plaintext.",
        expectedPayload: "Security is an illusion.",
        answerKey: "base64_security_illusion",
        vulnerableCode: "Encoding: Base64\n\nCharacters: A-Z, a-z, 0-9, +, /\nPadding: Uses '=' at the end if needed.",
        explanation: "Excellent. Base64 is used to represent binary data in an ASCII string format. It's often mistaken for encryption but provides no confidentiality.",
        points: 25
    },
    {
        id: 3,
        question: "This MD5 hash 'e80b5017098950fc58aad83c8c14978e' corresponds to a common 4-digit PIN. What is the PIN?",
        hint: "MD5 is a broken hashing algorithm. Its hashes for simple inputs (like 4-digit PINs) are widely available in pre-computed 'rainbow tables'. Search for this hash online.",
        expectedPayload: "1337",
        answerKey: "md5_hash_1337",
        vulnerableCode: "Algorithm: MD5 (Message Digest 5)\n\nType: Cryptographic Hash Function\nWeakness: Vulnerable to collision and pre-image attacks.",
        explanation: "Nicely done. This demonstrates why MD5 is insecure for password or PIN storage. Rainbow tables make reversing simple hashes trivial.",
        points: 35
    },
    {
        id: 4,
        question: "Crack this Vigenère cipher: 'RIJVS, GPECT!' using the key 'KEY'.",
        hint: "The Vigenère cipher uses a keyword to shift letters. For the first letter, use 'K' as the shift, for the second use 'E', for the third use 'Y', and then repeat the key.",
        expectedPayload: "HELLO, AGENT!",
        answerKey: "vigenere_hello_agent",
        vulnerableCode: "Cipher: Vigenère\nKey: 'KEY'\n\nDecryption Formula:\nPi = (Ci - Ki) mod 26",
        explanation: "Great work! The Vigenère cipher improves on the Caesar cipher by using multiple shift values, but it can be broken once the key length is known.",
        points: 45
    },
];


const CryptoChallenge: React.FC<CryptoChallengeProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

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
    };
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
  
  const resetForNextChallenge = () => {
    setUserInput('');
    setIsCorrect(null);
    setAttempts(0);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!userInput.trim()) return;

    const challenge = cryptoChallenges[currentChallenge];
    
    let isAnswerCorrect = false;
    let matchDetails = { matchType: 'none', confidence: 0 };
    
    // Use flexible matching if answerKey is defined
    if (challenge.answerKey) {
      const acceptableAnswers = getAnswersForChallenge('crypto', challenge.answerKey);
      if (acceptableAnswers) {
        const result = matchAnswer(userInput, acceptableAnswers, {
          fuzzyThreshold: 80, // Allow 80% similarity for crypto answers
          strictMode: false
        });
        isAnswerCorrect = result.isMatch;
        matchDetails = { matchType: result.matchType, confidence: result.confidence };
      }
    } else {
      // Fallback to original logic for backwards compatibility
      isAnswerCorrect = userInput.trim().toLowerCase() === challenge.expectedPayload.toLowerCase();
      matchDetails = { matchType: 'exact', confidence: 100 };
    }
    
    setAttempts(prev => prev + 1);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      // Adjust score based on match type and attempts
      let baseMultiplier = Math.max(1 - (attempts * 0.15), 0.4);
      
      // Bonus for exact matches, slight penalty for fuzzy matches
      if (matchDetails.matchType === 'exact') {
        baseMultiplier *= 1.0;
      } else if (matchDetails.matchType === 'alternative') {
        baseMultiplier *= 0.95;
      } else if (matchDetails.matchType === 'fuzzy') {
        baseMultiplier *= 0.9;
      }
      
      const earnedPoints = Math.round(challenge.points * baseMultiplier);
      const newTotalScore = totalScore + earnedPoints;
      setTotalScore(newTotalScore);

      setTimeout(() => {
        if (currentChallenge < cryptoChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          resetForNextChallenge();
        } else {
          onComplete(newTotalScore);
          onClose(); // Close after completing the final challenge
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

  const challenge = cryptoChallenges[currentChallenge];
  const progressPercentage = ((currentChallenge) / cryptoChallenges.length) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-cyan-200/50 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                Cryptography Challenge
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>Challenge: <span className="font-semibold text-slate-600">{currentChallenge + 1} / {cryptoChallenges.length}</span></span>
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

          {/* Vulnerable Code / Details */}
          <div>
            <h4 className="text-slate-700 font-semibold mb-2 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-slate-500" />
              Cryptographic Details
            </h4>
            <pre className="text-cyan-300 font-mono text-sm bg-slate-800 p-4 rounded-lg overflow-x-auto shadow-inner">
              <code>{challenge.vulnerableCode}</code>
            </pre>
          </div>

          {/* Input Field */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-semibold">Your Decoded Answer:</label>
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
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
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
          {isCorrect !== null && (
            <div className={`p-4 rounded-lg border-l-4 ${
              isCorrect 
                ? 'bg-green-500/10 border-green-500' 
                : 'bg-red-500/10 border-red-500'
            }`}>
              {isCorrect ? (
                <div>
                  <p className="font-semibold text-green-700 mb-2">Success! Answer accepted.</p>
                  <p className="text-slate-600 text-sm">{challenge.explanation}</p>
                  {currentChallenge < cryptoChallenges.length - 1 ? (
                    <p className="text-cyan-600 mt-2 font-semibold animate-pulse">Loading next challenge...</p>
                  ) : (
                    <p className="text-green-600 mt-2 font-semibold">All challenges completed! Well done, agent!</p>
                  )}
                </div>
              ) : (
                <p className="font-semibold text-red-700">Incorrect. The answer was rejected. Review your logic and try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoChallenge;
