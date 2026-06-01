import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  useColorScheme,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface QuizOptionProps {
  label: string; // "A", "B", "C", "D"
  text: string;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  onPress: () => void;
}

export default function QuizOption({
  label,
  text,
  selected = false,
  correct = false,
  wrong = false,
  onPress,
}: QuizOptionProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Helper to determine background, border and text color styles dynamically
  const getColors = () => {
    if (correct) {
      return {
        bg: colorScheme === 'light' ? '#DCFCE7' : '#064E3B',
        border: themeColors.success,
        text: themeColors.success,
        labelBg: themeColors.success,
        labelText: '#FFFFFF',
      };
    }
    if (wrong) {
      return {
        bg: colorScheme === 'light' ? '#FEE2E2' : '#7F1D1D',
        border: themeColors.error,
        text: themeColors.error,
        labelBg: themeColors.error,
        labelText: '#FFFFFF',
      };
    }
    if (selected) {
      return {
        bg: colorScheme === 'light' ? '#E8F5E9' : '#1B5E20',
        border: themeColors.tint,
        text: themeColors.tint,
        labelBg: themeColors.tint,
        labelText: '#FFFFFF',
      };
    }

    return {
      bg: themeColors.surface,
      border: themeColors.border,
      text: themeColors.text,
      labelBg: themeColors.border,
      labelText: themeColors.textSecondary,
    };
  };

  const colors = getColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={correct || wrong} // Disable interaction if showing answers
      style={({ pressed }) => [
        styles.optionContainer,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        pressed && !correct && !wrong && styles.pressed,
      ]}
    >
      <View style={[styles.labelBadge, { backgroundColor: colors.labelBg }]}>
        <Text style={[styles.labelText, { color: colors.labelText }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.optionText, { color: colors.text }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12, // Cohesive modern rounded style
    borderWidth: 1.5,
    gap: Spacing.md,
    minHeight: 56,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  labelBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }], // Interactive click scale-down
  },
});
