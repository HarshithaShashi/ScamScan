import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { Globe, Volume2, Bell, Moon, Shield, Info, ChevronRight, LucideIcon, Sun } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] = useState(false);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    value, 
    onValueChange,
    showChevron = false 
  }: {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem,
        { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
          <View style={styles.settingInfo}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isDarkMode ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary }
        ]}>
          <Icon size={20} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtext, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
          </View>
      {onValueChange ? (
          <Switch
          value={value}
          onValueChange={onValueChange}
            trackColor={{ false: '#d1d1d1', true: Colors.light.tint + '80' }}
          thumbColor={value ? Colors.light.tint : '#f4f4f4'}
            ios_backgroundColor="#d1d1d1"
          />
      ) : showChevron && (
        <ChevronRight size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
      )}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>{t('settings')}</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('appearance')}
          </Text>
          
          <TouchableOpacity
            style={[styles.option, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}
            onPress={toggleTheme}
          >
            <View style={styles.optionContent}>
              {isDarkMode ? (
                <Moon size={24} color={Colors.dark.text} />
              ) : (
                <Sun size={24} color={Colors.light.text} />
              )}
              <Text style={[styles.optionText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                {t('theme')}
              </Text>
            </View>
            <Text style={[styles.optionValue, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              {isDarkMode ? t('dark') : t('light')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('language')}
          </Text>

        <TouchableOpacity 
            style={[styles.option, { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card }]}
            onPress={() => setIsLanguageSelectorVisible(true)}
        >
            <View style={styles.optionContent}>
              <Globe size={24} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
              <Text style={[styles.optionText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                {t('language')}
              </Text>
            </View>
            <Text style={[styles.optionValue, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              {t(currentLanguage)}
            </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('notificationSettings')}
          </Text>
        
          <SettingItem
            icon={Bell}
            title={t('notificationsEnabled')}
            value={notifications}
            onValueChange={setNotifications}
          />
          
          <SettingItem
            icon={Volume2}
            title={t('audioAlerts')}
            value={audioEnabled}
            onValueChange={setAudioEnabled}
          />
      </View>

      <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {t('about')}
          </Text>
          
          <SettingItem
            icon={Shield}
            title={t('privacyPolicy')}
            onPress={() => {}}
            showChevron
          />
        
          <SettingItem
            icon={Info}
            title={t('about')}
            onPress={() => {}}
            showChevron
          />
        
        <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            {t('version')} 1.0.0
          </Text>
        </View>
      </View>

        <LanguageSelector
          visible={isLanguageSelectorVisible}
          onClose={() => setIsLanguageSelectorVisible(false)}
        />
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
    padding: 20,
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
    marginBottom: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Roboto-Regular',
  },
  optionValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});