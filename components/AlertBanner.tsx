import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/Colors';
import { Shield, AlertTriangle, CheckCircle2, Bot } from 'lucide-react-native';

interface AlertBannerProps {
  threatLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  detectionMethod: 'rule-engine' | 'llm-fallback' | 'llm-fallback-error';
}

const AlertBanner: React.FC<AlertBannerProps> = ({ threatLevel, detectionMethod }) => {
  const { t } = useLanguage();
  
  const getBannerStyle = () => {
    switch (threatLevel) {
      case 'very_high':
      case 'high':
        return styles.dangerBanner;
      case 'medium':
        return styles.warningBanner;
      default:
        return styles.safeBanner;
    }
  };

  const getBannerTitle = () => {
    const titleKey = `scamDetection.${threatLevel}.title` as const;
    return t(titleKey);
  };

  const getDetectionMethodIcon = () => {
    switch (detectionMethod) {
      case 'llm-fallback':
        return <Bot size={16} color="#fff" style={styles.methodIcon} />;
      case 'llm-fallback-error':
        return <AlertTriangle size={16} color="#fff" style={styles.methodIcon} />;
      default:
        return <Shield size={16} color="#fff" style={styles.methodIcon} />;
    }
  };

  const getDetectionMethodText = () => {
    switch (detectionMethod) {
      case 'llm-fallback':
        return 'Verified by AI';
      case 'llm-fallback-error':
        return 'Offline scan';
      default:
        return 'Fast scan';
    }
  };
  
  return (
    <View style={[styles.banner, getBannerStyle()]}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{getBannerTitle()}</Text>
        <View style={styles.detectionMethod}>
          {getDetectionMethodIcon()}
          <Text style={styles.detectionMethodText}>{getDetectionMethodText()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeBanner: {
    backgroundColor: Colors.safe,
  },
  warningBanner: {
    backgroundColor: Colors.warning,
  },
  dangerBanner: {
    backgroundColor: Colors.danger,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    fontFamily: 'Roboto-Bold',
  },
  detectionMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  methodIcon: {
    marginRight: 4,
  },
  detectionMethodText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
});

export default AlertBanner;