import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  helpText?: string;
  errorText?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function Input({ value, onChangeText, placeholder, secureTextEntry, helpText, errorText, style, inputStyle }: InputProps) {
  const { theme } = useTheme();
  const isError = !!errorText;
  return (
    <View style={style}> 
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { borderColor: isError ? '#EF4444' : theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }, inputStyle]}
      />
      {helpText && !isError ? <Text style={[styles.help, { color: theme.colors.textSecondary }]}>{helpText}</Text> : null}
      {isError ? <Text style={[styles.error, { color: '#EF4444' }]}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  help: { marginTop: 6, fontSize: 12 },
  error: { marginTop: 6, fontSize: 12, fontWeight: '600' },
});

