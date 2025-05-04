import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useLanguage, ScamDetectionKey } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Trash2, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { detectScam } from '@/utils/enhancedScamDetector';
import { ScamDetectionResult } from '@/types/scamTypes';
import Colors from '@/constants/Colors';
import AlertBanner from '@/components/AlertBanner';
import MessageCard from '@/components/MessageCard';
import { TTSButton } from '@/components/TTSButton';

export default function ScanScreen() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scamResult, setScamResult] = useState<ScamDetectionResult | null>(null);
  const [message, setMessage] = useState<string>('');
  const { isDarkMode } = useTheme();

  const handleScan = async () => {
    if (message.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await detectScam(message);
        setScamResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during scam detection');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClear = () => {
    setMessage('');
    setScamResult(null);
    setError(null);
  };

  const getThreatLevelColor = (level: 'very_high' | 'high' | 'medium' | 'low' | 'very_low') => {
    switch (level) {
      case 'very_high':
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.warning;
      case 'low':
      case 'very_low':
        return Colors.safe;
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <LinearGradient
          colors={isDarkMode ? [Colors.dark.gradient.primary[0], Colors.dark.gradient.primary[1]] : [Colors.light.gradient.primary[0], Colors.light.gradient.primary[1]]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>{t('scanMessage')}</Text>
        </LinearGradient>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('pasteMessageLabel')}
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
              color: isDarkMode ? Colors.dark.text : Colors.light.text,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}
            placeholder={t('messageInputPlaceholder')}
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.scanButton, isLoading && styles.disabledButton]}
              onPress={handleScan}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Shield size={20} color="#fff" />
                  <Text style={styles.buttonText}>{t('scanButton')}</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.clearButton, { 
                backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
                borderColor: isDarkMode ? Colors.dark.tint : Colors.light.tint,
              }]}
              onPress={handleClear}
            >
              <Trash2 size={20} color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
              <Text style={[styles.buttonText, styles.clearButtonText, { color: isDarkMode ? Colors.dark.tint : Colors.light.tint }]}>
                {t('clearButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}>
            <AlertCircle size={24} color={Colors.danger} />
            <Text style={[styles.errorText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
              {error}
            </Text>
          </View>
        )}

        {scamResult && (
          <View style={styles.resultContainer}>
            <View style={[styles.threatLevel, { backgroundColor: getThreatLevelColor(scamResult.riskLevel) }]}>
              <Text style={styles.threatLevelText}>
                {t(`scamDetection.${scamResult.riskLevel}.title` as ScamDetectionKey)}
              </Text>
            </View>
            
            <View style={styles.warningContainer}>
              {scamResult.keyIndicators.map((indicator: { matchedText: string }, index: number) => (
                <View key={index} style={styles.warningItem}>
                  <Ionicons name="warning" size={20} color={Colors.warning} />
                  <Text style={styles.warningText}>{indicator.matchedText}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailsContainer}>
              <AlertBanner 
                threatLevel={scamResult.riskLevel} 
                detectionMethod={scamResult.used}
              />
            
              <Text style={[styles.resultTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                {t('scanResultTitle')}
              </Text>
            
              <View style={[styles.messageCard, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}>
                <MessageCard 
                  message={message} 
                  highlightedTerms={scamResult.keyIndicators.map((i: { matchedText: string }) => i.matchedText)}
                />
              </View>

              {scamResult.confidence !== null && (
                <View style={[styles.confidenceContainer, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}>
                  <Text style={[styles.confidenceTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                    {t('scamDetection.low.title' as ScamDetectionKey)}
                  </Text>
                  <Text style={[styles.confidenceValue, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                    {Math.round(scamResult.confidence * 100)}%
                  </Text>
                </View>
              )}
              
              <View style={[styles.explanationContainer, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}>
                <Text style={[styles.explanationTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                  {t('explanationTitle')}
                </Text>
                <Text style={[styles.explanationText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                  {scamResult.explanation}
                </Text>
                <TTSButton text={scamResult.explanation} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 110 : 90,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Roboto-Regular',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  scanButton: {
    backgroundColor: Colors.light.tint,
  },
  clearButton: {
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  clearButtonText: {
    color: Colors.light.tint,
  },
  resultContainer: {
    padding: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
  },
  messageCard: {
    borderRadius: 12,
    marginBottom: 16,
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
  confidenceContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  confidenceTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  explanationContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Roboto-Bold',
  },
  explanationText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 12,
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
  errorText: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    fontFamily: 'Roboto-Regular',
  },
  threatLevel: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  threatLevelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningContainer: {
    marginBottom: 16,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  detailsContainer: {
    padding: 20,
  },
});