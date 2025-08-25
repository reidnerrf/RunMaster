import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FlowHint({ steps }: { steps: string[] }) {
  return (
    <View style={styles.row}>
      {steps.map((s, i) => (
        <View key={i} style={styles.step}>
          <Text style={styles.text}>{s}</Text>
          {i < steps.length - 1 && <Text style={styles.arrow}> ➜ </Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  step: { flexDirection: 'row', alignItems: 'center' },
  text: { fontWeight: '700', color: '#555' },
  arrow: { color: '#999', fontWeight: '900' },
});