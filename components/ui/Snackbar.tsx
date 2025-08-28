import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  visible: boolean;
}

export default function Snackbar({ message, actionLabel, onAction, visible }: SnackbarProps) {
  const translateY = React.useRef(new Animated.Value(80)).current;
  React.useEffect(() => {
    Animated.timing(translateY, { toValue: visible ? 0 : 80, duration: 180, useNativeDriver: true }).start();
  }, [visible]);
  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}> 
      <View style={styles.inner}>
        <Text style={styles.msg}>{message}</Text>
        {actionLabel ? (
          <Pressable onPress={onAction} style={styles.btn}><Text style={styles.btnText}>{actionLabel}</Text></Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 16, alignItems: 'center' },
  inner: { backgroundColor: '#111827EE', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
  msg: { color: '#fff', fontWeight: '600' },
  btn: { marginLeft: 12, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: '#374151' },
  btnText: { color: '#fff', fontWeight: '800' },
});

