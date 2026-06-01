import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import DifficultyBadge from '@/components/DifficultyBadge';

export default function ModuleDetailScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Parameters
  const { moduleId } = useLocalSearchParams();

  // Store connection
  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const instructors = useLearningStore((s) => s.instructors);

  // Find targeted module & instructor
  const module = modules.find((m) => m.id === moduleId);
  const instructor = module
    ? instructors.find((i) => i.id === module.instructorId)
    : null;

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  if (!currentRole) {
    return null;
  }

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <AppButton
          title="⬅️ Daftar Modul"
          onPress={() => router.replace('/modules' as any)}
          variant="ghost"
          style={styles.backBtn}
        />
        <Text style={[styles.title, { color: themeColors.text }]}>🔬 Detail Modul</Text>
      </View>

      {!module ? (
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Modul Tidak Ditemukan
          </Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Maaf, modul belajar yang Anda cari tidak tersedia di kurikulum BioLearn saat ini.
          </Text>
        </AppCard>
      ) : (
        <>
          {/* Main Info Card */}
          <AppCard style={styles.detailCard}>
            <View style={styles.metaRow}>
              <DifficultyBadge difficulty={module.difficulty} />
              <Text style={[styles.gradeBadge, { color: themeColors.textSecondary }]}>
                Kelas {module.grade} • Bab {module.chapter}
              </Text>
            </View>

            <Text style={[styles.moduleTitle, { color: themeColors.text }]}>
              {module.title}
            </Text>

            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  🎥 Judul Video Pembahasan
                </Text>
                <Text style={[styles.infoVal, { color: themeColors.text }]}>
                  {module.videoTitle}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  ⏱️ Estimasi Waktu Belajar
                </Text>
                <Text style={[styles.infoVal, { color: themeColors.text }]}>
                  {module.estimatedMinutes} Menit
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  👩‍🏫 Pengajar & Spesialisasi
                </Text>
                <Text style={[styles.infoVal, { color: themeColors.text }]}>
                  {instructor?.name} ({instructor?.specialization})
                </Text>
              </View>
            </View>
          </AppCard>

          {/* Next Checkpoint Info Card */}
          <AppCard style={styles.comingSoonCard}>
            <Text style={styles.comingSoonIcon}>🚀</Text>
            <Text style={[styles.comingSoonTitle, { color: themeColors.text }]}>
              Segera Hadir: Ruang Belajar Mandiri
            </Text>
            <Text style={[styles.comingSoonDesc, { color: themeColors.textSecondary }]}>
              Di checkpoint berikutnya, kita akan membuka fitur inti pembelajaran yaitu:
            </Text>
            <View style={styles.comingSoonList}>
              <Text style={[styles.comingSoonItem, { color: themeColors.textSecondary }]}>
                • 🎬 **Expo Video Player** terintegrasi secara dinamis.
              </Text>
              <Text style={[styles.comingSoonItem, { color: themeColors.textSecondary }]}>
                • 📝 **Ringkasan Materi** biologi berformat Markdown terstruktur.
              </Text>
              <Text style={[styles.comingSoonItem, { color: themeColors.textSecondary }]}>
                • ❓ **Sistem Kuis Interaktif** untuk evaluasi langsung.
              </Text>
            </View>
          </AppCard>
        </>
      )}

      {/* Footer Navigation Actions */}
      <View style={styles.actionContainer}>
        <AppButton
          title="Daftar Modul"
          onPress={() => router.replace('/modules' as any)}
          variant="primary"
          style={styles.actionBtn}
        />
        <AppButton
          title="Kembali ke Dashboard"
          onPress={() => router.replace('/dashboard' as any)}
          variant="secondary"
          style={styles.actionBtn}
        />
      </View>

      <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
        BioLearn Demo Checklist • Checkpoint 6
      </Text>
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    marginBottom: Spacing.xs,
    minHeight: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  errorCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailCard: {
    gap: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  infoGrid: {
    gap: Spacing.md,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  comingSoonCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    gap: Spacing.xs,
    padding: Spacing.lg,
  },
  comingSoonIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  comingSoonDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  comingSoonList: {
    marginTop: Spacing.xs,
    gap: 4,
  },
  comingSoonItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    minHeight: 48,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
});
