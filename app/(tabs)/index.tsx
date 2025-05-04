import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Shield, TriangleAlert as AlertTriangle, ArrowRight, Info } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';
import { ScamTip } from '@/components/ScamTip';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const tips = [
    {
      id: 1,
      title: t('urgencyTitle'),
      description: t('urgencyDesc'),
      icon: Shield,
    },
    {
      id: 2,
      title: t('personalInfoTitle'),
      description: t('personalInfoDesc'),
      icon: AlertTriangle,
    },
    {
      id: 3,
      title: t('strangeLinksTitle'),
      description: t('strangeLinksDesc'),
      icon: Info,
    },
  ];

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
        <View style={styles.logoContainer}>
            <Shield size={60} color="#fff" style={styles.logoIcon} />
          <Text style={styles.logoText}>ScamScanner</Text>
        </View>
        <Text style={styles.welcomeText}>{t('welcomeMessage')}</Text>
        
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push('/(tabs)/scan')}
        >
          <Text style={styles.scanButtonText}>{t('scanNewMessage')}</Text>
          <ArrowRight size={24} color="#fff" />
        </TouchableOpacity>
        </LinearGradient>
      
      <View style={styles.tipsContainer}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('scamTips')}
          </Text>
          
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <View 
                key={tip.id} 
                style={[
                  styles.tipCard,
                  { 
                    backgroundColor: isDarkMode ? '#1e1e1e' : Colors.light.card,
                    borderColor: isDarkMode ? '#333' : Colors.light.border,
                  }
                ]}
              >
                <View style={styles.iconContainer}>
                  <Icon size={24} color={isDarkMode ? '#00bcd4' : Colors.light.tint} />
                </View>
                <Text style={[styles.tipTitle, { color: isDarkMode ? '#e0e0e0' : Colors.light.text }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipDescription, { color: isDarkMode ? '#ffffff' : Colors.light.textSecondary }]}>
                  {tip.description}
                </Text>
              </View>
            );
          })}
      </View>
      
      <View style={styles.recentActivityContainer}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('recentActivity')}
          </Text>
        <TouchableOpacity 
            style={[styles.activityButton, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}
          onPress={() => router.push('/(tabs)/history')}
        >
            <Text style={[styles.activityButtonText, { color: isDarkMode ? Colors.dark.text : Colors.light.tint }]}>
              {t('viewHistory')}
            </Text>
            <ArrowRight size={20} color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
        </TouchableOpacity>
      </View>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
  },
  scanButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    marginTop: 8,
  },
  scanButtonText: {
    color: Colors.light.tint,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Roboto-Bold',
  },
  tipsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Roboto-Bold',
  },
  tipDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
  },
  recentActivityContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  activityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
});