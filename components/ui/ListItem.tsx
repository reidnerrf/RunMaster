import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  avatarUri?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function ListItem({ title, subtitle, avatarUri, icon, trailing, onPress, style }: ListItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.base, { backgroundColor: theme.colors.backgroundCard, borderColor: theme.colors.border }, style]}> 
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : icon ? (
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.backgroundSecondary }]}>{icon}</View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700', fontSize: 16 },
  subtitle: { marginTop: 2, fontSize: 12 },
});

