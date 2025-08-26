import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { getTheme } from '../Lib/theme';
import { useFlags } from '../hooks/useGate';
import { useAuth } from '../hooks/useAuth';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type ConfettiPiece = { left: number; delay: number; color: string; anim: Animated.Value };

export default function PremiumGate({ visible, onClose, source }: { visible: boolean; onClose: () => void; source?: string; }) {
  const themeCtx = useTheme();
  const theme = themeCtx?.theme ?? getTheme('light');
  const navigation = useNavigation();
  const [scale] = useState(new Animated.Value(0.5));
  const [opacity] = useState(new Animated.Value(0));
  const { variants } = useFlags();
  const { startTrial } = useAuth();

  const confetti = useMemo<ConfettiPiece[]>(() => {
    const colors = ['#FF6B00', '#FFD700', '#00CFFF', '#34C759', '#FF3B30'];
    return new Array(14).fill(0).map((_, i) => ({
      left: Math.random() * (SCREEN_W - 40) + 20,
      delay: i * 80,
      color: colors[i % colors.length],
      anim: new Animated.Value(0),
    }));
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 280, useNativeDriver: true, easing: Easing.out(Easing.back(1.2)) }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();

      confetti.forEach((c) => {
        c.anim.setValue(0);
        Animated.timing(c.anim, { toValue: 1, duration: 900 + Math.random() * 600, delay: c.delay, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      });
    } else {
      scale.setValue(0.5);
      opacity.setValue(0);
    }
  }, [visible, confetti, opacity, scale]);

  const copyA = { title: 'Essa função é Premium', body: 'Desbloqueie coach de corrida, rotas inteligentes, badges animadas e mais.' };
  const copyB = { title: 'Leve seus treinos ao próximo nível', body: 'Plano inteligente, rotas populares e recuperação diária com insights.' };
  const copy = variants.paywallCopy === 'B' ? copyB : copyA;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {confetti.map((c, idx) => (
          <Animated.View key={idx} style={[styles.confetti, { backgroundColor: c.color, left: c.left, transform: [{ translateY: c.anim.interpolate({ inputRange: [0, 1], outputRange: [-40, SCREEN_H * 0.4] }) }, { rotate: c.anim.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '40deg'] }) }] }]} />
        ))}
        <Animated.View style={[styles.card, { backgroundColor: theme.colors.card, transform: [{ scale }], opacity }]}> 
          <Text style={[styles.title, { color: theme.colors.text }]}>{copy.title}</Text>
          <Text style={[styles.body, { color: theme.colors.muted }]}>{copy.body}</Text>
          <View style={styles.row}>
            <Pressable onPress={onClose} style={[styles.btn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}> 
              <Text style={[styles.btnText, { color: theme.colors.text }]}>Fechar</Text>
            </Pressable>
            <Pressable onPress={() => { onClose();
              // @ts-ignore
              navigation.navigate('Upgrade', { source });
            }} style={[styles.btn, { backgroundColor: theme.colors.primary }]}> 
              <Text style={[styles.btnText, { color: 'white' }]}>Assinar Agora</Text>
            </Pressable>
          </View>
          <Pressable onPress={async () => { await startTrial(); onClose(); }} style={{ marginTop: 10, alignSelf: 'flex-end' }}>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Iniciar teste grátis de 7 dias</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { borderRadius: 20, padding: 20, width: '100%', maxWidth: 420 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  body: { fontSize: 15, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  btnText: { fontSize: 16, fontWeight: '600' },
  confetti: { position: 'absolute', top: 0, width: 8, height: 12, borderRadius: 2, opacity: 0.9 },
});