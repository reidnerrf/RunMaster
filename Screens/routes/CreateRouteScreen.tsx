import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { addRoute } from '../../Lib/routeStore';
import { useNavigation } from '@react-navigation/native';

export default function CreateRouteScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const [name, setName] = useState<string>('Nova Rota');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return; setSaving(true);
    await addRoute({ name, distance_km: Number((3 + Math.random() * 5).toFixed(2)), notes: 'Criada manualmente' });
    (nav as any).goBack();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <View style={[styles.mapMock, { backgroundColor: theme.colors.card }]}> 
        <Text style={{ color: '#fff' }}>Editor de rota (mock)</Text>
      </View>
      <Text style={{ color: theme.colors.muted, marginVertical: 8 }}>Toque no mapa para criar pontos da rota (mock)</Text>
      <Pressable onPress={save} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.btnText}>{saving ? 'Salvando...' : 'Salvar rota'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mapMock: { height: 320, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '800' },
});