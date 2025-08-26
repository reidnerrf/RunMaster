import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Text style={[styles.brand, { color: theme.colors.text }]}>Trekio</Text>
        <Text style={{ color: theme.colors.muted }}>Entrar para continuar</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
        <TextInput placeholder="E-mail" placeholderTextColor={theme.colors.muted} autoCapitalize="none" value={email} onChangeText={setEmail} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />
        <TextInput placeholder="Senha" placeholderTextColor={theme.colors.muted} secureTextEntry value={password} onChangeText={setPassword} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />

        <Pressable onPress={() => login(email, password)} style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.primaryText}>Entrar</Text>
        </Pressable>

        <Text style={{ textAlign: 'center', color: theme.colors.muted, marginVertical: 10 }}>ou continue com</Text>

        <View style={styles.row}> 
          <Pressable onPress={() => socialLogin('google')} style={[styles.socialBtn, { backgroundColor: '#DB4437' }]}><Text style={styles.socialText}>Google</Text></Pressable>
          <Pressable onPress={() => socialLogin('apple')} style={[styles.socialBtn, { backgroundColor: '#000000' }]}><Text style={styles.socialText}>Apple</Text></Pressable>
          <Pressable onPress={() => socialLogin('facebook')} style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}><Text style={styles.socialText}>Facebook</Text></Pressable>
        </View>
      </View>

      <Pressable onPress={() => nav.navigate('Signup' as never)}><Text style={{ textAlign: 'center', color: theme.colors.text, marginTop: 14 }}>Criar nova conta</Text></Pressable>
      <Pressable onPress={() => {}}><Text style={{ textAlign: 'center', marginTop: 6, color: theme.colors.muted }}>Esqueci a senha</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  brand: { fontSize: 28, fontWeight: '900' },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, borderWidth: 1 },
  primaryBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  primaryText: { color: 'white', fontWeight: '800', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  socialBtn: { flex: 1, marginHorizontal: 4, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  socialText: { color: 'white', fontWeight: '700' },
});