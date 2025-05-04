import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Pressable, Platform } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
] as const;

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  const scale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleLanguageChange = async (newLanguage: string) => {
    if (isChanging) return;
    
    setIsChanging(true);
    try {
      await changeLanguage(newLanguage as 'en' | 'hi' | 'kn');
      onClose();
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View style={[
          styles.modalContent,
          { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.title,
              { color: isDarkMode ? Colors.dark.text : Colors.light.text }
            ]}>
              {t('selectLanguage')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={isDarkMode ? Colors.dark.text : Colors.light.text}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.languagesContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  currentLanguage === lang.code && styles.selectedLanguage,
                  { backgroundColor: isDarkMode ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary }
                ]}
                onPress={() => handleLanguageChange(lang.code)}
                disabled={isChanging}
              >
                <Text style={[
                  styles.languageText,
                  { color: isDarkMode ? Colors.dark.text : Colors.light.text }
                ]}>
                  {lang.flag} {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={Colors.light.tint}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languagesContainer: {
    gap: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
  },
  selectedLanguage: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  languageText: {
    fontSize: 16,
  },
});