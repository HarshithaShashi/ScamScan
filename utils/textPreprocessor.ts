// Unicode character mappings for normalization
const UNICODE_MAPPINGS: { [key: string]: string } = {
  // Latin characters
  'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
  'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o', 'ø': 'o',
  'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
  'ý': 'y', 'ÿ': 'y',
  'ñ': 'n', 'ç': 'c',
  
  // Indian language specific mappings
  'ॐ': 'om',
  '₹': 'rs',
  
  // Common substitutions
  'Ⓐ': 'a', 'Ⓑ': 'b', 'Ⓒ': 'c', 'Ⓓ': 'd', 'Ⓔ': 'e',
  'Ⓕ': 'f', 'Ⓖ': 'g', 'Ⓗ': 'h', 'Ⓘ': 'i', 'Ⓙ': 'j',
  'Ⓚ': 'k', 'Ⓛ': 'l', 'Ⓜ': 'm', 'Ⓝ': 'n', 'Ⓞ': 'o',
  'Ⓟ': 'p', 'Ⓠ': 'q', 'Ⓡ': 'r', 'Ⓢ': 's', 'Ⓣ': 't',
  'Ⓤ': 'u', 'Ⓥ': 'v', 'Ⓦ': 'w', 'Ⓧ': 'x', 'Ⓨ': 'y', 'Ⓩ': 'z'
};

// Emoji regex pattern
const EMOJI_REGEX = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/gu;

// Repeated character regex pattern
const REPEATED_CHARS_REGEX = /(.)\1{2,}/g;

// Obfuscation patterns
const OBFUSCATION_PATTERNS = {
  accentedChars: /[áàâäãåéèêëíìîïóòôöõøúùûüýÿñç]/g,
  emojis: EMOJI_REGEX,
  symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g,
  repeatedChars: REPEATED_CHARS_REGEX,
  mixedScript: /[a-zA-Z][\u0900-\u0DFF]|[\u0900-\u0DFF][a-zA-Z]/g
};

// Define a type for language patterns
interface LanguagePattern {
  pattern: RegExp;
  weight: number;
  name: string;
}

// Enhanced language patterns with better Unicode support
const LANGUAGE_PATTERNS: LanguagePattern[] = [
  {
    pattern: /[\u0000-\u007F]/g, // Basic Latin
    weight: 0.3,
    name: 'en'
  },
  {
    pattern: /[\u0900-\u097F]/g, // Devanagari (Hindi, Marathi, etc.)
    weight: 0.3,
    name: 'hi'
  },
  {
    pattern: /[\u0C80-\u0CFF]/g, // Kannada
    weight: 0.3,
    name: 'kn'
  },
  {
    pattern: /[\u0B80-\u0BFF]/g, // Tamil
    weight: 0.3,
    name: 'ta'
  },
  {
    pattern: /[\u0A80-\u0AFF]/g, // Gujarati
    weight: 0.3,
    name: 'gu'
  },
  {
    pattern: /[\u0980-\u09FF]/g, // Bengali
    weight: 0.3,
    name: 'bn'
  },
  {
    pattern: /[\u0D00-\u0D7F]/g, // Malayalam
    weight: 0.3,
    name: 'ml'
  },
  {
    pattern: /[\u0B00-\u0B7F]/g, // Telugu
    weight: 0.3,
    name: 'te'
  },
  {
    pattern: /[\u0A00-\u0A7F]/g, // Gurmukhi
    weight: 0.3,
    name: 'pa'
  }
];

export interface LanguageDetectionResult {
  languages: string[];
  confidence: Record<string, number>;
  obfuscationScore: number;
  obfuscationReasons: string[];
}

// Add the type guard at the top of the file, after the imports
function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Detects languages and obfuscation in text
 * @param text Input text to analyze
 * @returns Language detection results with confidence scores and obfuscation analysis
 */
