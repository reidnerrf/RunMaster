import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

export default function SignupScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();
  const { signup, socialLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);

  const canSubmit = name && email && password && password === confirm && accepted;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.card, theme.shadows.heavy, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>Criar conta</Text>
        <TextInput placeholder="Nome" placeholderTextColor={theme.colors.muted} value={name} onChangeText={setName} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />
        <TextInput placeholder="E-mail" placeholderTextColor={theme.colors.muted} autoCapitalize="none" value={email} onChangeText={setEmail} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />
        <TextInput placeholder="Senha" placeholderTextColor={theme.colors.muted} secureTextEntry value={password} onChangeText={setPassword} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />
        <TextInput placeholder="Confirmar senha" placeholderTextColor={theme.colors.muted} secureTextEntry value={confirm} onChangeText={setConfirm} style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]} />

        <Pressable onPress={() => setAccepted(!accepted)} style={styles.checkboxRow}>
          <View style={[styles.checkbox, { backgroundColor: accepted ? theme.colors.primary : theme.colors.background, borderColor: theme.colors.border }]} />
          <Text style={{ flex: 1, color: theme.colors.text }}>Aceito termos e política</Text>
        </Pressable>

        <Pressable disabled={!canSubmit} onPress={() => signup(name, email, password)} style={[styles.btn, { backgroundColor: canSubmit ? theme.colors.primary : '#ccc' }]}>
          <Text style={styles.btnText}>Cadastrar-se</Text>
        </Pressable>

        <View style={styles.row}> 
          <Pressable onPress={() => socialLogin('google')} style={[styles.socialBtn, { backgroundColor: '#DB4437' }]}><Text style={styles.socialText}>Google</Text></Pressable>
          <Pressable onPress={() => socialLogin('apple')} style={[styles.socialBtn, { backgroundColor: '#000000' }]}><Text style={styles.socialText}>Apple</Text></Pressable>
          <Pressable onPress={() => socialLogin('facebook')} style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}><Text style={styles.socialText}>Facebook</Text></Pressable>
        </View>

        <Pressable onPress={() => nav.navigate('Login' as never)}><Text style={{ textAlign: 'center', marginTop: 10, color: theme.colors.text }}>Já tenho conta</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { borderRadius: 20, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, borderWidth: 1 },
  btn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: 'white', fontWeight: '800', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  socialBtn: { flex: 1, marginHorizontal: 4, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  socialText: { color: 'white', fontWeight: '700' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1 },
});