/**
 * Centralized Challenge Answer Dataset
 * Contains all acceptable answers for cybersecurity challenges
 */

import type { AcceptableAnswer } from '../utils/answerMatcher';

// Pattern matching interface for XSS and SQL challenges
interface ChallengePattern {
  patterns: string[];
  requiredElements: string[];
  description: string;
}

// Network Security Challenge Answers
export const NETWORK_SECURITY_ANSWERS: Record<string, AcceptableAnswer[]> = {
  'subnet_mask_class_c': [
    {
      primary: "255.255.255.0",
      synonyms: ["class c subnet mask", "default class c mask"],
      abbreviations: ["/24"],
      alternativeSpellings: ["255.255.255.0/24", "255 255 255 0"]
    }
  ],
  
  'port_443_service': [
    {
      primary: "HTTPS",
      synonyms: [
        "hypertext transfer protocol secure", 
        "http secure", 
        "secure http",
        "https protocol",
        "secure web protocol"
      ],
      abbreviations: ["HTTPS"],
      alternativeSpellings: ["http-s", "hyper text transfer protocol secure"]
    }
  ],
  
  'ddos_attack': [
    {
      primary: "Distributed Denial of Service",
      synonyms: [
        "distributed denial-of-service", 
        "ddos attack", 
        "distributed dos",
        "distributed denial of service attack",
        "botnet attack"
      ],
      abbreviations: ["DDoS", "DDOS"],
      alternativeSpellings: ["distributed denial-of-service", "distributed dos attack"]
    }
  ],
  
  'mitm_attack': [
    {
      primary: "Man-in-the-Middle",
      synonyms: [
        "man in the middle attack", 
        "mitm attack", 
        "person in the middle",
        "man in middle attack",
        "interceptor attack"
      ],
      abbreviations: ["MITM", "MitM", "PITM"],
      alternativeSpellings: ["man-in-the-middle", "man in middle"]
    }
  ],
  
  'dns_protocol': [
    {
      primary: "Domain Name System",
      synonyms: [
        "domain name service", 
        "dns resolution", 
        "name resolution",
        "domain resolution",
        "dns service"
      ],
      abbreviations: ["DNS"],
      alternativeSpellings: ["domain-name-system", "domain name resolution"]
    }
  ],
  
  'firewall_technology': [
    {
      primary: "Firewall",
      synonyms: [
        "network firewall",
        "packet filter",
        "security barrier",
        "access control"
      ],
      alternativeSpellings: ["fire-wall", "fire wall"]
    }
  ],
  
  'arp_poisoning': [
    {
      primary: "ARP Poisoning",
      synonyms: [
        "arp spoofing",
        "address resolution protocol poisoning",
        "arp cache poisoning",
        "arp attack"
      ],
      abbreviations: ["ARP poisoning"],
      alternativeSpellings: ["arp-poisoning"]
    }
  ]
};

// Cryptography Challenge Answers
export const CRYPTOGRAPHY_ANSWERS: Record<string, AcceptableAnswer[]> = {
  'caesar_cipher_hello_world': [
    {
      primary: "HELLO, WORLD!",
      synonyms: ["hello world message"],
      alternativeSpellings: [
        "hello world", 
        "hello, world", 
        "HELLO WORLD", 
        "helloworld",
        "hello world!",
        "Hello, World!"
      ]
    }
  ],
  
  'base64_security_illusion': [
    {
      primary: "Security is an illusion.",
      synonyms: ["security is not real", "safety is fake", "security is false"],
      alternativeSpellings: [
        "security is an illusion", 
        "Security is an illusion", 
        "security is illusion", 
        "security is a illusion",
        "Security is an illusion",
        "security is an illusion."
      ]
    }
  ],
  
  'md5_hash_1337': [
    {
      primary: "1337",
      synonyms: ["leet", "elite"],
      alternativeSpellings: ["1337"]
    }
  ],
  
  'vigenere_hello_agent': [
    {
      primary: "HELLO, AGENT!",
      synonyms: ["hello agent message"],
      alternativeSpellings: [
        "hello agent", 
        "hello, agent", 
        "HELLO AGENT", 
        "helloagent",
        "hello agent!",
        "Hello, Agent!"
      ]
    }
  ],
  
  'rsa_decrypt_secret': [
    {
      primary: "SECRET",
      synonyms: ["secret message", "the secret"],
      alternativeSpellings: ["secret"]
    }
  ],
  
  'aes_plaintext': [
    {
      primary: "Cybersecurity rocks!",
      synonyms: ["cybersec rocks", "security rocks"],
      alternativeSpellings: [
        "cybersecurity rocks",
        "Cybersecurity Rocks!",
        "cyber security rocks!",
        "cybersecurity rocks!"
      ]
    }
  ]
};

