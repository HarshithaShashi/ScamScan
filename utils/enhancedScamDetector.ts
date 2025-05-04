import { ScamDetectionResult } from '@/types/scamTypes';
import { normalizeText as baseNormalizeText } from '@/utils/textPreprocessor';
import { scamPatterns } from '../constants/ScamPatterns';

// Enhanced text normalization
export function normalizeText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/[0o]/g, 'o')   // Normalize similar characters
    .replace(/[1l]/g, 'l')
    .replace(/[üúùû]/g, 'u')
    .replace(/[éèêë]/g, 'e')
    .replace(/[áàâä]/g, 'a')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o')
    .toLowerCase();
}

// Remove greeting influence from the start of messages
function removeGreetingInfluence(text: string): string {
  return text.replace(/^(hey|hi|hello|namaste|namaskar)[\s,!]*?/i, '');
}

// Risk weights for different pattern categories
const RISK_WEIGHTS = {
  refundScam: 0.5,    // High risk
  banking: 0.4,       // High risk
  threats: 0.4,       // High risk
  actions: 0.4,       // High risk
  financial: 0.3,     // Medium risk
  urgency: 0.3,       // Medium risk
  verification: 0.3,  // Medium risk
  mixedLanguage: 0.3, // Medium risk
  greetings: 0.05     // Low risk
};

// Rule-based detection
function runRuleBasedDetection(normalizedMessage: string): ScamDetectionResult {
  let confidenceScore = 0;
  const matchedPatterns: string[] = [];
  const keyIndicators: { type: string; matchedText: string; riskScore: number }[] = [];
  const matchedIndicators: string[] = [];

  // Remove greeting influence
  const processedMessage = removeGreetingInfluence(normalizedMessage);

  // Check each pattern category
  Object.entries(scamPatterns).forEach(([category, patterns]: [string, string[]]) => {
    patterns.forEach((pattern: string) => {
      if (processedMessage.includes(pattern.toLowerCase())) {
        const weight = RISK_WEIGHTS[category as keyof typeof RISK_WEIGHTS] || 0.1;
        confidenceScore += weight;
        matchedPatterns.push(category);
        keyIndicators.push({
          type: category,
          matchedText: pattern,
          riskScore: weight
        });
        matchedIndicators.push(pattern);
      }
    });
  });

  // High-risk override rules
  if (matchedPatterns.includes('refundScam') && matchedPatterns.length >= 2) {
    confidenceScore = Math.max(confidenceScore, 0.85);
  }

  // Multiple medium-risk patterns override
  const mediumRiskPatterns = matchedPatterns.filter(p => 
    ['financial', 'urgency', 'verification', 'mixedLanguage'].includes(p)
  );
  if (mediumRiskPatterns.length >= 2) {
    confidenceScore = Math.max(confidenceScore, 0.75);
  }

  // Normalize confidence score
  confidenceScore = Math.min(confidenceScore, 1);

  // Determine risk level
  const riskLevel = getRiskLevel(confidenceScore);

  return {
    isScam: confidenceScore > 0.5,
    confidence: confidenceScore,
    riskLevel,
    explanation: generateExplanation(confidenceScore, matchedPatterns, matchedIndicators),
    keyIndicators,
    used: 'rule-engine',
    matchedPatterns,
    details: {
      matchedKeywords: matchedIndicators,
      matchedBankPhrases: matchedPatterns.filter(p => p === 'banking'),
      matchedThreats: matchedPatterns.filter(p => p === 'threats'),
      matchedUrgency: matchedPatterns.filter(p => p === 'urgency'),
      hasSuspiciousLinks: matchedPatterns.includes('actions'),
      hasUrgentCTA: matchedPatterns.includes('urgency'),
      hasFinancialLure: matchedPatterns.includes('financial') || matchedPatterns.includes('refundScam')
    }
  };
}

// LLM-based analysis
async function fetchLLMAnalysis(message: string): Promise<ScamDetectionResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a security-aware assistant trained to detect scams in text messages. Analyze the following message for potential scams. Focus on tone, intent, and suspicious patterns. Avoid being misled by friendly greetings. Evaluate the entire message context including financial requests, refund mentions, and URLs. Respond in JSON format:
            {
              "isScam": true | false,
              "confidence": 0.0 to 1.0,
              "riskLevel": "very_high" | "high" | "medium" | "low" | "very_low",
              "explanation": "brief explanation",
              "keyIndicators": [
                {
                  "type": "string",
                  "matchedText": "string",
                  "riskScore": number
                }
              ]
            }`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('LLM API call failed');
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return {
      ...analysis,
      used: 'llm-fallback'
    };
  } catch (error) {
    console.error('LLM analysis failed:', error);
    return {
      isScam: false,
      confidence: 0,
      riskLevel: 'low',
      explanation: 'LLM analysis failed, falling back to rule engine',
      keyIndicators: [],
      used: 'llm-fallback-error'
    };
  }
}

// Helper functions
function getRiskLevel(confidence: number): 'very_high' | 'high' | 'medium' | 'low' | 'very_low' {
  if (confidence >= 0.9) return 'very_high';
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.5) return 'medium';
  if (confidence >= 0.3) return 'low';
  return 'very_low';
}

function generateExplanation(
  confidence: number, 
  patterns: string[], 
  indicators: string[]
): string {
  const highRiskPatterns = patterns.filter(p => 
    ['refundScam', 'banking', 'threats', 'actions'].includes(p)
  );
  const mediumRiskPatterns = patterns.filter(p => 
    ['financial', 'urgency', 'verification', 'mixedLanguage'].includes(p)
  );

  if (confidence >= 0.9) {
    return `High confidence scam detected with multiple high-risk indicators: ${indicators.join(', ')}`;
  } else if (confidence >= 0.7) {
    return `Likely scam detected with ${highRiskPatterns.length} high-risk and ${mediumRiskPatterns.length} medium-risk indicators`;
  } else if (confidence >= 0.5) {
    return `Potential scam detected with ${mediumRiskPatterns.length} suspicious elements`;
  } else if (confidence >= 0.3) {
    return `Some suspicious elements found (${indicators.join(', ')}), but not enough to confirm scam`;
  }
  return 'No suspicious patterns detected';
}

// Main detection function
export async function detectScam(message: string): Promise<ScamDetectionResult> {
  const normalizedMessage = normalizeText(message);
  const ruleEngineResult = runRuleBasedDetection(normalizedMessage);

  // If rule engine is confident enough, return its result
  if (ruleEngineResult.confidence >= 0.75) {
    return ruleEngineResult;
  }

  // Otherwise, try LLM analysis
  try {
    return await fetchLLMAnalysis(message);
  } catch (error) {
    // If LLM fails, return rule engine result with error note
    return {
      ...ruleEngineResult,
      explanation: '⚠️ Scanned with offline engine',
      used: 'llm-fallback-error'
    };
  }
} 