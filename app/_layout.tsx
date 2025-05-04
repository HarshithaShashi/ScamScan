import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      </ThemeProvider>
    </LanguageProvider>
  );
}
