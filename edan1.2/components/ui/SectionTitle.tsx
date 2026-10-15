import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { SectionTitleProps } from '../../types/evaluation';

export const SectionTitle = memo(({ title }: SectionTitleProps) => (
  <View style={styles.sectionTitleContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));

export const SubsectionTitle = memo(({ title }: SectionTitleProps) => (
  <View style={styles.subsectionTitleContainer}>
    <Text style={styles.subsectionTitle}>{title}</Text>
  </View>
));

const styles = StyleSheet.create({
  sectionTitleContainer: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subsectionTitleContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default { SectionTitle, SubsectionTitle };