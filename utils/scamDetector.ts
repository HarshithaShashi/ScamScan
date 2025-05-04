import { scamRules } from '@/constants/ScamRules';
import { ScamResult } from '@/types/scamTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type TranslationKey = 
  | 'scamDetection.low.title'
  | 'scamDetection.low.description'
  | 'scamDetection.medium.title'
  | 'scamDetection.medium.description'
  | 'scamDetection.high.title'
  | 'scamDetection.high.description'
  | 'scamDetection.indicators.bankingInfo'
  | 'scamDetection.indicators.kycUpdate'
  | 'scamDetection.indicators.prizes'
  | 'scamDetection.indicators.governmentImpersonation'
  | 'scamDetection.indicators.jobOffers'
  | 'scamDetection.indicators.investment'
  | 'scamDetection.indicators.techSupport'
  | 'scamDetection.indicators.personalInfo'
  | 'scamDetection.indicators.suspiciousUrls'
  | 'scamDetection.indicators.urgency'
  | 'scamDetection.indicators.noIndicators';

// Helper to check for suspicious URLs
const containsSuspiciousURL = (text: string): boolean => {
  // Basic regex for shortened URLs or suspicious domains
  const urlRegex = /(bit\.ly|tinyurl\.com|goo\.gl|t\.co|tiny\.cc)/i;
  return urlRegex.test(text);
};

// Helper to check for urgency language
const containsUrgency = (text: string): boolean => {
  const urgencyTerms = /urgent|immediately|expires|limited time|act now|hurry|quick|today only/i;
  return urgencyTerms.test(text);
};

export function detectScam(message: string, t: (key: TranslationKey) => string): ScamResult {
  // Convert to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Check for matches against scam rules
  const matchedRules = scamRules.filter(rule => {
    // Check for keyword matches
    const keywordMatch = rule.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // Check for regex pattern matches
    const patternMatch = rule.patterns.some(pattern => 
      new RegExp(pattern, 'i').test(message)
    );
    
    return keywordMatch || patternMatch;
  });
  
  // Get all matched terms for highlighting
  const matchedTerms = matchedRules.flatMap(rule => rule.keywords);
  
  // Additional checks
  const hasUrl = containsSuspiciousURL(message);
  const hasUrgency = containsUrgency(message);
  
  // Calculate threat level
  let threatLevel: 'low' | 'medium' | 'high';
  if (matchedRules.length === 0 && !hasUrl && !hasUrgency) {
    threatLevel = 'low';
  } else if (matchedRules.length >= 3 || (matchedRules.length >= 1 && (hasUrl || hasUrgency))) {
    threatLevel = 'high';
  } else {
    threatLevel = 'medium';
  }
  
  // Gather scam indicators
  const indicators: string[] = [];
  matchedRules.forEach(rule => {
    indicators.push(t(`scamDetection.indicators.${rule.id}` as TranslationKey));
  });
  
  if (hasUrl) {
    indicators.push(t('scamDetection.indicators.suspiciousUrls'));
  }
  
  if (hasUrgency) {
    indicators.push(t('scamDetection.indicators.urgency'));
  }
  
  if (indicators.length === 0) {
    indicators.push(t('scamDetection.indicators.noIndicators'));
  }
  
  return {
    threatLevel,
    matchedTerms,
    explanation: t(`scamDetection.${threatLevel}.description` as TranslationKey),
    indicators,
  };
}