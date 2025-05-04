import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScamHistory } from '@/hooks/useScamHistory';
import { Shield } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HistoryScreen() {
  const { t } = useLanguage();
  const { history } = useScamHistory();
  const { isDarkMode } = useTheme();
    
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
          <Text style={styles.headerTitle}>{t('scamHistory')}</Text>
        </LinearGradient>

        {history.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}>
            <Shield size={48} color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
            <Text style={[styles.emptyText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
              {t('noHistoryTitle')}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {history.map((item, index) => (
              <View 
                key={index} 
                style={[styles.historyCard, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.dateText, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                  <View style={[styles.threatLevel, { backgroundColor: item.threatLevel === 'high' ? Colors.danger : item.threatLevel === 'medium' ? Colors.warning : Colors.safe }]}>
                    <Text style={styles.threatLevelText}>
                      {item.threatLevel === 'high' ? t('high') : item.threatLevel === 'medium' ? t('medium') : t('low')}
                    </Text>
                  </View>
        </View>
                <Text style={[styles.messageText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
          {item.message}
        </Text>
                <Text style={[styles.explanationText, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                  {t(`scamDetection.${item.threatLevel}.description`)}
                </Text>
              </View>
            ))}
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
  emptyContainer: {
    margin: 20,
    padding: 24,
    borderRadius: 12,
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
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  listContainer: {
    padding: 20,
  },
  historyCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  threatLevel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  threatLevelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Roboto-Regular',
  },
});