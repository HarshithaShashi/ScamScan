import { useMemo, useState } from 'react';
import { ScamDetectionResult, ScamPatternsByLanguage } from '@/types/scamTypes';
import { normalizeText, detectLanguage, detectMixedLanguages, extractCurrencyAmounts, findSuspiciousPatterns } from '@/utils/textPreprocessor';

// Enhanced scam patterns with multilingual support
const scamPatterns: ScamPatternsByLanguage = {
  en: {
    keywords: [
      'kyc',
      'verify',
      'blocked',
      'atm',
      'update account',
      'click here',
      'urgent',
      'immediate action',
      'account suspended',
      'security alert',
      'unauthorized access',
      'password expired',
      'verify identity',
      'account verification',
      'suspicious activity',
      'fraudulent transaction',
      'account locked',
      'security breach',
      'verify now',
      'click below',
      'update immediately',
      'account compromised',
      'security verification',
      'account deactivated',
      'verify details',
      'account restricted',
      'security update',
      'account verification required',
      'verify account',
      'account security alert',
      // High-risk financial terms
      'refund',
      'bonus',
      'cash prize',
      'lottery',
      'winning',
      'reward',
      'free money',
      'instant cash',
      'quick money',
      'easy money'
    ],
    bankPhrases: [
      'bank account',
      'credit card',
      'debit card',
      'account number',
      'routing number',
      'swift code',
      'ifsc code',
      'account balance',
      'transaction',
      'transfer',
      'withdrawal',
      'deposit',
      'banking details',
      'financial information',
      'account credentials',
      'banking credentials',
      'account access',
      'bank access',
      'account verification',
      'bank verification'
    ],
    threats: [
      'account will be blocked',
      'account will be suspended',
      'account will be closed',
      'account will be terminated',
      'account will be deactivated',
      'account will be restricted',
      'account will be locked',
      'account will be frozen',
      'account will be disabled',
      'account will be deleted'
    ],
    urgency: [
      'immediately',
      'urgent',
      'as soon as possible',
      'right away',
      'without delay',
      'promptly',
      'quickly',
      'hurry',
      'emergency',
      'critical'
    ],
    mixedLanguage: [
      'paise bhejo now',
      'you won ₹5000 ka lottery',
      'account block ho jayega',
      'kyc verify karo',
      'urgent action required hai',
      'bank details share karo',
      'otp send karo',
      'money transfer karo',
      'account verify karo',
      'security alert aaya hai'
    ]
  },
  hi: {
    keywords: [
      'केवाईसी',
      'सत्यापित',
      'अवरुद्ध',
      'एटीएम',
      'खाता अपडेट',
      'यहां क्लिक करें',
      'तत्काल',
      'तुरंत कार्रवाई',
      'खाता निलंबित',
      'सुरक्षा चेतावनी',
      'अनधिकृत पहुंच',
      'पासवर्ड समाप्त',
      'पहचान सत्यापित',
      'खाता सत्यापन',
      'संदिग्ध गतिविधि',
      'धोखाधड़ी लेनदेन',
      'खाता लॉक',
      'सुरक्षा उल्लंघन',
      'अभी सत्यापित करें',
      'नीचे क्लिक करें',
      // High-risk financial terms in Hindi
      'वापसी',
      'बोनस',
      'नकद पुरस्कार',
      'लॉटरी',
      'जीत',
      'इनाम',
      'मुफ्त पैसा',
      'तुरंत नकद',
      'जल्दी पैसा',
      'आसान पैसा'
    ],
    bankPhrases: [
      'बैंक खाता',
      'क्रेडिट कार्ड',
      'डेबिट कार्ड',
      'खाता संख्या',
      'रूटिंग नंबर',
      'स्विफ्ट कोड',
      'आईएफएससी कोड',
      'खाता शेष',
      'लेनदेन',
      'स्थानांतरण'
    ],
    threats: [
      'खाता अवरुद्ध हो जाएगा',
      'खाता निलंबित हो जाएगा',
      'खाता बंद हो जाएगा',
      'खाता समाप्त हो जाएगा',
      'खाता निष्क्रिय हो जाएगा'
    ],
    urgency: [
      'तत्काल',
      'तुरंत',
      'जल्द से जल्द',
      'अभी',
      'बिना देरी',
      'शीघ्र',
      'जल्दी',
      'जल्दी करो',
      'आपातकाल',
      'महत्वपूर्ण'
    ],
    mixedLanguage: [
      'account block हो जाएगा',
      'kyc verify करें',
      'urgent action required है',
      'bank details share करें',
      'otp send करें',
      'money transfer करें',
      'account verify करें',
      'security alert आया है'
    ]
  },
  kn: {
    keywords: [
      'ಕೆವೈಸಿ',
      'ಪರಿಶೀಲಿಸಿ',
      'ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ',
      'ಎಟಿಎಂ',
      'ಖಾತೆ ನವೀಕರಿಸಿ',
      'ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ',
      'ತುರ್ತು',
      'ತಕ್ಷಣ ಕ್ರಮ',
      'ಖಾತೆ ನಿಲ್ಲಿಸಲಾಗಿದೆ',
      'ಸುರಕ್ಷತೆ ಎಚ್ಚರಿಕೆ',
      'ಅನಧಿಕೃತ ಪ್ರವೇಶ',
      'ಪಾಸ್ವರ್ಡ್ ಮುಕ್ತಾಯ',
      'ಗುರುತು ಪರಿಶೀಲಿಸಿ',
      'ಖಾತೆ ಪರಿಶೀಲನೆ',
      'ಸಂಶಯಾಸ್ಪದ ಚಟುವಟಿಕೆ',
      'ವಂಚನೆ ವಹಿವಾಟು',
      'ಖಾತೆ ಲಾಕ್',
      'ಸುರಕ್ಷತೆ ಉಲ್ಲಂಘನೆ',
      'ಈಗ ಪರಿಶೀಲಿಸಿ',
      'ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ',
      // High-risk financial terms in Kannada
      'ಮರುಪಾವತಿ',
      'ಬೋನಸ್',
      'ನಗದು ಬಹುಮಾನ',
      'ಲಾಟರಿ',
      'ಗೆಲುವು',
      'ಬಹುಮಾನ',
      'ಉಚಿತ ಹಣ',
      'ತಕ್ಷಣ ನಗದು',
      'ಬೇಗ ಹಣ',
      'ಸುಲಭ ಹಣ'
    ],
    bankPhrases: [
      'ಬ್ಯಾಂಕ್ ಖಾತೆ',
      'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್',
      'ಡೆಬಿಟ್ ಕಾರ್ಡ್',
      'ಖಾತೆ ಸಂಖ್ಯೆ',
      'ರೂಟಿಂಗ್ ಸಂಖ್ಯೆ',
      'ಸ್ವಿಫ್ಟ್ ಕೋಡ್',
      'ಐಎಫ್ಎಸ್ಸಿ ಕೋಡ್',
      'ಖಾತೆ ಬಾಕಿ',
      'ವಹಿವಾಟು',
      'ವರ್ಗಾವಣೆ'
    ],
    threats: [
      'ಖಾತೆ ನಿರ್ಬಂಧಿಸಲಾಗುತ್ತದೆ',
      'ಖಾತೆ ನಿಲ್ಲಿಸಲಾಗುತ್ತದೆ',
      'ಖಾತೆ ಮುಚ್ಚಲಾಗುತ್ತದೆ',
      'ಖಾತೆ ಕೊನೆಗೊಳ್ಳುತ್ತದೆ',
      'ಖಾತೆ ನಿಷ್ಕ್ರಿಯಗೊಳ್ಳುತ್ತದೆ'
    ],
    urgency: [
      'ತಕ್ಷಣ',
      'ತುರ್ತು',
      'ಶೀಘ್ರ',
      'ಇದೀಗ',
      'ವಿಳಂಬವಿಲ್ಲದೆ',
      'ತ್ವರಿತ',
      'ಬೇಗ',
      'ಬೇಗನೆ',
      'ತುರ್ತು ಪರಿಸ್ಥಿತಿ',
      'ಮುಖ್ಯ'
    ],
    mixedLanguage: [
      'account block ಆಗುತ್ತದೆ',
      'kyc verify ಮಾಡಿ',
      'urgent action required ಇದೆ',
      'bank details share ಮಾಡಿ',
      'otp send ಮಾಡಿ',
      'money transfer ಮಾಡಿ',
      'account verify ಮಾಡಿ',
      'security alert ಬಂದಿದೆ'
    ]
  }
};

