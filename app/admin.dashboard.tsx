import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGate } from '@/hooks/useGate';
import { track } from '@/utils/analyticsClient';

export default function AdminDashboardScreen() {
  const { isAdmin, open } = useGate() as any;
  const [query, setQuery] = React.useState('');
  const [users, setUsers] = React.useState<Array<{ id: string; name: string; email: string; roles: string[]; active: boolean }>>([
    { id: 'u1', name: 'João', email: 'joao@example.com', roles: ['user'], active: true },
    { id: 'u2', name: 'Ana', email: 'ana@example.com', roles: ['user','mentor'], active: true },
    { id: 'u3', name: 'Admin', email: 'admin@example.com', roles: ['admin'], active: true },
  ]);

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
        <ThemedText type="subtitle">Usuários</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Text>Buscar:</Text>
          <TextInput value={query} onChangeText={setQuery} placeholder="nome ou email" style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, flex: 1 }} />
        </View>
        {users.filter(u => (u.name + u.email).toLowerCase().includes(query.toLowerCase())).slice(0, 10).map((u) => (
          <View key={u.id} style={{ marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8 }}>
            <ThemedText>{u.name} • {u.email} • {u.roles.join(', ')}</ThemedText>
            <View style={styles.row}> 
              <Pressable onPress={async () => { setUsers(prev => prev.map(p => p.id === u.id ? { ...p, roles: Array.from(new Set([...p.roles, 'mentor'])) } : p)); await track('action_performed', { action_name: 'admin_promote_mentor', user_id: u.id }); }} style={styles.btn}><Text style={styles.btnText}>Promover Mentor</Text></Pressable>
              <Pressable onPress={async () => { setUsers(prev => prev.map(p => p.id === u.id ? { ...p, roles: p.roles.filter(r => r !== 'mentor') } : p)); await track('action_performed', { action_name: 'admin_revoke_mentor', user_id: u.id }); }} style={styles.btn}><Text style={styles.btnText}>Revogar Mentor</Text></Pressable>
              <Pressable onPress={async () => { setUsers(prev => prev.map(p => p.id === u.id ? { ...p, active: !p.active } : p)); await track('action_performed', { action_name: 'admin_toggle_active', user_id: u.id }); }} style={styles.btn}><Text style={styles.btnText}>{u.active ? 'Desativar' : 'Ativar'}</Text></Pressable>
            </View>
            <View style={styles.row}> 
              <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_reset_password', user_id: u.id }); }} style={styles.btn}><Text style={styles.btnText}>Resetar Senha</Text></Pressable>
              <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_export_user', user_id: u.id }); }} style={styles.btn}><Text style={styles.btnText}>Exportar Dados</Text></Pressable>
            </View>
          </View>
        ))}
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Eventos</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_create_event' }); }} style={styles.btn}><Text style={styles.btnText}>Criar Evento</Text></Pressable>
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_manage_events' }); }} style={styles.btn}><Text style={styles.btnText}>Gerenciar</Text></Pressable>
        </View>
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Assinaturas</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_subscriptions_overview' }); }} style={styles.btn}><Text style={styles.btnText}>Visão Geral</Text></Pressable>
          <Pressable onPress={async () => { await track('action_performed', { action_name: 'admin_subscriptions_adjust' }); }} style={styles.btn}><Text style={styles.btnText}>Ajustes</Text></Pressable>
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