export function analyzeText(text: string): LanguageDetectionResult {
  const result: LanguageDetectionResult = {
    languages: [],
    confidence: {},
    obfuscationScore: 0,
    obfuscationReasons: []
  };

  // Calculate total character count
  const totalChars = text.length;
  if (totalChars === 0) return result;

  // Detect languages and calculate confidence
  let totalWeightedCount = 0;
  const languageCounts: Record<string, number> = {};

  LANGUAGE_PATTERNS.forEach(pattern => {
    if (isRegExp(pattern.pattern)) {
      const matches = text.match(pattern.pattern) || [];
      const count = matches.length;
      if (count > 0) {
        languageCounts[pattern.name] = count * pattern.weight;
        totalWeightedCount += count * pattern.weight;
      }
    }
  });

  // Calculate confidence scores
  Object.entries(languageCounts).forEach(([lang, count]) => {
    result.confidence[lang] = count / totalWeightedCount;
    if (result.confidence[lang] > 0.1) { // Only include languages with >10% confidence
      result.languages.push(lang);
    }
  });

  // Sort languages by confidence
  result.languages.sort((a, b) => result.confidence[b] - result.confidence[a]);

  // Analyze obfuscation
  let obfuscationCount = 0;
  let obfuscationTotal = 0;

  // Check for accented characters
  const accentedMatches = text.match(OBFUSCATION_PATTERNS.accentedChars) || [];
  if (accentedMatches.length > 0) {
    obfuscationCount++;
    obfuscationTotal += accentedMatches.length / totalChars;
    result.obfuscationReasons.push(`Contains ${accentedMatches.length} accented characters`);
  }

  // Check for emojis
  const emojiMatches = text.match(OBFUSCATION_PATTERNS.emojis) || [];
  if (emojiMatches.length > 0) {
    obfuscationCount++;
    obfuscationTotal += emojiMatches.length / totalChars;
    result.obfuscationReasons.push(`Contains ${emojiMatches.length} emojis`);
  }

  // Check for excessive symbols
  const symbolMatches = text.match(OBFUSCATION_PATTERNS.symbols) || [];
  if (symbolMatches.length > totalChars * 0.1) { // More than 10% symbols
    obfuscationCount++;
    obfuscationTotal += symbolMatches.length / totalChars;
    result.obfuscationReasons.push(`Contains excessive symbols (${symbolMatches.length})`);
  }

  // Check for repeated characters
  const repeatedMatches = text.match(OBFUSCATION_PATTERNS.repeatedChars) || [];
  if (repeatedMatches.length > 0) {
    obfuscationCount++;
    obfuscationTotal += repeatedMatches.length / totalChars;
    result.obfuscationReasons.push(`Contains repeated character patterns`);
  }

  // Check for mixed script
  const mixedScriptMatches = text.match(OBFUSCATION_PATTERNS.mixedScript) || [];
  if (mixedScriptMatches.length > 0) {
    obfuscationCount++;
    obfuscationTotal += mixedScriptMatches.length / totalChars;
    result.obfuscationReasons.push(`Contains mixed script patterns`);
  }

  // Calculate final obfuscation score
  result.obfuscationScore = Math.min(1, (obfuscationTotal / obfuscationCount) || 0);

  return result;
}

/**
 * Normalizes text by:
 * 1. Converting to lowercase
 * 2. Removing emojis
 * 3. Normalizing Unicode characters
 * 4. Reducing repeated characters
 * @param text Input text to normalize
 * @returns Normalized text
 */
export const normalizeText = (text: string): string => {
  // Convert to lowercase
  let normalized = text.toLowerCase();
  
  // Normalize Unicode characters
  normalized = normalized.normalize('NFKC');
  
  // Remove diacritics and special characters
  normalized = normalized.replace(/[\u0300-\u036f]/g, '');
  
  // Replace common Unicode variations with standard characters
  Object.entries(UNICODE_MAPPINGS).forEach(([unicode, standard]) => {
    normalized = normalized.replace(new RegExp(unicode, 'g'), standard);
  });
  
  // Remove emojis
  normalized = normalized.replace(EMOJI_REGEX, '');
  
  // Remove repeated characters
  normalized = normalized.replace(REPEATED_CHARS_REGEX, '$1');
  
  return normalized;
};

/**
 * Detects the primary language of the text
 * @param text Input text to analyze
 * @returns ISO 639-3 language code
 */
export const detectLanguage = (text: string): string => {
  const scores: { [key: string]: number } = {};
  
  LANGUAGE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern.pattern) || [];
    scores[pattern.name] = (matches.length / text.length) * pattern.weight;
  });
  
  // Return the language with highest score, default to English if no clear match
  const detectedLanguage = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'en';
  
  return detectedLanguage;
};

/**
 * Checks if text contains mixed languages
 * @param text Input text to analyze
 * @returns Array of detected language codes
 */
export const detectMixedLanguages = (text: string): string[] => {
  const detectedLanguages = new Set<string>();
  
  LANGUAGE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern.pattern) || [];
    const score = (matches.length / text.length) * pattern.weight;
    
    // If the language score is above threshold, consider it present
    if (score > 0.1) {
      detectedLanguages.add(pattern.name);
    }
  });
  
  // Always include English if other languages are detected
  if (detectedLanguages.size > 0 && !detectedLanguages.has('en')) {
    detectedLanguages.add('en');
  }
  
  return Array.from(detectedLanguages);
};

/**
 * Extracts currency amounts from text
 * @param text Input text to analyze
 * @returns Array of detected currency amounts
 */
export function extractCurrencyAmounts(text: string): string[] {
  // Match various currency formats
  const currencyRegex = /(?:₹|rs|rupees?)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi;
  const matches = text.match(currencyRegex) || [];
  return matches;
}

/**
 * Checks if text contains suspicious patterns
 * @param text Input text to analyze
 * @returns Array of suspicious patterns found
 */
export function findSuspiciousPatterns(text: string): string[] {
  const patterns = [
    // URL patterns
    /(?:https?:\/\/|www\.)[^\s]+/gi,
    // Phone number patterns
    /(?:\+91|0)?[6-9]\d{9}/g,
    // Email patterns
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    // OTP patterns
    /\b\d{4,6}\b/g
  ];
  
  const matches: string[] = [];
  patterns.forEach(pattern => {
    const found = text.match(pattern) || [];
    matches.push(...found);
  });
  
  return matches;
} 