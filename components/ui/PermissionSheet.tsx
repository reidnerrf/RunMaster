import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Sheet from './Sheet';
import { useTheme } from '../../hooks/useTheme';
import * as Linking from 'expo-linking';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function PermissionSheet({ visible, onClose }: Props) {
  const { theme } = useTheme();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Permissões</Text>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 12 }}>Gerencie localização, notificações e saúde.</Text>
      <Pressable onPress={() => Linking.openSettings()} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.btnText}>Abrir Configurações</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '800', fontSize: 16, marginBottom: 8 },
  btn: { borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '800' },
});

