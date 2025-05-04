export interface ScamResult {
  threatLevel: 'low' | 'medium' | 'high';
  matchedTerms: string[];
  explanation: string;
  indicators: string[];
}

export interface ScamHistoryItem {
  id: string;
  message: string;
  threatLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  matchedTerms: string[];
}

export interface ScamRule {
  id: string;
  keywords: string[];
  patterns: string[];
  explanation: string;
}

export interface ScamDetectionResult {
  isScam: boolean;
  confidence: number;
  riskLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  explanation: string;
  keyIndicators: {
    type: string;
    matchedText: string;
    riskScore: number;
  }[];
  used: 'rule-engine' | 'llm-fallback' | 'llm-fallback-error';
  matchedPatterns?: string[];
  detectedLanguages?: string[];
  suspiciousElements?: string[];
  details?: {
    matchedKeywords: string[];
    matchedBankPhrases: string[];
    matchedThreats: string[];
    matchedUrgency: string[];
    hasSuspiciousLinks: boolean;
    hasUrgentCTA: boolean;
    hasFinancialLure: boolean;
  };
}

export type ScamPatternsByLanguage = {
  [key: string]: {
    keywords: string[];
    bankPhrases: string[];
    threats: string[];
    urgency: string[];
    mixedLanguage: string[];
  };
};

export interface ScamPatterns {
  keywords: string[];
  bankPhrases: string[];
  threats: string[];
  urgency: string[];
}