// XSS Challenge Answer Patterns
export const XSS_PATTERNS = {
  // Specific challenge answer keys mapping to pattern types
  challengeAnswers: {
    'xss_basic_script_alert': {
      patterns: ['<script>alert(', '<script>alert("', "<script>alert('"],
      requiredElements: ['<script>', 'alert(', 'XSS'],
      description: "Basic script tag with alert function"
    },
    'xss_img_onerror': {
      patterns: ['<img', 'onerror=', 'alert('],
      requiredElements: ['<img', 'onerror', 'alert'],
      description: "Image tag with onerror event handler"
    },
    'xss_dom_script_break': {
      patterns: ['</script>', '<script>', 'alert('],
      requiredElements: ['</script>', '<script>', 'alert', 'DOM'],
      description: "DOM-based XSS with script tag breakout"
    },
    'xss_csp_bypass_iframe': {
      patterns: ['<iframe', 'srcdoc=', 'alert(', 'parent.'],
      requiredElements: ['<iframe', 'srcdoc', 'alert', 'CSP'],
      description: "CSP bypass using iframe srcdoc"
    },
    'xss_reflected_attribute_break': {
      patterns: ['" onmouseover="', 'alert(', 'Reflected'],
      requiredElements: ['"', 'onmouseover', 'alert'],
      description: "Reflected XSS by breaking out of attributes"
    }
  },
  
  // Required payload indicators
  payloadIndicators: [
    'alert(',
    'confirm(',
    'prompt(',
    'console.log(',
    'eval(',
    'document.write(',
    'window.open('
  ],
  
  // XSS vectors
  vectors: [
    '<script>',
    '<script ',
    'onerror=',
    'onload=',
    'onmouseover=',
    'onclick=',
    'onfocus=',
    'onblur=',
    'srcdoc=',
    'javascript:',
    '<iframe',
    '<img',
    '<svg',
    '<object',
    '<embed',
    '<style',
    'expression(',
    'vbscript:',
    'data:text/html'
  ],
  
  // Advanced vectors
  advancedVectors: [
    '</script>',
    '&lt;script&gt;',
    '%3Cscript%3E',
    'String.fromCharCode',
    'setTimeout',
    'setInterval'
  ]
};

