import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { LearningModule, Instructor } from '@/types';
import AppCard from './AppCard';
import DifficultyBadge from './DifficultyBadge';

interface VideoLessonCardProps {
  module: LearningModule;
  instructor: Instructor;
  onPress?: () => void;
}

export default function VideoLessonCard({
  module,
  instructor,
  onPress,
}: VideoLessonCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Helper to format duration (seconds -> mm:ss)
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AppCard onPress={onPress} style={styles.card}>
      {/* Premium Video Thumbnail Placeholder */}
      <View
        style={[
          styles.thumbnailPlaceholder,
          { backgroundColor: themeColors.border },
        ]}
      >
        <Text style={styles.playIcon}>🎬</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {formatDuration(module.videoDuration)}
          </Text>
        </View>
      </View>

      {/* Lesson Details */}
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={module.difficulty} />
          <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
            ⏱️ {module.estimatedMinutes} menit belajar
          </Text>
        </View>

        <Text
          style={[styles.title, { color: themeColors.text }]}
          numberOfLines={2}
        >
          {module.videoTitle}
        </Text>

        <View style={styles.instructorRow}>
          <View
            style={[
              styles.avatarMini,
              { backgroundColor: themeColors.border },
            ]}
          >
            <Text style={[styles.avatarMiniText, { color: themeColors.tint }]}>
              {instructor.nickname ? instructor.nickname.replace('Kak ', '')[0] : 'I'}
            </Text>
          </View>
          <Text
            style={[styles.instructorName, { color: themeColors.textSecondary }]}
          >
            Materi oleh {instructor.nickname}
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    height: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playIcon: {
    fontSize: 48,
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 11,
    fontWeight: '700',
  },
  instructorName: {
    fontSize: 13,
    fontWeight: '500',
  },
});
