import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslation() {
  const { t, currentLanguage, changeLanguage } = useLanguage();

  return {
    t,
    changeLanguage,
    currentLanguage,
    isLoaded: true, // Since LanguageContext handles loading
  };
}