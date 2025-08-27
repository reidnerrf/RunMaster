import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SparkBarProps {
  data: number[];
  max?: number;
}

export default function SparkBar({ data, max }: SparkBarProps) {
  const { theme } = useTheme();
  const peak = max || Math.max(1, ...data);
  return (
    <View style={styles.row}> 
      {data.map((v, i) => {
        const h = Math.round((v / peak) * 40) + 4;
        return <View key={i} style={[styles.bar, { height: h, backgroundColor: theme.colors.primary }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bar: { width: 6, borderRadius: 3 },
});

