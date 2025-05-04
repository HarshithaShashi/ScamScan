import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { Shield, History, Settings, Chrome as Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('@expo-google-fonts/roboto/Roboto_400Regular.ttf'),
    'Roboto-Medium': require('@expo-google-fonts/roboto/Roboto_500Medium.ttf'),
    'Roboto-Bold': require('@expo-google-fonts/roboto/Roboto_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const tabBarHeight = Platform.OS === 'ios' ? 90 : 70;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          height: tabBarHeight,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDarkMode ? 20 : 30}
            tint={isDarkMode ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ),
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: isDarkMode ? Colors.dark.text : Colors.light.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('scan'),
          tabBarIcon: ({ color, focused }) => (
            <Shield 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('history'),
          tabBarIcon: ({ color, focused }) => (
            <History 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, focused }) => (
            <Settings 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}