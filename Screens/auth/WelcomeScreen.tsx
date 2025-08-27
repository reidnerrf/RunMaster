import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Activity, Zap } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { funnelStep } from '../../Lib/analytics';

export default function WelcomeScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();

  React.useEffect(() => { funnelStep('onboarding_view'); }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}> 
      <View style={styles.centered}> 
        <View style={[styles.logoWrap, { backgroundColor: '#ffffff33' }]}> 
          <Activity size={48} color={'#fff'} />
        </View>
        <View style={styles.zap}>
          <Zap size={14} color={'#fff'} />
        </View>
        <View style={{ height: 16 }} />
        <Text style={styles.brand}>RunTracker</Text>
        <Text style={styles.subtitle}>Track Every Step, Achieve Every Goal</Text>
        <View style={{ height: 24 }} />
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
        </View>
        <View style={{ height: 24 }} />
        <Pressable onPress={() => { funnelStep('onboarding_cta'); nav.navigate('Login' as never); }} style={[styles.btn, { backgroundColor: '#ffffff22', borderColor: '#ffffff55' }]}> 
          <Text style={styles.btnText}>Começar</Text>
        </Pressable>
        <View style={{ height: 16 }} />
        <Text style={styles.perms}>Verificando permissões: GPS • Notificações • HealthKit</Text>
      </View>
      <View style={[styles.blob, { top: 80, left: 40 }]} />
      <View style={[styles.blob, { bottom: 120, right: 40, width: 96, height: 96 }]} />
      <View style={[styles.blob, { top: '50%', left: '25%', width: 64, height: 64 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, position: 'relative' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  zap: { position: 'absolute', top: '34%', right: '40%', width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff33', alignItems: 'center', justifyContent: 'center' },
  brand: { color: '#fff', fontSize: 36, fontWeight: '800' },
  subtitle: { color: '#ffffffcc', marginTop: 4 },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ffffffaa' },
  btn: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  perms: { color: '#ffffffcc', fontSize: 12 },
  blob: { position: 'absolute', width: 128, height: 128, borderRadius: 64, backgroundColor: '#ffffff22', filter: 'blur(20px)' as any },
});
