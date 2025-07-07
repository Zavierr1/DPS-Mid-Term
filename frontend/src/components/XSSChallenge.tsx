import React, { useState, useEffect } from 'react';
import { X, Terminal, CheckCircle, XCircle, Lightbulb, Target, AlertTriangle, Zap } from 'lucide-react';

// Define the structure for each challenge
interface Challenge {
  id: number;
  question: string;
  hint: string;
  answerKey: string; // Key to look up in the dataset - now required
  vulnerableCode: string;
  explanation: string;
  points: number;
}

// Define the props for the main component
interface XSSChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

// Array of XSS challenges
const xssChallenges: Challenge[] = [
    {
        id: 1,
        question: "Find a basic XSS vulnerability. Your goal is to inject a script that triggers an alert dialog.",
        hint: "Classic XSS starts with a <script> tag. Try inserting one into the input field.",
        answerKey: "xss_basic_script_alert",
        vulnerableCode: `// The user input is directly rendered into the DOM.
document.getElementById('comments').innerHTML = userInput;`,
        explanation: "This is a classic stored XSS. The application fails to sanitize user input, allowing arbitrary JavaScript execution via <script> tags.",
        points: 20
    },
    {
        id: 2,
        question: "The developer has filtered out <script> tags. Find another way to execute your alert.",
        hint: "Many HTML tags have event handlers (e.g., onerror, onload) that can run scripts. Think about an image that fails to load.",
        answerKey: "xss_img_onerror",
        vulnerableCode: `// A basic filter is in place.
const filtered = userInput.replace(/<script[^>]*>.*?<\\/script>/gi, '');
document.getElementById('content').innerHTML = filtered;`,
        explanation: "Even with <script> tags blocked, event handlers like 'onerror' on an <img> tag can execute JavaScript if the image source is invalid.",
        points: 30
    },
    {
        id: 3,
        question: "Exploit a DOM-based XSS. The page uses 'document.write()' with a URL parameter. Break out of the script context.",
        hint: "You need to close the existing script tag and inject your own. Look at the vulnerable code to see how your input is being placed.",
        answerKey: "xss_dom_script_break",
        vulnerableCode: `const urlParam = new URLSearchParams(window.location.search).get('name');
document.write('<script>var username = "' + urlParam + '";</script>');`,
        explanation: "In DOM-based XSS, the vulnerability lies in client-side code. By closing the initial script tag, you can inject and execute your own payload.",
        points: 40
    },
    {
        id: 4,
        question: "Bypass a Content Security Policy (CSP) that blocks inline scripts. Your payload should still trigger an alert.",
        hint: "The CSP is strict. Look for ways to execute code in a different context, perhaps using an iframe and the 'srcdoc' attribute.",
        answerKey: "xss_csp_bypass_iframe",
        vulnerableCode: `Content-Security-Policy: script-src 'self'
// CSP blocks inline scripts and eval().
<div id="userContent">\${userInput}</div>`,
        explanation: "A strong CSP can be bypassed if HTML injection is possible. The 'iframe srcdoc' attribute creates a new document with a less restrictive policy, allowing script execution.",
        points: 55
    },
    {
        id: 5,
        question: "Exploit a reflected XSS in a search function that encodes '<' and '>' but not quotes.",
        hint: "Angle brackets are blocked, so you can't create new tags. Try breaking out of the 'value' attribute of the input field to add a new attribute.",
        answerKey: "xss_reflected_attribute_break",
        vulnerableCode: `// The filter only encodes angle brackets.
const encoded = userInput.replace(/</g, '&lt;').replace(/>/g, '&gt;');
return '<input type="text" value="' + encoded + '">';`,
        explanation: "When filters block tags but not quotes, you can inject event handlers by breaking out of existing attributes. Here, 'onmouseover' executes the script when a user hovers over the input.",
        points: 35
    }
];


