import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function WelcomeScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.card, theme.shadows.heavy, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.logo, { color: theme.colors.text }]}>Pulse</Text>
        <Text style={[styles.tag, { color: theme.colors.muted }]}>Corra, evolua, conquiste.</Text>
        <Pressable onPress={() => nav.navigate('Login' as never)} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.btnText}>Começar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { padding: 24, borderRadius: 20, width: '100%', maxWidth: 420, alignItems: 'center' },
  logo: { fontSize: 42, fontWeight: '900', letterSpacing: 1 },
  tag: { marginTop: 8, fontSize: 16 },
  btn: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
