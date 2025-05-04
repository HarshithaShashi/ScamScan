import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from '@/locales/en';
import { hi } from '@/locales/hi';
import { kn } from '@/locales/kn';

// Define available translations
const translations = {
  en,
  hi,
  kn,
};

type Language = 'en' | 'hi' | 'kn';

export type ScamDetectionKey = 
  | 'scamDetection.very_low.title'
  | 'scamDetection.very_low.description'
  | 'scamDetection.low.title'
  | 'scamDetection.low.description'
  | 'scamDetection.medium.title'
  | 'scamDetection.medium.description'
  | 'scamDetection.high.title'
  | 'scamDetection.high.description'
  | 'scamDetection.very_high.title'
  | 'scamDetection.very_high.description'
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

type TranslationKey = keyof typeof en | ScamDetectionKey;

interface ScamDetectionTranslation {
  low: {
    title: string;
    description: string;
  };
  medium: {
    title: string;
    description: string;
  };
  high: {
    title: string;
    description: string;
  };
  indicators: {
    bankingInfo: string;
    kycUpdate: string;
    prizes: string;
    governmentImpersonation: string;
    jobOffers: string;
    investment: string;
    techSupport: string;
    personalInfo: string;
    suspiciousUrls: string;
    urgency: string;
    noIndicators: string;
  };
}

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language preference
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi' || savedLanguage === 'kn')) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedLanguage();
  }, []);

  const changeLanguage = async (lang: Language) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('language', lang);
      setCurrentLanguage(lang);
      // Force a re-render of the app
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error saving language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: TranslationKey): string => {
    const translation = translations[currentLanguage];
    if (!translation) return key;
    
    // Handle nested keys for scam detection
    if (key.startsWith('scamDetection.')) {
      const parts = key.split('.');
      let value: any = translation;
      for (const part of parts) {
        if (typeof value !== 'object' || value === null) return key;
        value = value[part];
        if (value === undefined) return key;
      }
      if (typeof value === 'string') {
        return value;
      }
      return key;
    }
    
    const value = translation[key as keyof typeof translation];
    return typeof value === 'string' ? value : key;
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 