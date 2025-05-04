// Define rules for scam detection
export const scamRules = [
  {
    id: 'banking_info',
    keywords: ['bank account', 'credit card', 'debit card', 'OTP', 'PIN', 'password', 'CVV'],
    patterns: [
      '\\b\\d{16}\\b', // Credit card number pattern
      '\\bOTP\\b.*\\d{4,6}\\b', // OTP pattern
    ],
    explanation: 'Requests for banking details or security codes',
  },
  {
    id: 'kyc_update',
    keywords: ['kyc', 'update kyc', 'verify account', 'account suspended', 'blocked'],
    patterns: [
      '\\bkyc\\b.*\\bupdate\\b',
      '\\baccount\\b.*\\bblock\\b',
      '\\baccount\\b.*\\bsuspend\\b',
    ],
    explanation: 'Fake KYC or account verification requests',
  },
  {
    id: 'prizes',
    keywords: ['prize', 'lottery', 'won', 'winner', 'reward', 'gift', 'cash prize'],
    patterns: [
      '\\bwon\\b.*\\₹[\\d,]+',
      '\\blottery\\b.*\\bwon\\b',
      '\\bprize\\b.*\\bclaim\\b',
    ],
    explanation: 'Fake lottery or prize notifications',
  },
  {
    id: 'government_impersonation',
    keywords: ['tax', 'refund', 'income tax', 'govt', 'government', 'aadhaar', 'pan card'],
    patterns: [
      '\\btax\\b.*\\brefund\\b',
      '\\bincome tax\\b.*\\breturn\\b',
      '\\baadhaar\\b.*\\bverify\\b',
    ],
    explanation: 'Government agency impersonation',
  },
  {
    id: 'job_offers',
    keywords: ['job offer', 'work from home', 'earn money', 'income', 'salary', 'part time'],
    patterns: [
      '\\bearn\\b.*\\₹[\\d,]+\\b.*\\bday\\b',
      '\\bwork from home\\b.*\\bearn\\b',
    ],
    explanation: 'Suspicious job offers or income schemes',
  },
  {
    id: 'investment',
    keywords: ['invest', 'investment', 'returns', 'profit', 'stock', 'trading', 'mutual fund'],
    patterns: [
      '\\binvest\\b.*\\b\\d+%\\b.*\\breturns\\b',
      '\\bprofit\\b.*\\bguaranteed\\b',
    ],
    explanation: 'Suspicious investment schemes promising high returns',
  },
  {
    id: 'tech_support',
    keywords: ['virus', 'malware', 'hacked', 'security', 'tech support', 'microsoft', 'google'],
    patterns: [
      '\\bvirus\\b.*\\bdetected\\b',
      '\\baccount\\b.*\\bhacked\\b',
      '\\bsecurity\\b.*\\bcompromised\\b',
    ],
    explanation: 'Fake tech support or security warnings',
  },
  {
    id: 'personal_info',
    keywords: ['aadhaar number', 'pan number', 'personal details', 'address proof', 'verify identity'],
    patterns: [
      '\\baadhaar\\b.*\\bnumber\\b',
      '\\bpan\\b.*\\bnumber\\b',
      '\\bverify\\b.*\\bidentity\\b',
    ],
    explanation: 'Requests for personal identification details',
  }
];