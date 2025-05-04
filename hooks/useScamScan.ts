import { useState } from 'react';
import { useScamHistory } from './useScamHistory';
import { detectScam } from '@/utils/scamDetector';
import { ScamResult } from '@/types/scamTypes';
import { useLanguage } from '@/contexts/LanguageContext';

export function useScamScan() {
  const [scamResult, setScamResult] = useState<ScamResult | null>(null);
  const { addToHistory } = useScamHistory();
  const { t } = useLanguage();

  const scanMessage = (message: string) => {
    // Analyze message for scam indicators
    const result = detectScam(message, t);
    
    // Set result
    setScamResult(result);
    
    // Add to history
    addToHistory({
      id: Date.now().toString(),
      message,
      threatLevel: result.threatLevel,
      timestamp: new Date().toISOString(),
      matchedTerms: result.matchedTerms,
    });
  };

  const resetScan = () => {
    setScamResult(null);
  };

  return {
    scanMessage,
    scamResult,
    resetScan,
  };
}