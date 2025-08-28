import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function StickyCTA({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12 },
  inner: { borderRadius: 16, padding: 12, backgroundColor: 'rgba(0,0,0,0.4)' },
});

