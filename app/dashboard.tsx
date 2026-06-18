import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import ProgressBar from '@/components/ProgressBar';
import DifficultyBadge from '@/components/DifficultyBadge';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Store data
  const currentRole = useLearningStore((s) => s.currentRole);
  const setRole = useLearningStore((s) => s.setRole);
  const modules = useLearningStore((s) => s.modules);
  const instructors = useLearningStore((s) => s.instructors);
  const questions = useLearningStore((s) => s.questions);
  const progress = useLearningStore((s) => s.progress);
  const quizAttempts = useLearningStore((s) => s.quizAttempts);
  const resetDemo = useLearningStore((s) => s.resetDemo);

  // Security check: Redirect back to Login if currentRole is null
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  if (!currentRole) {
    return null;
  }

  // --- Student Dashboard Statistics Calculation ---
  const totalModules = modules.length;
  const completedCount = modules.filter((m) => progress[m.id]?.completed).length;
  const watchedCount = modules.filter((m) => progress[m.id]?.videoWatched).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Find module currently being studied (first uncompleted module)
  const currentModule = modules.find((m) => !progress[m.id]?.completed);
  const currentModuleInstructor = currentModule
    ? instructors.find((i) => i.id === currentModule.instructorId)
    : null;

  // Find latest quiz score from all progress records
  const progressWithScores = Object.values(progress).filter(
    (p) => p.lastScore !== null && p.lastScore !== undefined
  );
  
  // Sort by lastStudiedAt descending to find the latest
  const sortedProgressWithScores = [...progressWithScores].sort((a, b) => {
    const timeA = a.lastStudiedAt ? new Date(a.lastStudiedAt).getTime() : 0;
    const timeB = b.lastStudiedAt ? new Date(b.lastStudiedAt).getTime() : 0;
    return timeB - timeA;
  });

  const latestProgressScore = sortedProgressWithScores[0] || null;
  const latestScoreModule = latestProgressScore
    ? modules.find((m) => m.id === latestProgressScore.moduleId)
    : null;

  // --- Recommendation Logic ---
  const getRecommendation = () => {
    // 1. Check if there are any quiz scores below 70
    const lowScoreProgress = Object.values(progress).find(
      (p) => p.lastScore !== null && p.lastScore !== undefined && p.lastScore < 70
    );

    if (lowScoreProgress) {
      const lowScoreModule = modules.find((m) => m.id === lowScoreProgress.moduleId);
      return {
        title: '⚠️ Perbaiki Nilai Kuis',
        desc: `Skor terakhir Anda di modul "${lowScoreModule?.title || 'Biologi'}" adalah ${lowScoreProgress.lastScore} (di bawah KKM 70). Pelajari kembali ringkasan materinya dan coba kuisnya lagi!`,
        accentColor: themeColors.warning,
      };
    }

    // 2. Recommend next uncompleted module
    if (currentModule) {
      return {
        title: '📖 Lanjutkan Belajar',
        desc: `Yuk lanjut pelajari modul berikutnya: "${currentModule.title}" (${currentModule.difficulty}) bersama ${currentModuleInstructor?.nickname || 'Pemateri'}.`,
        accentColor: themeColors.tint,
      };
    }

    // 3. All modules are completed with >= 70 score
    return {
      title: '🏆 Semua Modul Selesai!',
      desc: 'Selamat! Anda telah menguasai seluruh materi Biologi SMA. Lakukan review materi secara berkala untuk mempertahankan pemahaman Anda.',
      accentColor: themeColors.success,
    };
  };

  const recommendation = getRecommendation();

  // Sapaan / Title based on selected role (for teacher & admin placeholders)
  const getRoleHeaderDetails = () => {
    switch (currentRole) {
      case 'teacher':
        return {
          title: 'Dashboard Guru',
          subtitle: 'Pemantauan kelas, analisis materi, dan evaluasi hasil kuis.',
          badge: '👩‍🏫 Pendidik',
        };
      case 'admin':
        return {
          title: 'Dashboard Admin Konten',
          subtitle: 'Pengelolaan modul belajar, kurikulum SMA, dan bank soal.',
          badge: '⚙️ Administrator',
        };
      case 'student':
      default:
        return {
          title: 'Dashboard Siswa',
          subtitle: 'Materi belajar Biologi terlengkap, video interaktif, dan kuis.',
          badge: '🎓 Siswa SMA',
        };
    }
  };

  const roleDetails = getRoleHeaderDetails();

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {/* ─── ROLE STUDENT DASHBOARD MVP ─── */}
      {currentRole === 'student' ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: themeColors.border }]}>
              <Text style={[styles.badgeText, { color: themeColors.tint }]}>
                {roleDetails.badge}
              </Text>
            </View>
            <Text style={[styles.title, { color: themeColors.text }]}>
              Halo, Siswa BioLearn 👋
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Lanjutkan petualangan belajar Biologi hari ini.
            </Text>
          </View>

          {/* Progress Belajar Ringkasan */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              📈 Ringkasan Belajar Anda
            </Text>
            <AppCard style={styles.summaryCard}>
              <View style={styles.statGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: themeColors.text }]}>
                    {totalModules}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                    Total Modul
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: themeColors.success }]}>
                    {completedCount}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                    Modul Selesai
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: themeColors.tint }]}>
                    {watchedCount}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                    Video Ditonton
                  </Text>
                </View>
              </View>

              <View style={styles.progressWrapper}>
                <ProgressBar value={progressPercent} label="Rata-rata Progress Belajar" />
              </View>
            </AppCard>
          </View>

          {/* Modul Sedang Dipelajari */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              📚 Modul Sedang Dipelajari
            </Text>
            {currentModule ? (
              <AppCard style={styles.learningCard}>
                <View style={styles.learningHeader}>
                  <DifficultyBadge difficulty={currentModule.difficulty} />
                  <Text style={[styles.gradeBadge, { color: themeColors.textSecondary }]}>
                    Kelas {currentModule.grade} • Bab {currentModule.chapter}
                  </Text>
                </View>
                <Text style={[styles.learningTitle, { color: themeColors.text }]}>
                  {currentModule.title}
                </Text>
                <View style={styles.learningFooter}>
                  <Text style={[styles.learningMeta, { color: themeColors.textSecondary }]}>
                    ⏱️ {currentModule.estimatedMinutes} menit belajar • {currentModuleInstructor?.nickname || 'Pemateri'}
                  </Text>
                </View>
              </AppCard>
            ) : (
              <AppCard style={styles.completedAllCard}>
                <Text style={styles.trophyIcon}>🎉</Text>
                <Text style={[styles.completedTitle, { color: themeColors.text }]}>
                  Semua Modul Telah Selesai!
                </Text>
                <Text style={[styles.completedDesc, { color: themeColors.textSecondary }]}>
                  Selamat, Anda telah menamatkan seluruh kurikulum materi Biologi SMA.
                </Text>
              </AppCard>
            )}
          </View>

          {/* Skor Kuis Terakhir */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              💯 Skor Kuis Terakhir
            </Text>
            <AppCard style={styles.scoreCard}>
              {latestProgressScore ? (
                <View style={styles.scoreContent}>
                  <View style={styles.scoreCircle}>
                    <Text
                      style={[
                        styles.scoreNumber,
                        {
                          color:
                            latestProgressScore.lastScore! >= 70
                              ? themeColors.success
                              : themeColors.error,
                        },
                      ]}
                    >
                      {latestProgressScore.lastScore}
                    </Text>
                    <Text style={[styles.scoreLabelMax, { color: themeColors.textSecondary }]}>
                      / 100
                    </Text>
                  </View>
                  <View style={styles.scoreInfo}>
                    <Text style={[styles.scoreModuleTitle, { color: themeColors.text }]}>
                      {latestScoreModule?.title}
                    </Text>
                    <Text style={[styles.scoreStatus, { color: latestProgressScore.lastScore! >= 70 ? themeColors.success : themeColors.error }]}>
                      {latestProgressScore.lastScore! >= 70 ? '🟢 LULUS (KKM 70)' : '🔴 BELUM LULUS'}
                    </Text>
                    {(() => {
                      const moduleAttempts = quizAttempts.filter(
                        (a) => a.moduleId === latestProgressScore.moduleId,
                      );
                      if (moduleAttempts.length === 0) return null;
                      const best = Math.max(...moduleAttempts.map((a) => a.score));
                      return (
                        <Text style={[styles.scoreBestLine, { color: themeColors.textSecondary }]}>
                          Nilai Terbaik: <Text style={{ fontWeight: '800', color: best >= 70 ? themeColors.success : themeColors.error }}>{best}</Text>
                        </Text>
                      );
                    })()}
                  </View>
                </View>
              ) : (
                <View style={styles.noScoreContent}>
                  <Text style={styles.noScoreIcon}>📝</Text>
                  <Text style={[styles.noScoreText, { color: themeColors.textSecondary }]}>
                    Belum ada skor kuis. Selesaikan video materi dan ikuti latihan kuisnya!
                  </Text>
                </View>
              )}
            </AppCard>
          </View>

          {/* Rekomendasi Pintar */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              💡 Rekomendasi Pintar
            </Text>
            <AppCard style={[styles.recCard, { borderLeftColor: recommendation.accentColor }]}>
              <Text style={[styles.recTitle, { color: themeColors.text }]}>
                {recommendation.title}
              </Text>
              <Text style={[styles.recDesc, { color: themeColors.textSecondary }]}>
                {recommendation.desc}
              </Text>
            </AppCard>
          </View>

          {/* Quick Actions / Tombol Navigasi */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              ⚡ Tindakan Cepat
            </Text>
            <View style={styles.actionGrid}>
              <AppButton
                title="📚 Daftar Modul"
                onPress={() => router.replace('/modules' as any)}
                variant="primary"
                style={styles.actionButton}
              />
              <AppButton
                title="📈 Progress Belajar"
                onPress={() => router.replace('/progress' as any)}
                variant="secondary"
                style={styles.actionButton}
              />
              <AppButton
                title="❓ Latihan/Kuis"
                onPress={() => router.replace('/quiz' as any)}
                variant="ghost"
                style={styles.actionButton}
              />
            </View>
          </View>
        </>
      ) : (
        // ─── ROLE TEACHER & ADMIN PLACEHOLDERS ───
        <>
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: themeColors.border }]}>
              <Text style={[styles.badgeText, { color: themeColors.tint }]}>
                {roleDetails.badge}
              </Text>
            </View>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {roleDetails.title}
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              {roleDetails.subtitle}
            </Text>
          </View>

          {/* Basic Summary */}
          <AppCard style={styles.summaryCard}>
            <View style={styles.statGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: themeColors.text }]}>
                  {modules.length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Modul Biologi
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: themeColors.text }]}>
                  {instructors.length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Pemateri Aktif
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: themeColors.text }]}>
                  {questions.length}
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Bank Soal Kuis
                </Text>
              </View>
            </View>
          </AppCard>

          {/* Placeholder Message */}
          <AppCard style={styles.placeholderCard}>
            <Text style={styles.placeholderIcon}>🛠️</Text>
            <Text style={[styles.placeholderTitle, { color: themeColors.text }]}>
              Fitur Guru & Admin Sedang Dikembangkan
            </Text>
            <Text style={[styles.placeholderDesc, { color: themeColors.textSecondary }]}>
              Untuk saat ini, MVP BioLearn difokuskan secara mendalam pada fungsionalitas **Dashboard Siswa**.
            </Text>
            <Text style={[styles.placeholderDesc, { color: themeColors.textSecondary }]}>
              Akses panel analisis guru dan kontrol admin konten kurikulum akan diaktifkan pada pengembangan tingkat lanjut berikutnya.
            </Text>
          </AppCard>
        </>
      )}

      {/* Logout / Switch Role Option */}
      <View style={styles.logoutWrapper}>
        <AppButton
          title="🔄 Reset Progress Demo"
          onPress={() => resetDemo()}
          variant="ghost"
          style={styles.logoutButton}
        />
        <AppButton
          title="Keluar / Ganti Peran Demo"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />
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
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  summaryCard: {
    gap: Spacing.md,
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressWrapper: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  learningCard: {
    gap: Spacing.xs,
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  gradeBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  learningTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  learningFooter: {
    marginTop: 4,
  },
  learningMeta: {
    fontSize: 13,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '700',
  },
  completedDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  scoreCard: {
    padding: Spacing.md,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  scoreLabelMax: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: -2,
  },
  scoreInfo: {
    flex: 1,
    gap: 4,
  },
  scoreModuleTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  scoreStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreBestLine: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  noScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  noScoreIcon: {
    fontSize: 28,
  },
  noScoreText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  recCard: {
    borderLeftWidth: 4,
    gap: Spacing.xs,
    padding: Spacing.md,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  recDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionGrid: {
    gap: Spacing.sm,
  },
  actionButton: {
    minHeight: 44,
  },
  placeholderCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  placeholderIcon: {
    fontSize: 48,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  placeholderDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  logoutWrapper: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  logoutButton: {
    minHeight: 48,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
});