const XSSChallenge: React.FC<XSSChallengeProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [xssPatterns, setXssPatterns] = useState<Record<string, any> | null>(null);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, startTime]);

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

  // Fetch XSS patterns from backend when challenge changes
  useEffect(() => {
    const challenge = xssChallenges[currentChallenge];
    if (challenge.answerKey) {
      fetch(`/api/challenges/xss`)
        .then(res => res.json())
        .then((data: Record<string, any>) => {
          setXssPatterns(data);
        })
        .catch(() => {
          setXssPatterns(null);
        });
    } else {
      setXssPatterns(null);
    }
  }, [currentChallenge]);

  const checkAnswer = async () => {
    if (!userInput.trim()) return;
    setCheckingAnswer(true);
    setAnswerError('');
    setAttempts(prev => prev + 1);
    
    const challenge = xssChallenges[currentChallenge];
    let isAnswerCorrect = false;
    
    try {
      if (challenge.answerKey && xssPatterns && xssPatterns[challenge.answerKey]) {
        const res = await fetch('/api/challenges/xss/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answerKey: challenge.answerKey,
            userInput
          })
        });
        
        if (res.ok) {
          const result = await res.json();
          isAnswerCorrect = result.isMatch;
        } else {
          const err = await res.json();
          setAnswerError(err.error || 'Server error');
        }
      } else {
        setAnswerError('Challenge patterns not loaded from backend');
      }
    } catch (error) {
      console.error('Backend unavailable:', error);
      setAnswerError('Backend service unavailable. Please ensure the backend server is running.');
    }
    
    setIsCorrect(isAnswerCorrect);
    setCheckingAnswer(false);
    
    if (isAnswerCorrect) {
      const scoreEarned = Math.max(challenge.points - (attempts * 2), 5);
      setTotalScore(prev => prev + scoreEarned);
      
      setTimeout(() => {
        if (currentChallenge < xssChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          resetForNextChallenge();
        } else {
          onComplete(totalScore + scoreEarned);
        }
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const challenge = xssChallenges[currentChallenge];
  const progressPercentage = ((currentChallenge) / xssChallenges.length) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-cyan-200/50 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                XSS Playground
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>Challenge: <span className="font-semibold text-slate-600">{currentChallenge + 1} / {xssChallenges.length}</span></span>
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
          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-600 mb-1">For Educational Use Only</h4>
                <p className="text-sm text-yellow-700/80">These challenges demonstrate real vulnerabilities. Never attempt XSS on websites you do not have explicit permission to test.</p>
              </div>
            </div>
          </div>
          
            {/* Objective */}
            <div className="bg-white/70 p-5 rounded-lg border border-slate-200/80">
                <div className="flex items-start space-x-4">
                <Target className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Objective</h3>
                    <p className="text-slate-600">{challenge.question}</p>
                </div>
                </div>
            </div>

            {/* Vulnerable Code */}
            <div>
                <h4 className="text-slate-700 font-semibold mb-2 flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-slate-500" />
                    Vulnerable Code Snippet
                </h4>
                <pre className="text-cyan-300 font-mono text-sm bg-slate-800 p-4 rounded-lg overflow-x-auto shadow-inner">
                    <code>{challenge.vulnerableCode}</code>
                </pre>
            </div>

          {/* Input Field */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-semibold">Your XSS Payload:</label>
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter payload and press Enter..."
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

          {/* Controls: Hint & Submit */}
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

          {/* Result Feedback */}
          {isCorrect !== null && (
            <div className={`p-4 rounded-lg border-l-4 ${
              isCorrect 
                ? 'bg-green-500/10 border-green-500' 
                : 'bg-red-500/10 border-red-500'
            }`}>
              {isCorrect ? (
                <div>
                  <p className="font-semibold text-green-700 mb-2">Success! Payload executed.</p>
                  <p className="text-slate-600 text-sm">{challenge.explanation}</p>
                  {currentChallenge < xssChallenges.length - 1 ? (
                    <p className="text-cyan-600 mt-2 font-semibold animate-pulse">Loading next challenge...</p>
                  ) : (
                    <p className="text-green-600 mt-2 font-semibold">All challenges completed! Well done!</p>
                  )}
                </div>
              ) : (
                <p className="font-semibold text-red-700">Payload failed. The system rejected your payload. Review the code and try again.</p>
              )}
            </div>
          )}

          {/* Loading and Error States */}
          {checkingAnswer && (
            <div className="p-4 rounded-lg border-l-4 bg-amber-500/10 border-amber-500">
              <p className="text-amber-700">{answerError || 'Checking answer...'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XSSChallenge;