import React, { useState, useEffect } from 'react';
import { X, Terminal, CheckCircle, XCircle, Lightbulb, Target, Zap } from 'lucide-react';
import { matchSQLChallenge } from '../data/challengeAnswers';

interface SQLInjectionChallengeProps {
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
  vulnerableCode: string;
  explanation: string;
  points: number;
}

const sqlChallenges: Challenge[] = [
    { 
      id: 1, 
      question: "The login form is vulnerable. Bypass authentication by injecting SQL that always returns true.", 
      hint: "Try using a condition that's always true, like '1'='1'.", 
      expectedPayload: "' OR '1'='1", 
      answerKey: "sql_auth_bypass",
      vulnerableCode: `SELECT * FROM users WHERE username='$input' AND password='$password'`, 
      explanation: "By injecting ' OR '1'='1, the SQL query becomes: SELECT * FROM users WHERE username='' OR '1'='1' AND password='' which always returns true, granting access.", 
      points: 25
    },
    { 
      id: 2, 
      question: "Extract the database version using a UNION-based attack. The query returns one column.", 
      hint: "Use UNION SELECT to add your own data. Database version can be retrieved with @@VERSION or VERSION().", 
      expectedPayload: "' UNION SELECT @@VERSION--", 
      answerKey: "sql_union_version",
      vulnerableCode: `SELECT name FROM products WHERE id='$input'`, 
      explanation: "UNION SELECT allows you to combine results from different queries. The '--' comments out the rest of the original query, preventing errors.", 
      points: 35 
    },
    { 
      id: 3, 
      question: "A search feature is vulnerable. Extract the first table name from the database schema.", 
      hint: "Use information_schema.tables to get table names. Use LIMIT 1 to get the first result.", 
      expectedPayload: "' UNION SELECT table_name FROM information_schema.tables LIMIT 1--", 
      answerKey: "sql_schema_enum",
      vulnerableCode: `SELECT title, content FROM articles WHERE title LIKE '%$input%'`, 
      explanation: "The information_schema database contains metadata about all tables. This technique helps enumerate the database structure.", 
      points: 45 
    },
    { 
      id: 4, 
      question: "Bypass a basic, case-sensitive filter that blocks the 'OR' keyword.", 
      hint: "SQL keywords are not case-sensitive. Try different cases or alternative operators.", 
      expectedPayload: "' or '1'='1", 
      answerKey: "sql_case_bypass",
      vulnerableCode: `SELECT * FROM users WHERE id='$input' /* Filter blocks: OR */`, 
      explanation: "Many basic filters only check for specific string patterns. Using lowercase 'or' bypasses a case-sensitive filter for 'OR'.", 
      points: 30 
    },
    { 
      id: 5, 
      question: "Perform a time-based blind SQL injection. Confirm if the admin's password starts with 'c'.", 
      hint: "Use SLEEP() or BENCHMARK() to create time delays based on a condition.", 
      expectedPayload: "' AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='c',SLEEP(5),0)--", 
      answerKey: "sql_time_based_blind",
      vulnerableCode: `SELECT id FROM users WHERE email='$input'`, 
      explanation: "Time-based blind injection uses database delay functions to infer information when no direct output is visible. If the page takes longer to load, the condition is true.", 
      points: 55 
    }
];


const SQLInjectionChallenge: React.FC<SQLInjectionChallengeProps> = ({ isOpen, onClose, onComplete }) => {
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

    const challenge = sqlChallenges[currentChallenge];
    
    let isAnswerCorrect = false;
    
    // Use pattern matching if answerKey is defined
    if (challenge.answerKey) {
      isAnswerCorrect = matchSQLChallenge(userInput, challenge.answerKey);
    } else {
      // Fallback to simple comparison
      isAnswerCorrect = userInput.trim().toLowerCase() === challenge.expectedPayload.toLowerCase();
    }
    
    setAttempts(prev => prev + 1);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      const scoreMultiplier = Math.max(1 - (attempts * 0.15), 0.4); // Higher penalty for attempts
      const earnedPoints = Math.round(challenge.points * scoreMultiplier);
      const newTotalScore = totalScore + earnedPoints;
      setTotalScore(newTotalScore);

      setTimeout(() => {
        if (currentChallenge < sqlChallenges.length - 1) {
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

  const challenge = sqlChallenges[currentChallenge];
  const progressPercentage = ((currentChallenge) / sqlChallenges.length) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-cyan-200/50 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                SQL Injection Challenge
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>Challenge: <span className="font-semibold text-slate-600">{currentChallenge + 1} / {sqlChallenges.length}</span></span>
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
            <label className="block text-slate-700 font-semibold">Your SQL Injection Payload:</label>
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

          {/* Hint */}
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
                  <p className="font-semibold text-green-700 mb-2">Success! Payload accepted.</p>
                  <p className="text-slate-600 text-sm">{challenge.explanation}</p>
                  {currentChallenge < sqlChallenges.length - 1 ? (
                    <p className="text-cyan-600 mt-2 font-semibold animate-pulse">Loading next challenge...</p>
                  ) : (
                    <p className="text-green-600 mt-2 font-semibold">All challenges completed! Well done, agent!</p>
                  )}
                </div>
              ) : (
                <p className="font-semibold text-red-700">Access Denied. The system rejected your payload. Review your logic and try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SQLInjectionChallenge;
