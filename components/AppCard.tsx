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
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
});
