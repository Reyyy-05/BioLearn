import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface ProgressBarProps {
  value: number;
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={styles.container}>
      {(label || label === '') && (
        <View style={styles.textContainer}>
          {label !== '' && <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>}
          <Text style={[styles.percentage, { color: themeColors.tint }]}>
            {clampedValue}%
          </Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: themeColors.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedValue}%`,
              backgroundColor: themeColors.tint,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    height: 8,
    width: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
