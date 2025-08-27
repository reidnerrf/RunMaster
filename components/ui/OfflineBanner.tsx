import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function OfflineBanner() {
  const { theme } = useTheme();
  const [offline, setOffline] = React.useState(false);
  React.useEffect(() => {
    const sub = NetInfo.addEventListener((s) => setOffline(!(s.isConnected && s.isInternetReachable)));
    NetInfo.fetch().then((s) => setOffline(!(s.isConnected && s.isInternetReachable)));
    return () => sub && sub();
  }, []);
  if (!offline) return null;
  return (
    <View style={[styles.base, { backgroundColor: '#FEE2E2', borderColor: theme.colors.border }]}> 
      <Text style={styles.text}>Você está offline. Algumas funções podem não funcionar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { position: 'absolute', top: 0, left: 0, right: 0, padding: 8, borderBottomWidth: 1, alignItems: 'center', zIndex: 100 },
  text: { color: '#991B1B', fontWeight: '700' },
});

