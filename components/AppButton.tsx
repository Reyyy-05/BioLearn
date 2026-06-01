import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: AppButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Button container styles mapping
  const getButtonStyles = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: themeColors.tint,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: themeColors.tint,
        };
    }
  };

  // Button text styles mapping
  const getTextStyles = (): StyleProp<TextStyle> => {
    switch (variant) {
      case 'secondary':
      case 'ghost':
        return {
          color: themeColors.tint,
        };
      case 'primary':
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        getButtonStyles(),
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, getTextStyles()]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12, // Cohesive modern rounded style
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }], // Premium touch scale-down response
  },
});
