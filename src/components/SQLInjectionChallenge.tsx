import React, { useState, useEffect } from 'react';
import { X, Terminal, CheckCircle, XCircle, Lightbulb, Target } from 'lucide-react';

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
  vulnerableCode: string;
  explanation: string;
  points: number;
}

const sqlChallenges: Challenge[] = [
  {
    id: 1,
    question: "The login form is vulnerable to SQL injection. Bypass the authentication by injecting SQL code that always returns true.",
    hint: "Try using a condition that's always true, like '1'='1'",
    expectedPayload: "' OR '1'='1",
    vulnerableCode: `SELECT * FROM users WHERE username='$input' AND password='$password'`,
    explanation: "By injecting ' OR '1'='1, the SQL query becomes: SELECT * FROM users WHERE username='' OR '1'='1' AND password='' which will always return true.",
    points: 25
  },
  {
    id: 2,
    question: "Extract the database version using UNION injection. The application expects one column in the result.",
    hint: "Use UNION SELECT to add your own data to the result. Database version can be retrieved with VERSION()",
    expectedPayload: "' UNION SELECT VERSION()--",
    vulnerableCode: `SELECT name FROM products WHERE id='$input'`,
    explanation: "UNION SELECT allows you to combine results from different queries. The -- comments out the rest of the original query.",
    points: 35
  },
  {
    id: 3,
    question: "Perform a blind SQL injection to determine if user 'admin' exists in the database.",
    hint: "Use conditional statements that cause different responses based on truth",
    expectedPayload: "' AND (SELECT COUNT(*) FROM users WHERE username='admin')>0--",
    vulnerableCode: `SELECT * FROM articles WHERE title LIKE '%$input%'`,
    explanation: "Blind SQL injection uses conditional logic to infer information based on application responses.",
    points: 40
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
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, startTime]);

  const checkAnswer = () => {
    const challenge = sqlChallenges[currentChallenge];
    const isAnswerCorrect = userInput.toLowerCase().includes(challenge.expectedPayload.toLowerCase());
    
    setAttempts(prev => prev + 1);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      const scoreMultiplier = Math.max(1 - (attempts * 0.1), 0.5); // Reduce score for multiple attempts
      const earnedPoints = Math.round(challenge.points * scoreMultiplier);
      setTotalScore(prev => prev + earnedPoints);

      setTimeout(() => {
        if (currentChallenge < sqlChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setUserInput('');
          setIsCorrect(null);
          setAttempts(0);
          setShowHint(false);
        } else {
          // Challenge completed
          const finalScore = totalScore + earnedPoints;
          onComplete(finalScore);
          onClose();
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

  const challenge = sqlChallenges[currentChallenge];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg border border-primary/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-heading text-primary mb-2">
                SQL Injection Challenge
              </h2>
              <div className="flex items-center space-x-6 text-sm text-surface-600">
                <span>Challenge {currentChallenge + 1} of {sqlChallenges.length}</span>
                <span>Score: {totalScore}</span>
                <span>Time: {formatTime(timeElapsed)}</span>
                <span>Attempts: {attempts}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-surface-600 hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3">
          <div className="w-full bg-surface-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentChallenge + 1) / sqlChallenges.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="p-6 space-y-6">
          {/* Question */}
          <div className="bg-surface-100 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-2">Objective</h3>
                <p className="text-surface-700">{challenge.question}</p>
              </div>
            </div>
          </div>

          {/* Vulnerable Code */}
          <div className="bg-surface-100 p-4 rounded-lg border border-surface-300">
            <h4 className="text-surface-800 font-semibold mb-2 flex items-center">
              <Terminal className="w-4 h-4 mr-2 text-success" />
              Vulnerable Code
            </h4>
            <pre className="text-success font-mono text-sm bg-surface-900 text-surface-100 p-3 rounded overflow-x-auto">
              {challenge.vulnerableCode}
            </pre>
          </div>

          {/* Input Field */}
          <div className="space-y-3">
            <label className="block text-surface-800 font-semibold">Your SQL Injection Payload:</label>
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your SQL injection payload..."
                className="w-full p-4 bg-surface-50 border border-primary/30 rounded-lg text-surface-800 placeholder-surface-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
              {isCorrect !== null && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-error" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hint */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 text-warning hover:text-accent transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
            
            <button
              onClick={checkAnswer}
              disabled={!userInput.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>

          {showHint && (
            <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg">
              <p className="text-warning"><strong>Hint:</strong> {challenge.hint}</p>
            </div>
          )}

          {/* Result */}
          {isCorrect !== null && (
            <div className={`p-4 rounded-lg border ${
              isCorrect 
                ? 'bg-success/10 border-success/30' 
                : 'bg-error/10 border-error/30'
            }`}>
              {isCorrect ? (
                <div>
                  <p className="text-success font-semibold mb-2">Correct! Well done!</p>
                  <p className="text-surface-700 text-sm">{challenge.explanation}</p>
                  {currentChallenge < sqlChallenges.length - 1 && (
                    <p className="text-primary mt-2">Moving to next challenge...</p>
                  )}
                </div>
              ) : (
                <p className="text-error">Incorrect. Try again or check the hint!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SQLInjectionChallenge;
