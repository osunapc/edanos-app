import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import colors from '../../constants/colors';
import { TextFieldProps } from '../../types/evaluation';

const TextField = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    onBlur,
  }: TextFieldProps) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
        keyboardType={keyboardType as any}
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
});

export default TextField;