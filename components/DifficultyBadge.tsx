import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Difficulty } from '@/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Helper to resolve color token based on difficulty
  const getDifficultyColors = () => {
    switch (difficulty) {
      case 'Sedang':
        return {
          bg: colorScheme === 'light' ? '#FEF3C7' : '#78350F',
          text: themeColors.warning,
        };
      case 'Sulit':
        return {
          bg: colorScheme === 'light' ? '#FEE2E2' : '#7F1D1D',
          text: themeColors.error,
        };
      case 'Mudah':
      default:
        return {
          bg: colorScheme === 'light' ? '#DCFCE7' : '#064E3B',
          text: themeColors.success,
        };
    }
  };

  const colors = getDifficultyColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.xs - 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
