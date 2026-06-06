import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import DifficultyBadge from '@/components/DifficultyBadge';

type GradeFilter = 'all' | '10' | '11' | '12';

export default function ModulesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Store connection
  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const instructors = useLearningStore((s) => s.instructors);
  const progress = useLearningStore((s) => s.progress);

  // Local state for grade filtering
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>('all');

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  if (!currentRole) {
    return null;
  }

  // Helper to map module titles to gorgeous premium emojis
  const getModuleEmoji = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('sel')) return '🧫';
    if (lower.includes('dna') || lower.includes('genetika') || lower.includes('pewarisan')) return '🧬';
    if (lower.includes('ekologi') || lower.includes('ekosistem') || lower.includes('lingkungan')) return '🌳';
    if (lower.includes('metabolisme') || lower.includes('katabolisme') || lower.includes('anabolisme')) return '⚡';
    if (lower.includes('jaringan') || lower.includes('tumbuhan') || lower.includes('hewan')) return '🔬';
    if (lower.includes('sistem') || lower.includes('pencernaan') || lower.includes('pernapasan') || lower.includes('ekskresi')) return '🫁';
    return '📖';
  };

  // Filtering modules
  const filteredModules = modules.filter((m) => {
    if (selectedGrade === 'all') return true;
    return m.grade.toString() === selectedGrade;
  });

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <AppButton
          title="⬅️ Dashboard"
          onPress={() => router.replace('/dashboard' as any)}
          variant="ghost"
          style={styles.backBtn}
        />
        <Text style={[styles.title, { color: themeColors.text }]}>📚 Daftar Modul Biologi</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Pilih materi Biologi SMA yang ingin kamu pelajari hari ini.
        </Text>
      </View>

      {/* Grade Selector Tabs */}
      <View style={styles.filterContainer}>
        {(['all', '10', '11', '12'] as GradeFilter[]).map((grade) => {
          const isActive = selectedGrade === grade;
          const label =
            grade === 'all' ? 'Semua Kelas' : `Kelas ${grade}`;
          return (
            <Pressable
              key={grade}
              onPress={() => setSelectedGrade(grade)}
              style={[
                styles.filterTab,
                {
                  backgroundColor: isActive ? themeColors.tint : themeColors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? '#FFFFFF' : themeColors.text,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Module List Grid */}
      <View style={styles.listContainer}>
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => {
            const instructor = instructors.find((i) => i.id === module.instructorId);
            const moduleProgress = progress[module.id];
            const isCompleted = moduleProgress?.completed;
            const isVideoWatched = moduleProgress?.videoWatched;
            const lastScore = moduleProgress?.lastScore;

            return (
              <AppCard key={module.id} style={styles.moduleCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconWrapper, { backgroundColor: themeColors.border }]}>
                    <Text style={styles.moduleIcon}>{getModuleEmoji(module.title)}</Text>
                  </View>
                  <View style={styles.headerInfo}>
                    <View style={styles.badgeRow}>
                      <DifficultyBadge difficulty={module.difficulty} />
                      <Text style={[styles.gradeTag, { color: themeColors.textSecondary }]}>
                        Kelas {module.grade} • Bab {module.chapter}
                      </Text>
                    </View>
                    <Text style={[styles.moduleTitle, { color: themeColors.text }]}>
                      {module.title}
                    </Text>
                  </View>
                </View>

                {/* Module Stats Summary */}
                <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                <View style={styles.metaGrid}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>
                      ⏱️ Durasi Belajar
                    </Text>
                    <Text style={[styles.metaVal, { color: themeColors.text }]}>
                      {module.estimatedMinutes} Menit
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>
                      👩‍🏫 Pemateri
                    </Text>
                    <Text style={[styles.metaVal, { color: themeColors.text }]}>
                      {instructor?.nickname || 'Tutor'}
                    </Text>
                  </View>
                </View>

                {/* Progress Indicators */}
                <View style={styles.progressSection}>
                  <View style={styles.indicatorRow}>
                    <View style={styles.indicator}>
                      <Text style={styles.indicatorDot}>{isVideoWatched ? '🟢' : '⚪'}</Text>
                      <Text style={[styles.indicatorText, { color: themeColors.textSecondary }]}>
                        Video: {isVideoWatched ? 'Sudah ditonton' : 'Belum ditonton'}
                      </Text>
                    </View>
                    <View style={styles.indicator}>
                      <Text style={styles.indicatorDot}>{isCompleted ? '🟢' : '⚪'}</Text>
                      <Text style={[styles.indicatorText, { color: themeColors.textSecondary }]}>
                        Modul: {isCompleted ? 'Selesai' : 'Belum selesai'}
                      </Text>
                    </View>
                  </View>

                  {lastScore !== undefined && lastScore !== null && (
                    <View style={[styles.scoreRow, { backgroundColor: themeColors.border }]}>
                      <Text style={[styles.scoreLabel, { color: themeColors.text }]}>
                        💯 Skor Kuis Terakhir:
                      </Text>
                      <Text
                        style={[
                          styles.scoreValue,
                          {
                            color: lastScore >= 70 ? themeColors.success : themeColors.error,
                          },
                        ]}
                      >
                        {lastScore} / 100 {lastScore >= 70 ? '(Lulus)' : '(Remidi)'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Open Module Action */}
                <AppButton
                  title="📖 Buka Modul"
                  onPress={() =>
                    router.push({
                      pathname: '/module-detail' as any,
                      params: { moduleId: module.id },
                    })
                  }
                  variant="primary"
                  style={styles.openBtn}
                />
              </AppCard>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              Belum Ada Modul
            </Text>
            <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
              Belum ada modul belajar untuk kategori Kelas {selectedGrade} saat ini.
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
        BioLearn Demo Checklist • Checkpoint 10 (Final MVP)
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
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
  },
  filterText: {
    fontSize: 13,
  },
  listContainer: {
    gap: Spacing.lg,
  },
  moduleCard: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIcon: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gradeTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressSection: {
    gap: Spacing.xs,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicatorDot: {
    fontSize: 10,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  openBtn: {
    minHeight: 44,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.xs,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
});
