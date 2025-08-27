import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { setLang } from '../../utils/i18n';

export default function LanguageSwitcher() {
  const { theme } = useTheme();

  const switchToPortuguese = () => setLang('pt');
  const switchToEnglish = () => setLang('en');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.label, { color: theme.colors.muted }]}>Idioma / Language:</Text>
      <View style={styles.buttons}>
        <Pressable
          style={[styles.langButton, { backgroundColor: theme.colors.primary }]}
          onPress={switchToPortuguese}
        >
          <Text style={[styles.langText, { color: 'white' }]}>PT</Text>
        </Pressable>
        <Pressable
          style={[styles.langButton, { backgroundColor: theme.colors.muted }]}
          onPress={switchToEnglish}
        >
          <Text style={[styles.langText, { color: 'white' }]}>EN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
  },
});