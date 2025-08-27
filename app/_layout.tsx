import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { useSegments, usePathname, useRouter } from 'expo-router';
import { recordScreenView } from '@/utils/navigationInsights';
import * as ExpoLinking from 'expo-linking';
import { handleIncomingUrl } from '@/utils/voiceCommands';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  useEffect(() => {
    const screenName = '/' + segments.join('/');
    recordScreenView(undefined, { screenName, timestamp: Date.now() }).catch(() => {});
  }, [segments, pathname]);

  useEffect(() => {
    // Inicial + listener para deep links (Siri/Assistant)
    ExpoLinking.getInitialURL().then((url) => handleIncomingUrl(url, router));
    const sub = ExpoLinking.addEventListener('url', ({ url }) => handleIncomingUrl(url, router));
    return () => sub.remove();
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
