import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import colors from '../../constants/colors';
import { TextAreaProps } from '../../types/evaluation';

const TextArea = memo(
  ({ label, value, onChangeText, placeholder, onBlur }: TextAreaProps) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
        placeholderTextColor={colors.textLight}
      />
    </View>
  )
);

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  textInput: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 5,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});

export default TextArea;