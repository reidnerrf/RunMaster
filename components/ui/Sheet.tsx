import React from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Sheet({ visible, onClose, children }: SheetProps) {
  const { theme } = useTheme();
  const translateY = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;

  React.useEffect(() => {
    Animated.timing(translateY, { toValue: visible ? 0 : Dimensions.get('window').height, duration: visible ? 240 : 200, useNativeDriver: true }).start();
  }, [visible, translateY]);

  if (!visible) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }]}> 
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay }]} onPress={onClose} />
      <Animated.View style={[styles.sheet, { backgroundColor: theme.colors.backgroundCard, borderColor: theme.colors.border, transform: [{ translateY }] }]}> 
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, borderWidth: 1 },
});