// SQL Injection Challenge Patterns
export const SQL_INJECTION_PATTERNS = {
  // Specific challenge answer keys mapping to pattern types
  challengeAnswers: {
    'sql_auth_bypass': {
      patterns: ["' OR '1'='1", "' or '1'='1", "' OR 1=1--", "' or 1=1--"],
      requiredElements: ["'", 'OR', '1', '='],
      description: "Authentication bypass using always-true condition"
    },
    'sql_union_version': {
      patterns: ["' UNION SELECT @@VERSION--", "' union select @@version--", "' UNION SELECT VERSION()--"],
      requiredElements: ["'", 'UNION', 'SELECT', '@@VERSION'],
      description: "UNION-based attack to extract database version"
    },
    'sql_schema_enum': {
      patterns: ["' UNION SELECT table_name FROM information_schema.tables", "information_schema.tables"],
      requiredElements: ["'", 'UNION', 'SELECT', 'table_name', 'information_schema'],
      description: "Schema enumeration using information_schema"
    },
    'sql_case_bypass': {
      patterns: ["' or '1'='1", "' OR '1'='1", "' Or '1'='1"],
      requiredElements: ["'", 'or', '1', '='],
      description: "Case-sensitive filter bypass"
    },
    'sql_time_based_blind': {
      patterns: ["SLEEP(5)", "BENCHMARK(", "IF(SUBSTRING(", "password FROM users WHERE username='admin'"],
      requiredElements: ['IF', 'SUBSTRING', 'SLEEP', 'password', 'admin'],
      description: "Time-based blind SQL injection"
    }
  },
  // Common SQL keywords
  keywords: [
    'select', 'union', 'where', 'from', 'insert', 'update', 'delete', 'drop',
    'create', 'alter', 'grant', 'revoke', 'exec', 'execute', 'declare',
    'cast', 'convert', 'substring', 'ascii', 'char', 'concat', 'length',
    'database', 'version', 'user', 'current_user', 'system_user',
    'information_schema', 'sysobjects', 'syscolumns', 'tables', 'columns'
  ],
  
  // SQL operators and characters
  operators: [
    "'", '"', ';', '--', '/*', '*/', '||', '+', '=', '<', '>', '!=', '<>',
    'like', 'in', 'between', 'is', 'null', 'and', 'or', 'not', 'exists'
  ],
  
  // Common injection techniques
  techniques: [
    "' or '1'='1",
    "' or 1=1--",
    "admin'--",
    "' union select",
    "' and 1=1--",
    "' and 1=2--",
    "'; drop table",
    "' or sleep(5)--",
    "' and if(",
    "' and ascii(",
    "' and substring("
  ],
  
  // Time-based and blind injection functions
  blindFunctions: [
    'sleep(', 'benchmark(', 'waitfor delay', 'pg_sleep(', 'if(', 'case when',
    'ascii(', 'substring(', 'length(', 'mid(', 'left(', 'right('
  ]
};

// Web Security General Terms
export const WEB_SECURITY_ANSWERS: Record<string, AcceptableAnswer[]> = {
  'xss_general': [
    {
      primary: "Cross-Site Scripting",
      synonyms: [
        "cross site scripting", 
        "cross-site script", 
        "xss attack",
        "script injection",
        "javascript injection"
      ],
      abbreviations: ["XSS"],
      alternativeSpellings: ["crosssite scripting", "cross site script"]
    }
  ],
  
  'sql_injection_general': [
    {
      primary: "SQL Injection",
      synonyms: [
        "structured query language injection", 
        "sql injection attack", 
        "database injection",
        "sql attack",
        "database attack"
      ],
      abbreviations: ["SQLi", "SQLI"],
      alternativeSpellings: ["sql-injection", "sqlinjection"]
    }
  ],
  
  'csrf_attack': [
    {
      primary: "Cross-Site Request Forgery",
      synonyms: [
        "cross site request forgery",
        "csrf attack",
        "session riding",
        "request forgery"
      ],
      abbreviations: ["CSRF", "XSRF"],
      alternativeSpellings: ["cross-site request forgery"]
    }
  ],
  
  'session_hijacking': [
    {
      primary: "Session Hijacking",
      synonyms: [
        "session stealing",
        "session takeover",
        "cookie hijacking",
        "session fixation"
      ],
      alternativeSpellings: ["session-hijacking"]
    }
  ]
};

