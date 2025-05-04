import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Clear speech when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        Speech.stop();
      }
    };
  }, [isSpeaking]);

  // Map language codes to voice options
  const getVoiceOptions = (languageCode: string) => {
    switch (languageCode) {
      case 'hi':
        return { language: 'hi-IN' };
      case 'kn':
        return { language: 'kn-IN' };
      default: // English
        return { language: 'en-IN' };
    }
  };

  const speak = async (text: string, languageCode: string = 'en') => {
    if (isSpeaking) {
      await stop();
    }

    const options = getVoiceOptions(languageCode);
    
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        ...options,
        rate: 0.8, // Slightly slower for better comprehension
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const stop = async () => {
    await Speech.stop();
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
  };
}