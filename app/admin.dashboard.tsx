import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGate } from '@/hooks/useGate';
import { track } from '@/utils/analyticsClient';

export default function AdminDashboardScreen() {
  const { isAdmin, open } = useGate() as any;

  if (!isAdmin) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
        <ThemedText>Somente administradores</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ThemedView style={styles.card}> 
        <ThemedText type="title">Painel Admin</ThemedText>
        <ThemedText>Gerencie finanças, dados e mentoria.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Financeiro</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_financial_report' }); }} style={styles.btn}><Text style={styles.btnText}>Relatórios</Text></Pressable>
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_payouts_sync' }); }} style={styles.btn}><Text style={styles.btnText}>Pagamentos</Text></Pressable>
        </View>
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Dados</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_export_all' }); }} style={styles.btn}><Text style={styles.btnText}>Exportar Tudo</Text></Pressable>
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_cleanup_old' }); }} style={styles.btn}><Text style={styles.btnText}>Limpeza</Text></Pressable>
        </View>
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Mentoria</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_mentor_approvals' }); }} style={styles.btn}><Text style={styles.btnText}>Aprovar Mentores</Text></Pressable>
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_assign_mentees' }); }} style={styles.btn}><Text style={styles.btnText}>Atribuir Alunos</Text></Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#111827' },
  btnText: { color: 'white', fontWeight: '800' },
});