// Penetration Testing Terms
export const PENTEST_ANSWERS: Record<string, AcceptableAnswer[]> = {
  'reconnaissance': [
    {
      primary: "Reconnaissance",
      synonyms: [
        "information gathering",
        "footprinting",
        "enumeration",
        "discovery",
        "recon"
      ],
      abbreviations: ["recon"],
      alternativeSpellings: ["reconaissance"]
    }
  ],
  
  'vulnerability_assessment': [
    {
      primary: "Vulnerability Assessment",
      synonyms: [
        "vulnerability scanning",
        "security assessment",
        "weakness analysis",
        "security audit"
      ],
      abbreviations: ["VA", "vuln assessment"],
      alternativeSpellings: ["vulnerability-assessment"]
    }
  ]
};

// Digital Forensics Terms
export const FORENSICS_ANSWERS: Record<string, AcceptableAnswer[]> = {
  'chain_of_custody': [
    {
      primary: "Chain of Custody",
      synonyms: [
        "custody chain",
        "evidence chain",
        "chain of evidence"
      ],
      alternativeSpellings: ["chain-of-custody"]
    }
  ],
  
  'file_carving': [
    {
      primary: "File Carving",
      synonyms: [
        "data carving",
        "file recovery",
        "deleted file recovery"
      ],
      alternativeSpellings: ["file-carving", "filecarving"]
    }
  ]
};

// Utility function to get answers by challenge and question ID
export function getAnswersForChallenge(
  challengeType: 'network' | 'crypto' | 'web' | 'pentest' | 'forensics',
  questionId: string
): AcceptableAnswer[] | null {
  const datasets = {
    network: NETWORK_SECURITY_ANSWERS,
    crypto: CRYPTOGRAPHY_ANSWERS,
    web: WEB_SECURITY_ANSWERS,
    pentest: PENTEST_ANSWERS,
    forensics: FORENSICS_ANSWERS
  };
  
  const dataset = datasets[challengeType];
  return dataset?.[questionId] || null;
}

// Utility function to get XSS pattern matching rules
export function getXSSPattern(challengeKey: string): ChallengePattern | null {
  return (XSS_PATTERNS.challengeAnswers as Record<string, ChallengePattern>)[challengeKey] || null;
}

// Utility function to get SQL injection pattern matching rules
export function getSQLPattern(challengeKey: string): ChallengePattern | null {
  return (SQL_INJECTION_PATTERNS.challengeAnswers as Record<string, ChallengePattern>)[challengeKey] || null;
}

// Enhanced pattern matching for XSS challenges
export function matchXSSChallenge(userInput: string, challengeKey: string): boolean {
  const pattern = getXSSPattern(challengeKey);
  if (!pattern) return false;
  
  const normalizedInput = userInput.toLowerCase().trim();
  
  // Check if input contains required patterns
  const hasRequiredPatterns = pattern.patterns.some((p: string) => 
    normalizedInput.includes(p.toLowerCase())
  );
  
  // Check if input contains required elements
  const hasRequiredElements = pattern.requiredElements.every((element: string) => 
    normalizedInput.includes(element.toLowerCase())
  );
  
  return hasRequiredPatterns && hasRequiredElements;
}

// Enhanced pattern matching for SQL injection challenges
export function matchSQLChallenge(userInput: string, challengeKey: string): boolean {
  const pattern = getSQLPattern(challengeKey);
  if (!pattern) return false;
  
  const normalizedInput = userInput.toLowerCase().trim();
  
  // Check if input contains required patterns
  const hasRequiredPatterns = pattern.patterns.some((p: string) => 
    normalizedInput.includes(p.toLowerCase())
  );
  
  // Check if input contains required elements
  const hasRequiredElements = pattern.requiredElements.every((element: string) => 
    normalizedInput.includes(element.toLowerCase())
  );
  
  return hasRequiredPatterns && hasRequiredElements;
}

// Export all datasets for direct access
export const CHALLENGE_DATASETS = {
  NETWORK_SECURITY_ANSWERS,
  CRYPTOGRAPHY_ANSWERS,
  XSS_PATTERNS,
  SQL_INJECTION_PATTERNS,
  WEB_SECURITY_ANSWERS,
  PENTEST_ANSWERS,
  FORENSICS_ANSWERS
};
