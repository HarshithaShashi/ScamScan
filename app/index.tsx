import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // Hide splash screen after a delay
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, []);

  // Redirect to the tabs layout
  return <Redirect href="/(tabs)" />;
}