import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { funnelStep, track } from '../../Lib/analytics';

export default function LoginScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async () => {
    funnelStep('login_attempt');
    await login(email, password);
    funnelStep('login_success');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.card, theme.shadows.heavy, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>Entrar</Text>
        <TextInput placeholder="E-mail" placeholderTextColor={theme.colors.muted} autoCapitalize="none" value={email} onChangeText={setEmail} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />
        <TextInput placeholder="Senha" placeholderTextColor={theme.colors.muted} secureTextEntry value={password} onChangeText={setPassword} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />

        <Pressable onPress={doLogin} style={[styles.btn, { backgroundColor: theme.colors.primary }]}> 
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        <View style={styles.row}> 
          <Pressable onPress={() => { track('social_login', { provider: 'google' }); socialLogin('google'); }} style={[styles.socialBtn, { backgroundColor: '#DB4437' }]}><Text style={styles.socialText}>Google</Text></Pressable>
          <Pressable onPress={() => { track('social_login', { provider: 'apple' }); socialLogin('apple'); }} style={[styles.socialBtn, { backgroundColor: '#000000' }]}><Text style={styles.socialText}>Apple</Text></Pressable>
          <Pressable onPress={() => { track('social_login', { provider: 'facebook' }); socialLogin('facebook'); }} style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}><Text style={styles.socialText}>Facebook</Text></Pressable>
        </View>

        <Pressable onPress={() => nav.navigate('Signup' as never)}><Text style={{ textAlign: 'center', color: theme.colors.text, marginTop: 10 }}>Cadastrar-se</Text></Pressable>
        <Pressable onPress={() => {}}><Text style={{ textAlign: 'center', marginTop: 6, color: theme.colors.muted }}>Esqueci a senha</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { borderRadius: 20, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, borderWidth: 1 },
  btn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: 'white', fontWeight: '800', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  socialBtn: { flex: 1, marginHorizontal: 4, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  socialText: { color: 'white', fontWeight: '700' },
});