// URL pattern matching
const urlPattern = /(https?:\/\/[^\s]+)/g;

// Shady domain patterns
const SHADY_DOMAINS = [
  '.xyz',
  '.buzz',
  '.top',
  'upi-refund',
  'bank-refund',
  'secure-payment',
  'verify-account',
  'update-details'
];

// Dummy function to simulate URL safety check
const checkURLSafety = (url: string): boolean => {
  // For now, consider all URLs as suspicious
  return true;
};

export function useScamDetection() {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scamResult, setScamResult] = useState<ScamDetectionResult | null>(null);

  // Expose derived values
  const confidence = scamResult?.confidence ?? null;
  const matchedPatterns = scamResult?.matchedPatterns ?? [];
  const scamCategory = scamResult?.isScam ? 'scam' : 'safe';

  const getThreatLevel = (confidence: number, hasHighRiskIndicators: boolean): 'low' | 'medium' | 'high' => {
    if (confidence >= 0.8 && !hasHighRiskIndicators) return 'low';
    if (confidence >= 0.5 || hasHighRiskIndicators) return 'medium';
    return 'high';
  };

  const getVerdictMessage = (confidence: number, hasHighRiskIndicators: boolean): string => {
    if (confidence >= 0.8 && !hasHighRiskIndicators) return '✅ Message Appears Safe';
    if (confidence >= 0.5) return '⚠️ Message May Be Safe, But Exercise Caution';
    if (confidence >= 0.3) return '⚠️ Message Appears Suspicious';
    return '🚨 Likely Scam Message – Do Not Click or Respond';
  };

  const generateWarningSummary = (
    hasSuspiciousLinks: boolean,
    hasUrgentCTA: boolean,
    hasFinancialLure: boolean,
    suspiciousElements: string[]
  ): string[] => {
    const warnings: string[] = [];
    
    if (hasSuspiciousLinks) {
      warnings.push('⚠️ Contains suspicious links or domains');
    }
    
    if (hasUrgentCTA) {
      warnings.push('⚠️ Contains urgent call-to-action phrases');
    }
    
    if (hasFinancialLure) {
      warnings.push('⚠️ Contains financial incentives or claims');
    }
    
    if (suspiciousElements.length > 0) {
      warnings.push('⚠️ Contains other suspicious elements');
    }
    
    return warnings;
  };

  const scanMessage = (newMessage: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(newMessage);

      // Preprocess the message
      const normalizedText = normalizeText(newMessage);
      
      // Detect languages
      const primaryLanguage = detectLanguage(normalizedText);
      const mixedLanguages = detectMixedLanguages(normalizedText);
      
      // Extract suspicious elements
      const currencyAmounts = extractCurrencyAmounts(normalizedText);
      const suspiciousPatterns = findSuspiciousPatterns(normalizedText);
      
      let confidenceScore = 0;
      const matchedPatterns: string[] = [];
      
      // Initialize details object with empty arrays
      const details = {
        matchedKeywords: [] as string[],
        matchedBankPhrases: [] as string[],
        matchedThreats: [] as string[],
        matchedUrgency: [] as string[],
        hasSuspiciousLinks: false,
        hasUrgentCTA: false,
        hasFinancialLure: false
      };
      
      // Create a set of all languages to check
      const languagesToCheck = new Set([...mixedLanguages, 'en']);
      
      // Check patterns for each detected language
      languagesToCheck.forEach(lang => {
        const patterns = scamPatterns[lang];
        if (!patterns) return;

        // Check keywords
        if (patterns.keywords) {
          const matched = patterns.keywords.filter(keyword => 
            normalizedText.includes(keyword.toLowerCase())
          );
          if (matched.length > 0) {
            confidenceScore += 0.2;
            matchedPatterns.push(...matched);
            details.matchedKeywords.push(...matched);
          }
        }

        // Check bank phrases
        if (patterns.bankPhrases) {
          const matched = patterns.bankPhrases.filter(phrase => 
            normalizedText.includes(phrase.toLowerCase())
          );
          if (matched.length > 0) {
            confidenceScore += 0.2;
            matchedPatterns.push(...matched);
            details.matchedBankPhrases.push(...matched);
          }
        }

        // Check threats
        if (patterns.threats) {
          const matched = patterns.threats.filter(threat => 
            normalizedText.includes(threat.toLowerCase())
          );
          if (matched.length > 0) {
            confidenceScore += 0.3;
            matchedPatterns.push(...matched);
            details.matchedThreats.push(...matched);
          }
        }

        // Check urgency
        if (patterns.urgency) {
          const matched = patterns.urgency.filter(word => 
            normalizedText.includes(word.toLowerCase())
          );
          if (matched.length > 0) {
            confidenceScore += 0.1;
            matchedPatterns.push(...matched);
            details.matchedUrgency.push(...matched);
          }
        }

        // Check mixed language patterns
        if (patterns.mixedLanguage) {
          const matched = patterns.mixedLanguage.filter(pattern => 
            normalizedText.includes(pattern.toLowerCase())
          );
          if (matched.length > 0) {
            confidenceScore += 0.2;
            matchedPatterns.push(...matched);
          }
        }
      });

      // Check for suspicious links
      const hasSuspiciousLinks = suspiciousPatterns.some(pattern => {
        const isShadyDomain = SHADY_DOMAINS.some(domain => 
          pattern.toLowerCase().includes(domain)
        );
        return pattern.match(/(?:https?:\/\/|www\.)[^\s]+/gi) || isShadyDomain;
      });
      details.hasSuspiciousLinks = hasSuspiciousLinks;

      // Check for urgent CTAs
      details.hasUrgentCTA = matchedPatterns.some(pattern => 
        pattern.toLowerCase().includes('urgent') || 
        pattern.toLowerCase().includes('immediately') ||
        pattern.toLowerCase().includes('now')
      );

      // Check for financial lures
      details.hasFinancialLure = matchedPatterns.some(pattern => 
        pattern.toLowerCase().includes('refund') ||
        pattern.toLowerCase().includes('bonus') ||
        pattern.toLowerCase().includes('prize') ||
        pattern.toLowerCase().includes('lottery')
      );

      // Add confidence for suspicious elements
      if (currencyAmounts.length > 0) confidenceScore += 0.1;
      if (suspiciousPatterns.length > 0) confidenceScore += 0.2;
      if (hasSuspiciousLinks) confidenceScore += 0.3;
      if (details.hasUrgentCTA) confidenceScore += 0.2;
      if (details.hasFinancialLure) confidenceScore += 0.2;

      // Normalize confidence score
      confidenceScore = Math.min(confidenceScore, 1);

      const hasHighRiskIndicators = hasSuspiciousLinks || details.hasUrgentCTA || details.hasFinancialLure;
      const threatLevel = getThreatLevel(confidenceScore, hasHighRiskIndicators);
      const verdictMessage = getVerdictMessage(confidenceScore, hasHighRiskIndicators);
      const warningSummary = generateWarningSummary(
        hasSuspiciousLinks,
        details.hasUrgentCTA,
        details.hasFinancialLure,
        suspiciousPatterns
      );

      const result: ScamDetectionResult = {
        isScam: confidenceScore < 0.5 || hasHighRiskIndicators,
        confidence: confidenceScore,
        matchedPatterns,
        detectedLanguages: Array.from(languagesToCheck),
        suspiciousElements: [...currencyAmounts, ...suspiciousPatterns],
        explanation: verdictMessage,
        details,
        threatLevel,
        warningSummary
      };

      setScamResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during scam detection');
    } finally {
      setIsLoading(false);
    }
  };

  const generateExplanation = (
    confidence: number,
    patterns: string[],
    languages: string[]
  ): string => {
    if (confidence >= 0.8) {
      return 'High confidence scam detected with multiple suspicious patterns';
    } else if (confidence >= 0.5) {
      return 'Potential scam detected with suspicious patterns';
    } else if (confidence > 0) {
      return 'Some suspicious elements found, but not enough to confirm scam';
    }
    return 'No suspicious patterns detected';
  };

  const resetScan = () => {
    setMessage('');
    setScamResult(null);
    setError(null);
  };

  return {
    message,
    isLoading,
    error,
    scamResult,
    confidence,
    matchedPatterns,
    scamCategory,
    scanMessage,
    resetScan
  };
} 