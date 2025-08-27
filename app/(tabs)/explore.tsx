import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { View, Switch, Pressable } from 'react-native';
import { getCurrentWeather } from '@/utils/weatherService';
import { scoreRoutesOnnx } from '@/utils/routeOnnx';
import { track } from '@/utils/analyticsClient';
import { useGate } from '@/hooks/useGate';

export default function TabTwoScreen() {
  const { isPremium, open } = useGate();
  const [weather, setWeather] = React.useState<{ temp?: number; desc?: string } | null>(null);
  const [bestRouteLabel, setBestRouteLabel] = React.useState<string | null>(null);
  const [preferCool, setPreferCool] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      const w = await getCurrentWeather(-23.55, -46.63);
      if (w?.current) setWeather({ temp: w.current.temperature, desc: w.current.description });
      const ids = ['park', 'trail', 'city'];
      const feats = [
        { elevationGainM: 20, distanceKm: 5.0, surfaceTrail: 0.2 },
        { elevationGainM: 120, distanceKm: 7.0, surfaceTrail: 0.7 },
        { elevationGainM: 5, distanceKm: 4.5, surfaceTrail: 0.0 },
      ];
      const scores = await scoreRoutesOnnx(ids, feats as any);
      if (scores) {
        const maxIdx = scores.indexOf(Math.max(...scores));
        const label = maxIdx === 1 ? 'Trilha fresca' : maxIdx === 2 ? 'Urbana plana' : 'Parque equilibrado';
        setBestRouteLabel(label);
        await track('ml_suggestion_shown', { type: 'best_route_now', score: scores[maxIdx] });
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      // re-score with preference: if preferCool, bias trail/park in hot conditions
      if (!weather) return;
      const hot = (weather.temp ?? 0) >= 26;
      const ids = ['park', 'trail', 'city'];
      const feats = [
        { elevationGainM: 20, distanceKm: 5.0, surfaceTrail: 0.2 },
        { elevationGainM: 120, distanceKm: 7.0, surfaceTrail: 0.7 },
        { elevationGainM: 5, distanceKm: 4.5, surfaceTrail: 0.0 },
      ];
      const scores = await scoreRoutesOnnx(ids, feats as any);
      if (!scores) return;
      const bias = preferCool && hot ? [0.05, 0.1, -0.05] : [0,0,0];
      const adjusted = scores.map((s, i) => (s ?? 0) + bias[i]);
      const maxIdx = adjusted.indexOf(Math.max(...adjusted));
      const label = maxIdx === 1 ? 'Trilha fresca' : maxIdx === 2 ? 'Urbana plana' : 'Parque equilibrado';
      setBestRouteLabel(label);
    })();
  }, [preferCool, weather]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      {weather && (
        <ThemedView style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginBottom: 12 }}> 
          <ThemedText type="subtitle">Clima agora</ThemedText>
          <ThemedText>{Math.round(weather.temp!)}°C • {weather.desc}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <ThemedText>Preferir rotas frescas/sombreadas</ThemedText>
            <Switch value={preferCool} onValueChange={async (v) => { setPreferCool(v); await track('action_performed', { action_name: 'prefer_cool_routes_toggle', context: v ? 'on' : 'off' }); }} />
          </View>
          {bestRouteLabel && (
            <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ThemedText>Melhor rota agora: {bestRouteLabel}</ThemedText>
              <Pressable onPress={async () => { if (!isPremium) { open('explore_best_route'); return; } await track('ml_suggestion_accepted', { type: 'best_route_now' }); }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: isPremium ? '#6C63FF' : '#9CA3AF' }}> 
                <ThemedText style={{ color: 'white' }}>{isPremium ? 'Aceitar' : 'Premium'}</ThemedText>
              </Pressable>
            </View>
          )}
        </ThemedView>
      )}
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
