import AppButton from '@/components/AppButton';
import AppCard from '@/components/AppCard';
import DifficultyBadge from '@/components/DifficultyBadge';
import ProgressBar from '@/components/ProgressBar';
import ScreenContainer from '@/components/ScreenContainer';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function ProgressScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Store data
  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const instructors = useLearningStore((s) => s.instructors);
  const progress = useLearningStore((s) => s.progress);
  const quizAttempts = useLearningStore((s) => s.quizAttempts);

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  if (!currentRole) {
    return null;
  }

  // Handle Teacher/Admin Gracefully
  if (currentRole !== 'student') {
    return (
      <ScreenContainer style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.nonStudentCard}>
          <Text style={styles.nonStudentIcon}>🎓</Text>
          <Text style={[styles.nonStudentTitle, { color: themeColors.text }]}>
            Akses Terbatas
          </Text>
          <Text style={[styles.nonStudentDesc, { color: themeColors.textSecondary }]}>
            Detail grafik progress belajar interaktif hanya dikhususkan untuk akun **Siswa**.
          </Text>
          <AppButton
            title="Kembali ke Dashboard"
            onPress={() => router.replace('/dashboard' as any)}
            variant="primary"
            style={styles.fullWidth}
          />
        </AppCard>
      </ScreenContainer>
    );
  }

  // --- STATS CALCULATION ---
  const totalModules = modules.length;
  const completedModules = modules.filter((m) => progress[m.id]?.completed).length;
  const watchedVideos = modules.filter((m) => progress[m.id]?.videoWatched).length;

  const progressRecords = Object.values(progress);
  const totalAttempts = progressRecords.reduce((sum, p) => sum + (p.attempts || 0), 0);

  // Calculate average score
  const gradedRecords = progressRecords.filter((p) => p.lastScore !== null && p.lastScore !== undefined);
  const averageScore =
    gradedRecords.length > 0
      ? Math.round(gradedRecords.reduce((sum, p) => sum + (p.lastScore || 0), 0) / gradedRecords.length)
      : 0;

  const overallProgressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Unfinished modules count
  const unfinishedModules = modules.filter((m) => !progress[m.id]?.completed);

  // Modules with scores < 70
  const lowScoreModules = modules.filter((m) => {
    const score = progress[m.id]?.lastScore;
    return score !== null && score !== undefined && score < 70;
  });

  // Modules where video is not watched
  const unwatchedVideoModules = modules.filter((m) => !progress[m.id]?.videoWatched);

  // Emoji helper for topic mapping
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

  // Format date helper
  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  // Best score helper for a module
  const getModuleBestScore = (moduleId: string): number | null => {
    const moduleAttempts = quizAttempts.filter((a) => a.moduleId === moduleId);
    if (moduleAttempts.length === 0) return null;
    return Math.max(...moduleAttempts.map((a) => a.score));
  };

  // Recent attempts across all modules (newest first, max 5)
  const recentAttempts = [...quizAttempts]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  // --- TOPIC TO REVIEW LOGIC ---
  const topicsToReview = [...lowScoreModules, ...unwatchedVideoModules.filter(m => !lowScoreModules.find(l => l.id === m.id))];

  // --- RECOMMENDATION ENGINE ---
  const getNextRecommendation = () => {
    // 1. If there's a score < 70, recommend retrying the lowest score
    if (lowScoreModules.length > 0) {
      // Find the lowest score
      const sortedLowModules = [...lowScoreModules].sort((a, b) => {
        const scoreA = progress[a.id]?.lastScore ?? 100;
        const scoreB = progress[b.id]?.lastScore ?? 100;
        return scoreA - scoreB;
      });
      const lowestModule = sortedLowModules[0];
      return {
        module: lowestModule,
        type: 'quiz' as const,
        title: `🔥 Remidi Kuis: ${lowestModule.title}`,
        desc: `Skor terakhir Anda adalah ${progress[lowestModule.id]?.lastScore || 0} (di bawah KKM 70). Ayo pelajari lagi ringkasan materinya lalu ulangi kuisnya untuk melulusi bab ini!`,
      };
    }

    // 2. Recommend first unfinished module in seed order
    if (unfinishedModules.length > 0) {
      const nextModule = unfinishedModules[0];
      const nextProgress = progress[nextModule.id];
      const isVideoDone = nextProgress?.videoWatched;

      return {
        module: nextModule,
        type: isVideoDone ? ('quiz' as const) : ('video' as const),
        title: isVideoDone ? `✍️ Selesaikan Kuis: ${nextModule.title}` : `🎬 Tonton Video: ${nextModule.title}`,
        desc: isVideoDone
          ? `Anda sudah menonton video pembahasan materi "${nextModule.title}". Langkah selanjutnya adalah menyelesaikan kuis interaktifnya.`
          : `Mulai pelajari materi "${nextModule.title}" dengan menonton video materi pembelajaran bersama pemateri pilihan Anda.`,
      };
    }

    // 3. All modules are completed
    return {
      module: null,
      type: 'review' as const,
      title: '🏆 Selamat! Kurikulum Selesai',
      desc: 'Hebat sekali! Anda telah merampungkan seluruh modul belajar Biologi SMA dengan hasil lulus KKM. Disarankan melakukan review materi secara berkala.',
    };
  };

  const recommendation = getNextRecommendation();

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
        <Text style={[styles.title, { color: themeColors.text }]}>📈 Progress Belajar</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Pantau grafik pemahaman Biologi SMA Anda secara berkala.
        </Text>
      </View>

      {/* Global Stat Cards Grid */}
      <View style={styles.statsGrid}>
        <AppCard style={styles.statCard}>
          <Text style={styles.statIcon}>📚</Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{completedModules}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Modul Selesai</Text>
        </AppCard>

        <AppCard style={styles.statCard}>
          <Text style={styles.statIcon}>🎥</Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{watchedVideos}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Video Ditonton</Text>
        </AppCard>

        <AppCard style={styles.statCard}>
          <Text style={styles.statIcon}>💯</Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{averageScore}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Rata-rata Skor</Text>
        </AppCard>

        <AppCard style={styles.statCard}>
          <Text style={styles.statIcon}>📝</Text>
          <Text style={[styles.statValue, { color: themeColors.text }]}>{totalAttempts}</Text>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Percobaan Kuis</Text>
        </AppCard>
      </View>

      {/* Overall Progress Tracker */}
      <AppCard style={styles.progressTrackerCard}>
        <ProgressBar value={overallProgressPercent} label="Progress Keseluruhan Kurikulum" />
      </AppCard>

      {/* Recommendation Engine Card */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>💡 Rekomendasi Langkah Berikutnya</Text>
        <AppCard style={[styles.recCard, { borderLeftColor: recommendation.module ? (recommendation.type === 'quiz' ? themeColors.warning : themeColors.tint) : themeColors.success }]}>
          <Text style={[styles.recTitle, { color: themeColors.text }]}>{recommendation.title}</Text>
          <Text style={[styles.recDesc, { color: themeColors.textSecondary }]}>{recommendation.desc}</Text>
          {recommendation.module && (
            <AppButton
              title={recommendation.type === 'quiz' ? '✍️ Mulai Kuis' : '📖 Buka Modul'}
              onPress={() => {
                if (recommendation.type === 'quiz') {
                  router.push({
                    pathname: '/quiz' as any,
                    params: { moduleId: recommendation.module!.id },
                  });
                } else {
                  router.push({
                    pathname: '/module-detail' as any,
                    params: { moduleId: recommendation.module!.id },
                  });
                }
              }}
              variant="primary"
              style={styles.recBtn}
            />
          )}
        </AppCard>
      </View>

      {/* Topics to Review Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>⚠️ Materi yang Perlu Diulas Kembali</Text>
        {topicsToReview.length > 0 ? (
          <View style={styles.topicsGrid}>
            {topicsToReview.map((module) => {
              const moduleProgress = progress[module.id];
              const score = moduleProgress?.lastScore;
              const hasScore = score !== null && score !== undefined;
              const isVideoDone = moduleProgress?.videoWatched;

              return (
                <AppCard key={module.id} style={styles.topicReviewCard}>
                  <View style={styles.topicHeader}>
                    <Text style={styles.topicEmoji}>{getModuleEmoji(module.title)}</Text>
                    <View style={styles.topicHeaderText}>
                      <Text style={[styles.topicTitle, { color: themeColors.text }]} numberOfLines={1}>
                        {module.title}
                      </Text>
                      <Text style={[styles.topicSubText, { color: themeColors.textSecondary }]}>
                        Kelas {module.grade} • Bab {module.chapter}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.topicBadges}>
                    {hasScore && score! < 70 && (
                      <Text style={[styles.reviewBadge, { color: themeColors.error, backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                        Skor Kuis Rendah ({score})
                      </Text>
                    )}
                    {!isVideoDone && (
                      <Text style={[styles.reviewBadge, { color: themeColors.tint, backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                        Video Belum Selesai
                      </Text>
                    )}
                  </View>
                  <AppButton
                    title="Buka Ruang Belajar"
                    onPress={() =>
                      router.push({
                        pathname: '/module-detail' as any,
                        params: { moduleId: module.id },
                      })
                    }
                    variant="ghost"
                    style={styles.topicBtn}
                  />
                </AppCard>
              );
            })}
          </View>
        ) : (
          <AppCard style={styles.completedAllCard}>
            <Text style={styles.trophyIcon}>🌟</Text>
            <Text style={[styles.completedTitle, { color: themeColors.text }]}>Semua Topik Aman!</Text>
            <Text style={[styles.completedDesc, { color: themeColors.textSecondary }]}>
              Belum ada topik yang perlu diulang. Pertahankan konsistensi belajarmu.
            </Text>
          </AppCard>
        )}
      </View>

      {/* Modules Status List */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>📋 Status Pembelajaran Tiap Modul</Text>
        <View style={styles.listGrid}>
          {modules.map((module) => {
            const instructor = instructors.find((i) => i.id === module.instructorId);
            const moduleProgress = progress[module.id];
            const isCompleted = moduleProgress?.completed ?? false;
            const isVideoWatched = moduleProgress?.videoWatched ?? false;
            const lastScore = moduleProgress?.lastScore;
            const attempts = moduleProgress?.attempts ?? 0;

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

                <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                {/* Status details metadata */}
                <View style={styles.moduleMetaRow}>
                  <Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>
                    Tutor: <Text style={[styles.metaVal, { color: themeColors.text }]}>{instructor?.nickname || 'Tutor'}</Text>
                  </Text>
                  <Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>
                    Percobaan Kuis: <Text style={[styles.metaVal, { color: themeColors.text }]}>{attempts} Kali</Text>
                  </Text>
                </View>

                {/* Progress Indicators */}
                <View style={styles.statusIndicatorsGrid}>
                  <View style={styles.indicatorItem}>
                    <Text style={styles.indicatorDot}>{isVideoWatched ? '🟢' : '⚪'}</Text>
                    <Text style={[styles.indicatorLabel, { color: themeColors.textSecondary }]}>
                      Video: {isVideoWatched ? 'Sudah ditonton' : 'Belum ditonton'}
                    </Text>
                  </View>
                  <View style={styles.indicatorItem}>
                    <Text style={styles.indicatorDot}>{isCompleted ? '🟢' : '⚪'}</Text>
                    <Text style={[styles.indicatorLabel, { color: themeColors.textSecondary }]}>
                      Modul: {isCompleted ? 'Selesai Belajar' : 'Belum Selesai'}
                    </Text>
                  </View>
                </View>

                {/* Quiz score indicator */}
                <View style={[styles.scoreBox, { backgroundColor: themeColors.border }]}>
                  <Text style={[styles.scoreBoxLabel, { color: themeColors.text }]}>Skor Terakhir:</Text>
                  {lastScore !== null && lastScore !== undefined ? (
                    <Text
                      style={[
                        styles.scoreBoxVal,
                        { color: lastScore >= 70 ? themeColors.success : themeColors.error },
                      ]}
                    >
                      {lastScore} / 100 ({lastScore >= 70 ? 'Lulus' : 'Perlu Ulang'})
                    </Text>
                  ) : (
                    <Text style={[styles.scoreBoxVal, { color: themeColors.textSecondary }]}>
                      Belum Mencoba
                    </Text>
                  )}
                </View>

                {/* Best score indicator */}
                {(() => {
                  const best = getModuleBestScore(module.id);
                  return best !== null ? (
                    <View style={[styles.scoreBox, { backgroundColor: themeColors.border }]}>
                      <Text style={[styles.scoreBoxLabel, { color: themeColors.text }]}>Nilai Terbaik:</Text>
                      <Text
                        style={[
                          styles.scoreBoxVal,
                          { color: best >= 70 ? themeColors.success : themeColors.error },
                        ]}
                      >
                        {best} / 100
                      </Text>
                    </View>
                  ) : null;
                })()}

                {/* Card Actions */}
                <View style={styles.cardActionsRow}>
                  <AppButton
                    title="Lanjut Belajar"
                    onPress={() =>
                      router.push({
                        pathname: '/module-detail' as any,
                        params: { moduleId: module.id },
                      })
                    }
                    variant={isCompleted ? 'secondary' : 'primary'}
                    style={styles.cardActionBtn}
                  />
                  {lastScore !== null && lastScore !== undefined && lastScore < 70 && (
                    <AppButton
                      title="Ulangi Kuis"
                      onPress={() =>
                        router.push({
                          pathname: '/quiz' as any,
                          params: { moduleId: module.id },
                        })
                      }
                      variant="ghost"
                      style={styles.cardActionBtn}
                    />
                  )}
                </View>
              </AppCard>
            );
          })}
        </View>
      </View>

      {/* Recent Attempt History Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>📜 Riwayat Latihan Terbaru</Text>
        {recentAttempts.length > 0 ? (
          <AppCard style={styles.recentHistoryCard}>
            {recentAttempts.map((attempt, index) => {
              const attemptModule = modules.find((m) => m.id === attempt.moduleId);
              return (
                <View
                  key={attempt.id}
                  style={[
                    styles.recentItem,
                    index < recentAttempts.length - 1 && { borderBottomWidth: 1, borderBottomColor: themeColors.border },
                  ]}
                >
                  <View style={styles.recentItemTop}>
                    <Text style={[styles.recentModuleTitle, { color: themeColors.text }]} numberOfLines={1}>
                      {getModuleEmoji(attemptModule?.title || '')} {attemptModule?.title || 'Modul'}
                    </Text>
                    <Text
                      style={[
                        styles.recentScore,
                        { color: attempt.passed ? themeColors.success : themeColors.error },
                      ]}
                    >
                      {attempt.score}
                    </Text>
                  </View>
                  <View style={styles.recentItemBottom}>
                    <View style={styles.recentMeta}>
                      <Text
                        style={[
                          styles.recentModeBadge,
                          {
                            color: attempt.mode === 'exam' ? themeColors.warning : themeColors.tint,
                            backgroundColor: attempt.mode === 'exam' ? 'rgba(245,158,11,0.1)' : 'rgba(22,163,74,0.1)',
                          },
                        ]}
                      >
                        {attempt.mode === 'exam' ? 'Ujian' : 'Latihan'}
                      </Text>
                      <Text
                        style={[
                          styles.recentStatusBadge,
                          {
                            color: attempt.passed ? themeColors.success : themeColors.error,
                            backgroundColor: attempt.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          },
                        ]}
                      >
                        {attempt.passed ? '✓ Lulus' : '✗ Perlu Ulang'}
                      </Text>
                    </View>
                    <Text style={[styles.recentDate, { color: themeColors.textSecondary }]}>
                      {formatDate(attempt.completedAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </AppCard>
        ) : (
          <AppCard style={styles.completedAllCard}>
            <Text style={styles.trophyIcon}>📝</Text>
            <Text style={[styles.completedTitle, { color: themeColors.text }]}>Belum Ada Riwayat</Text>
            <Text style={[styles.completedDesc, { color: themeColors.textSecondary }]}>
              Selesaikan kuis pertama Anda untuk melihat riwayat latihan di sini.
            </Text>
          </AppCard>
        )}
      </View>

      {/* Navigation Footer Actions */}
      <View style={styles.footerNavActions}>
        <AppButton
          title="Daftar Modul Belajar"
          onPress={() => router.replace('/modules' as any)}
          variant="secondary"
          style={styles.navBtn}
        />
        <AppButton
          title="Kembali ke Dashboard"
          onPress={() => router.replace('/dashboard' as any)}
          variant="ghost"
          style={styles.navBtn}
        />
      </View>

      <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
        BioLearn v0.2 • CP-C (Attempt History + Best Score)
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
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrackerCard: {
    padding: Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  recCard: {
    borderLeftWidth: 4,
    gap: Spacing.xs,
    padding: Spacing.lg,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  recDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  recBtn: {
    minHeight: 40,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
  topicsGrid: {
    gap: Spacing.sm,
  },
  topicReviewCard: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  topicEmoji: {
    fontSize: 32,
  },
  topicHeaderText: {
    flex: 1,
    gap: 2,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  topicSubText: {
    fontSize: 12,
    fontWeight: '500',
  },
  topicBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 2,
  },
  reviewBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  topicBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    minHeight: 32,
  },
  completedAllCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  trophyIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  completedDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  listGrid: {
    gap: Spacing.md,
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
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIcon: {
    fontSize: 22,
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
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  moduleMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaVal: {
    fontWeight: '700',
  },
  statusIndicatorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicatorDot: {
    fontSize: 10,
  },
  indicatorLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  scoreBoxLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreBoxVal: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cardActionBtn: {
    flex: 1,
    minHeight: 40,
  },
  nonStudentCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  nonStudentIcon: {
    fontSize: 48,
  },
  nonStudentTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  nonStudentDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  footerNavActions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  navBtn: {
    minHeight: 48,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  recentHistoryCard: {
    padding: Spacing.md,
    gap: 0,
  },
  recentItem: {
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  recentItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentModuleTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: Spacing.sm,
  },
  recentScore: {
    fontSize: 16,
    fontWeight: '800',
  },
  recentItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentMeta: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  recentModeBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  recentStatusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  recentDate: {
    fontSize: 11,
    fontWeight: '500',
  },
});
