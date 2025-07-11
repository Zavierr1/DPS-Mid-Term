const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const { NETWORK_SECURITY_ANSWERS, CRYPTOGRAPHY_ANSWERS, XSS_PATTERNS, SQL_INJECTION_PATTERNS } = require('./challengeData');
const rateLimit = require('express-rate-limit');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Enhanced rate limiter with configurable options
const answerLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30, // limit each IP to 30 requests per minute
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to answer check endpoints
app.use('/api/challenges/check', answerLimiter);
app.use('/api/challenges/xss/check', answerLimiter);
app.use('/api/challenges/sql/check', answerLimiter);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// API endpoint for network security answers
app.get('/api/challenges/network', (req, res) => {
  res.json(NETWORK_SECURITY_ANSWERS);
});

// API endpoint for cryptography answers
app.get('/api/challenges/crypto', (req, res) => {
  res.json(CRYPTOGRAPHY_ANSWERS);
});

// API endpoint for XSS challenge patterns
app.get('/api/challenges/xss', (req, res) => {
  res.json(XSS_PATTERNS.challengeAnswers);
});

// API endpoint for SQL injection challenge patterns
app.get('/api/challenges/sql', (req, res) => {
  res.json(SQL_INJECTION_PATTERNS.challengeAnswers);
});

// Helper function for answer matching (mimics previous frontend logic)
function matchAnswer(userInput, acceptableAnswers, options = {}) {
  const {
    fuzzyThreshold = 80,
    exactMatchBonus = 100,
    synonymMatchBonus = 90,
    abbreviationMatchBonus = 85,
    strictMode = false
  } = options;

  function normalizeText(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^ -\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\b(the|a|an|and|or|of|in|on|at|to|for|with|by)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }
    return matrix[str2.length][str1.length];
  }

  function calculateSimilarity(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 100;
    const distance = levenshteinDistance(str1, str2);
    return ((maxLength - distance) / maxLength) * 100;
  }

  const normalizedInput = normalizeText(userInput);
  let bestMatch = {
    isMatch: false,
    matchType: 'none',
    similarity: 0,
    matchedAnswer: '',
    confidence: 0
  };

  for (const answer of acceptableAnswers) {
    const normalizedPrimary = normalizeText(answer.primary);
    const primarySimilarity = calculateSimilarity(normalizedInput, normalizedPrimary);
    if (normalizedInput === normalizedPrimary) {
      return {
        isMatch: true,
        matchType: 'exact',
        similarity: 100,
        matchedAnswer: answer.primary,
        confidence: exactMatchBonus
      };
    }
    if (answer.synonyms) {
      for (const synonym of answer.synonyms) {
        const normalizedSynonym = normalizeText(synonym);
        if (normalizedInput === normalizedSynonym) {
          return {
            isMatch: true,
            matchType: 'synonym',
            similarity: 100,
            matchedAnswer: synonym,
            confidence: synonymMatchBonus
          };
        }
        const synonymSimilarity = calculateSimilarity(normalizedInput, normalizedSynonym);
        if (synonymSimilarity >= fuzzyThreshold && synonymSimilarity > bestMatch.similarity) {
          bestMatch = {
            isMatch: true,
            matchType: 'synonym',
            similarity: synonymSimilarity,
            matchedAnswer: synonym,
            confidence: (synonymSimilarity / 100) * synonymMatchBonus
          };
        }
      }
    }
    if (answer.abbreviations) {
      for (const abbrev of answer.abbreviations) {
        const normalizedAbbrev = normalizeText(abbrev);
        if (normalizedInput === normalizedAbbrev) {
          return {
            isMatch: true,
            matchType: 'abbreviation',
            similarity: 100,
            matchedAnswer: abbrev,
            confidence: abbreviationMatchBonus
          };
        }
      }
    }
    if (answer.alternativeSpellings) {
      for (const alt of answer.alternativeSpellings) {
        const normalizedAlt = normalizeText(alt);
        if (normalizedInput === normalizedAlt) {
          return {
            isMatch: true,
            matchType: 'alternative',
            similarity: 100,
            matchedAnswer: alt,
            confidence: synonymMatchBonus
          };
        }
        const altSimilarity = calculateSimilarity(normalizedInput, normalizedAlt);
        if (altSimilarity >= fuzzyThreshold && altSimilarity > bestMatch.similarity) {
          bestMatch = {
            isMatch: true,
            matchType: 'alternative',
            similarity: altSimilarity,
            matchedAnswer: alt,
            confidence: (altSimilarity / 100) * synonymMatchBonus
          };
        }
      }
    }
    if (primarySimilarity >= fuzzyThreshold && primarySimilarity > bestMatch.similarity) {
      const adjustedThreshold = strictMode ? fuzzyThreshold + 10 : fuzzyThreshold;
      if (primarySimilarity >= adjustedThreshold) {
        bestMatch = {
          isMatch: true,
          matchType: 'fuzzy',
          similarity: primarySimilarity,
          matchedAnswer: answer.primary,
          confidence: (primarySimilarity / 100) * 75
        };
      }
    }
  }
  return bestMatch;
}

// API endpoint to check answers for network and crypto challenges
app.post('/api/challenges/check', async (req, res) => {
  const { challengeType, answerKey, userInput } = req.body;
  let answers;
  if (challengeType === 'network') {
    answers = NETWORK_SECURITY_ANSWERS[answerKey];
  } else if (challengeType === 'crypto') {
    answers = CRYPTOGRAPHY_ANSWERS[answerKey];
  } else {
    return res.status(400).json({ error: 'Invalid challenge type' });
  }
  if (!answers) return res.status(404).json({ error: 'Answer key not found' });
  const result = matchAnswer(userInput, answers, { fuzzyThreshold: 75, strictMode: false });
  res.json(result);
});

// XSS answer validation endpoint
app.post('/api/challenges/xss/check', async (req, res) => {
  const { answerKey, userInput } = req.body;
  const patternObj = XSS_PATTERNS.challengeAnswers[answerKey];
  if (!patternObj) return res.status(404).json({ error: 'Pattern not found' });
  const userInputLower = userInput.toLowerCase();
  const matchesAnyPattern = patternObj.patterns.some((pat) => userInputLower.includes(pat.toLowerCase()));
  const hasAllRequired = patternObj.requiredElements.every((el) => userInputLower.includes(el.toLowerCase()));
  const isMatch = matchesAnyPattern && hasAllRequired;
  res.json({ isMatch, matchType: isMatch ? 'pattern' : 'none', description: patternObj.description });
});

// SQL Injection answer validation endpoint
app.post('/api/challenges/sql/check', async (req, res) => {
  const { answerKey, userInput } = req.body;
  const patternObj = SQL_INJECTION_PATTERNS.challengeAnswers[answerKey];
  if (!patternObj) return res.status(404).json({ error: 'Pattern not found' });
  const userInputLower = userInput.toLowerCase();
  const matchesAnyPattern = patternObj.patterns.some((pat) => userInputLower.includes(pat.toLowerCase()));
  const hasAllRequired = patternObj.requiredElements.every((el) => userInputLower.includes(el.toLowerCase()));
  const isMatch = matchesAnyPattern && hasAllRequired;
  res.json({ isMatch, matchType: isMatch ? 'pattern' : 'none', description: patternObj.description });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});