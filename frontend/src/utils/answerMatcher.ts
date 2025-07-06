/**
 * Flexible Answer Matching Utility
 * Supports fuzzy matching, synonyms, abbreviations, and multiple acceptable answers
 */

// Interface for defining acceptable answers with synonyms and abbreviations
export interface AcceptableAnswer {
  primary: string;
  synonyms?: string[];
  abbreviations?: string[];
  alternativeSpellings?: string[];
}

// Levenshtein distance implementation for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Calculate similarity percentage between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;
  
  const distance = levenshteinDistance(str1, str2);
  return ((maxLength - distance) / maxLength) * 100;
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove special characters except hyphens and spaces
    .replace(/[^\w\s-]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove common articles and prepositions that don't affect meaning
    .replace(/\b(the|a|an|and|or|of|in|on|at|to|for|with|by)\b/g, '')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if user input matches any acceptable answer
export function matchAnswer(
  userInput: string,
  acceptableAnswers: AcceptableAnswer[],
  options: {
    fuzzyThreshold?: number; // Minimum similarity percentage (default: 80%)
    exactMatchBonus?: number; // Extra points for exact matches
    synonymMatchBonus?: number; // Points for synonym matches
    abbreviationMatchBonus?: number; // Points for abbreviation matches
    strictMode?: boolean; // If true, requires higher similarity threshold
  } = {}
): {
  isMatch: boolean;
  matchType: 'exact' | 'synonym' | 'abbreviation' | 'fuzzy' | 'alternative' | 'none';
  similarity: number;
  matchedAnswer: string;
  confidence: number;
} {
  const {
    fuzzyThreshold = 80,
    exactMatchBonus = 100,
    synonymMatchBonus = 90,
    abbreviationMatchBonus = 85,
    strictMode = false
  } = options;

  const normalizedInput = normalizeText(userInput);
  
  let bestMatch: {
    isMatch: boolean;
    matchType: 'exact' | 'synonym' | 'abbreviation' | 'fuzzy' | 'alternative' | 'none';
    similarity: number;
    matchedAnswer: string;
    confidence: number;
  } = {
    isMatch: false,
    matchType: 'none',
    similarity: 0,
    matchedAnswer: '',
    confidence: 0
  };

  for (const answer of acceptableAnswers) {
    // Check exact match with primary answer
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

    // Check synonyms
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

    // Check abbreviations
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

    // Check alternative spellings
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

    // Fuzzy match with primary answer
    if (primarySimilarity >= fuzzyThreshold && primarySimilarity > bestMatch.similarity) {
      const adjustedThreshold = strictMode ? fuzzyThreshold + 10 : fuzzyThreshold;
      if (primarySimilarity >= adjustedThreshold) {
        bestMatch = {
          isMatch: true,
          matchType: 'fuzzy',
          similarity: primarySimilarity,
          matchedAnswer: answer.primary,
          confidence: (primarySimilarity / 100) * 75 // Lower confidence for fuzzy matches
        };
      }
    }
  }

  return bestMatch;
}

// Predefined answer sets for common cybersecurity terms
export const CYBERSECURITY_ANSWERS = {
  XSS: {
    primary: "Cross-Site Scripting",
    synonyms: ["cross site scripting", "cross-site script", "xss attack"],
    abbreviations: ["XSS"],
    alternativeSpellings: ["crosssite scripting", "cross site script"]
  },
  SQL_INJECTION: {
    primary: "SQL Injection",
    synonyms: ["structured query language injection", "sql injection attack", "database injection"],
    abbreviations: ["SQLi", "SQLI"],
    alternativeSpellings: ["sql-injection", "sqlinjection"]
  },
  DDOS: {
    primary: "Distributed Denial of Service",
    synonyms: ["distributed denial-of-service", "ddos attack", "distributed dos"],
    abbreviations: ["DDoS", "DDOS"],
    alternativeSpellings: ["distributed denial of service attack"]
  },
  MITM: {
    primary: "Man-in-the-Middle",
    synonyms: ["man in the middle attack", "mitm attack", "person in the middle"],
    abbreviations: ["MITM", "MitM"],
    alternativeSpellings: ["man-in-the-middle", "man in middle"]
  },
  DNS: {
    primary: "Domain Name System",
    synonyms: ["domain name service", "dns resolution", "name resolution"],
    abbreviations: ["DNS"],
    alternativeSpellings: ["domain-name-system"]
  },
  HTTPS: {
    primary: "HTTPS",
    synonyms: ["hypertext transfer protocol secure", "http secure", "secure http"],
    abbreviations: ["HTTPS"],
    alternativeSpellings: ["http-s", "hyper text transfer protocol secure"]
  }
};

// Helper function to create answer configurations for challenges
export function createAnswerConfig(
  primaryAnswer: string,
  options: {
    synonyms?: string[];
    abbreviations?: string[];
    alternativeSpellings?: string[];
  } = {}
): AcceptableAnswer[] {
  return [{
    primary: primaryAnswer,
    ...options
  }];
}

// Enhanced matcher for SQL injection patterns
export function matchSQLInjectionPattern(userInput: string, expectedPattern: string): boolean {
  const normalizedInput = userInput.trim().replace(/\s+/g, ' ').toLowerCase();
  const normalizedPattern = expectedPattern.trim().replace(/\s+/g, ' ').toLowerCase();
  
  // Check if the input contains the expected pattern or key components
  if (normalizedInput.includes(normalizedPattern)) {
    return true;
  }
  
  // Check for common SQL injection keywords and patterns
  const sqlKeywords = ['or', 'and', 'union', 'select', 'where', 'from', 'drop', 'insert'];
  const hasRelevantKeywords = sqlKeywords.some(keyword => 
    normalizedInput.includes(keyword) && normalizedPattern.includes(keyword)
  );
  
  // Check for common SQL patterns like quotes, equals, etc.
  const hasSQLPattern = /['";=\-\-]/.test(userInput) && /['";=\-\-]/.test(expectedPattern);
  
  return hasRelevantKeywords && hasSQLPattern;
}

// Enhanced matcher for XSS patterns
export function matchXSSPattern(userInput: string): boolean {
  const normalizedInput = userInput.toLowerCase();
  
  // Must contain alert or similar function call
  const hasPayload = /alert\(|confirm\(|prompt\(|console\.log\(/.test(normalizedInput);
  
  // Must have XSS vector
  const hasVector = 
    normalizedInput.includes('<script>') ||
    /on\w+\s*=/.test(normalizedInput) || // event handlers
    normalizedInput.includes('srcdoc') ||
    normalizedInput.includes('javascript:') ||
    normalizedInput.includes('<iframe') ||
    normalizedInput.includes('<img') ||
    normalizedInput.includes('<svg');
  
  return hasPayload && hasVector;
}
