import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function AppCard({ children, style, onPress }: AppCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardStyle = [
    styles.card,
    {
      backgroundColor: themeColors.surface,
      borderColor: themeColors.border,
      shadowColor: colorScheme === 'light' ? '#0F172A' : '#000000',
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg, // Modern 16px corners
    padding: Spacing.lg, // Spacious 24px internal padding
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
