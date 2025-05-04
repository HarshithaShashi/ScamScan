import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useLanguage } from '@/contexts/LanguageContext';
import { Platform } from 'react-native';

const languageToVoice = {
  en: 'en-US', // English (United States)
  hi: 'hi-IN', // Hindi (India)
  kn: 'kn', // Kannada (using base language code)
};

// Web browser compatibility check
const isWebSpeechSupported = () => {
  if (Platform.OS !== 'web') return true; // Always true for mobile
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (!isWebSpeechSupported()) {
        setError('Text-to-speech is not supported in this browser. Please try Chrome, Firefox, or use the mobile app.');
        return;
      }
      // Load available voices for web
      const loadWebVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          setTimeout(() => {
            const delayedVoices = window.speechSynthesis.getVoices();
            if (delayedVoices.length === 0) {
              setError('No voices available. Please check your system settings or try a different browser.');
            }
          }, 1000);
        }
      };
      loadWebVoices();
      window.speechSynthesis.onvoiceschanged = loadWebVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }

    // Mobile implementation
    const loadVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        setAvailableVoices(voices);
      } catch (error) {
        console.error('Error loading voices:', error);
        setError('Failed to load voices. Please check your device settings.');
      }
    };
    loadVoices();

    return () => {
      if (isSpeaking) {
        if (Platform.OS === 'web') {
          window.speechSynthesis.cancel();
        } else {
          Speech.stop();
        }
        setIsSpeaking(false);
        setIsLoading(false);
      }
    };
  }, []);

  const speak = async (text: string) => {
    if (!text.trim()) {
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      
      // Stop any ongoing speech
      if (isSpeaking) {
        if (Platform.OS === 'web') {
          window.speechSynthesis.cancel();
        } else {
          await Speech.stop();
        }
        setIsSpeaking(false);
      }

      // Add a small delay to ensure the previous speech is fully cancelled
      await new Promise(resolve => setTimeout(resolve, 100));

      if (Platform.OS === 'web') {
        if (!isWebSpeechSupported()) {
          setError('Text-to-speech is not supported in this browser. Please try Chrome, Firefox, or use the mobile app.');
          setIsLoading(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const targetLang = languageToVoice[currentLanguage];
        
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(voice => 
          voice.lang === targetLang || 
          voice.lang.startsWith(targetLang.split('-')[0])
        );

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        } else {
          utterance.lang = targetLang;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsLoading(false);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsLoading(false);
        };

        utterance.onerror = () => {
          setError('Failed to speak text. Please check your system settings or try a different browser.');
          setIsSpeaking(false);
          setIsLoading(false);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Mobile implementation
        const targetVoice = languageToVoice[currentLanguage];
        const availableVoice = availableVoices.find(
          voice => voice.language === targetVoice || voice.language.startsWith(targetVoice.split('-')[0])
        );

        const maxChunkLength = 1000;
        const chunks = text.match(new RegExp(`.{1,${maxChunkLength}}`, 'g')) || [text];

        for (const chunk of chunks) {
          await new Promise<void>((resolve, reject) => {
            Speech.speak(chunk, {
              language: targetVoice,
              voice: availableVoice?.identifier,
              pitch: 1.0,
              rate: 0.9,
              onStart: () => {
                setIsSpeaking(true);
                setIsLoading(false);
              },
              onDone: () => {
                setIsSpeaking(false);
                setIsLoading(false);
                resolve();
              },
              onError: (error) => {
                setError('Failed to speak text. Please check your device settings.');
                setIsSpeaking(false);
                setIsLoading(false);
                reject(error);
              },
            });
          });
        }
      }
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setError('An unexpected error occurred. Please try again or use a different browser.');
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  const stop = async () => {
    try {
      if (Platform.OS === 'web') {
        window.speechSynthesis.cancel();
      } else {
        await Speech.stop();
      }
      setIsSpeaking(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
      setError('Failed to stop speech. Please try again.');
    }
  };

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
} 