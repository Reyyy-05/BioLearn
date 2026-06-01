import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Instructor } from '@/types';
import AppCard from './AppCard';

interface InstructorCardProps {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Helper to extract initials (e.g., "Kak Nisa" -> "KN", "Kak Ardi" -> "KA", "Raka Dwi" -> "RD")
  const getInitials = (nickname: string, name: string): string => {
    const source = nickname || name;
    const parts = source.split(' ').filter((p) => p.toLowerCase() !== 'kak');
    if (parts.length === 0) return source.substring(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(instructor.nickname, instructor.name);

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.avatarPlaceholder,
            {
              backgroundColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.avatarText, { color: themeColors.tint }]}>
            {initials}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {instructor.name}
          </Text>
          <Text style={[styles.title, { color: themeColors.textSecondary }]}>
            {instructor.specialization}
          </Text>
        </View>
      </View>
      <Text style={[styles.bio, { color: themeColors.textSecondary }]}>
        {instructor.bio}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
});
