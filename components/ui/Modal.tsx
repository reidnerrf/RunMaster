import React from 'react';
import { Modal as RNModal, View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({ visible, onClose, children }: ModalProps) {
  const { theme } = useTheme();
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}> 
        <View style={[styles.content, { backgroundColor: theme.colors.backgroundCard, borderColor: theme.colors.border }]}> 
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { minWidth: 280, borderRadius: 16, padding: 16, borderWidth: 1 },
});

