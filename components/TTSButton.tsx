import React from 'react';
import { TouchableOpacity, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Volume2, VolumeX } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface TTSButtonProps {
  text: string;
}

export function TTSButton({ text }: TTSButtonProps) {
  const { speak, stop, isSpeaking, isLoading } = useTextToSpeech();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const handlePlay = async () => {
    if (!isSpeaking) {
      await speak(text);
    }
  };

  const handleStop = async () => {
    if (isSpeaking) {
      await stop();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
    <TouchableOpacity 
      style={[
            styles.button,
            { 
              backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
              opacity: isLoading ? 0.5 : 1
            }
      ]}
          onPress={handlePlay}
          disabled={isLoading || isSpeaking}
    >
      {isLoading ? (
            <ActivityIndicator color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
      ) : (
            <Volume2 size={24} color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
      )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { 
              backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
              opacity: !isSpeaking ? 0.5 : 1
            }
          ]}
          onPress={handleStop}
          disabled={!isSpeaking}
        >
          <VolumeX size={24} color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
    </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});