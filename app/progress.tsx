import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';

export default function ProgressScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const progress = useLearningStore((s) => s.progress);

  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  if (!currentRole) {
    return null;
  }

  // Calculate quick stats for placeholder display
  const completedCount = modules.filter((m) => progress[m.id]?.completed).length;
  const watchedCount = modules.filter((m) => progress[m.id]?.videoWatched).length;

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>📈 Progress Belajar</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Pantau grafik pemahaman Biologi SMA Anda secara berkala.
        </Text>
      </View>

      <AppCard style={styles.infoCard}>
        <Text style={[styles.infoTitle, { color: themeColors.text }]}>
          🚧 Halaman Progress Lengkap Sedang Dibuat
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Visualisasi detail progress seperti grafik belajar harian, rekam jejak video, dan rincian salah-benar kuis sedang dikembangkan.
        </Text>
        <View style={styles.statRow}>
          <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
            ✅ Modul Selesai: **{completedCount}** dari **{modules.length}**
          </Text>
          <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
            🎥 Video Ditonton: **{watchedCount}** dari **{modules.length}**
          </Text>
        </View>
      </AppCard>

      <AppButton
        title="Kembali ke Dashboard"
        onPress={() => router.replace('/dashboard' as any)}
        variant="primary"
        style={styles.backButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  statRow: {
    gap: 4,
    marginTop: Spacing.xs,
  },
  statText: {
    fontSize: 14,
  },
  backButton: {
    marginTop: Spacing.md,
  },
});
