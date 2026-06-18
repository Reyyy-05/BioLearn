import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import ProgressBar from '@/components/ProgressBar';

export default function QuizResultScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Parameters
  const { moduleId } = useLocalSearchParams();

  // Store data
  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const progress = useLearningStore((s) => s.progress);
  const lastQuizResult = useLearningStore((s) => s.lastQuizResult);
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

  const moduleIdStr = typeof moduleId === 'string' ? moduleId : '';
  const module = modules.find((m) => m.id === moduleIdStr);
  const moduleProgress = module ? progress[module.id] : null;

  // 1. Guard check if module is not found
  if (!module) {
    return (
      <ScreenContainer style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Modul Tidak Ditemukan
          </Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Maaf, modul belajar tidak dapat ditemukan di database BioLearn.
          </Text>
          <AppButton
            title="Daftar Modul"
            onPress={() => router.replace('/modules' as any)}
            variant="primary"
            style={styles.fullWidth}
          />
        </AppCard>
      </ScreenContainer>
    );
  }

  // 2. Guard check if lastQuizResult is empty or mismatched
  const hasResult = lastQuizResult && lastQuizResult.moduleId === module.id;

  if (!hasResult) {
    return (
      <ScreenContainer style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>📝</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Belum Ada Hasil Kuis
          </Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Belum ada hasil kuis tersimpan untuk modul "{module.title}". Silakan ikuti kuis terlebih dahulu.
          </Text>
          <View style={styles.buttonStack}>
            <AppButton
              title="Mulai Kuis"
              onPress={() =>
                router.replace({
                  pathname: '/quiz' as any,
                  params: { moduleId: module.id },
                })
              }
              variant="primary"
              style={styles.fullWidth}
            />
            <AppButton
              title="Kembali ke Detail Modul"
              onPress={() =>
                router.replace({
                  pathname: '/module-detail' as any,
                  params: { moduleId: module.id },
                })
              }
              variant="secondary"
              style={styles.fullWidth}
            />
          </View>
        </AppCard>
      </ScreenContainer>
    );
  }

  // Guaranteed non-null lastQuizResult and module progress
  const result = lastQuizResult!;
  const score = result.score;
  const isPassed = result.passed;
  const attempts = moduleProgress?.attempts ?? 1;
  const isVideoWatched = moduleProgress?.videoWatched ?? false;

  // Attempt history for this module (newest first)
  const moduleAttempts = quizAttempts
    .filter((a) => a.moduleId === module.id)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  const bestScore = moduleAttempts.length > 0 ? Math.max(...moduleAttempts.map((a) => a.score)) : score;
  const attemptNumber = moduleAttempts.length || 1;
  const previousAttempt = moduleAttempts.length >= 2 ? moduleAttempts[1] : null;
  const scoreDelta = previousAttempt ? score - previousAttempt.score : null;
  const recentAttempts = moduleAttempts.slice(0, 3);

  // Format study timestamp safely
  const formatStudiedDate = (isoString: string | null | undefined): string => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  // Get Smart Advice based on status combination
  const getSmartAdvice = () => {
    if (isPassed && isVideoWatched) {
      return {
        title: '🏆 Sempurna! Modul Selesai',
        desc: 'Bagus sekali! Anda telah menonton video pembelajaran dan melulusi kuis di atas KKM (70). Modul ini sekarang ditandai selesai sepenuhnya!',
        color: themeColors.success,
      };
    }
    if (isPassed && !isVideoWatched) {
      return {
        title: '⚠️ Tonton Video Pembahasan',
        desc: 'Skor kuis Anda sudah lulus KKM (70), namun modul belum dianggap selesai penuh karena Anda belum menandai video pembelajaran sebagai "Sudah ditonton". Silakan kembali ke ruang belajar dan selesaikan video.',
        color: themeColors.warning,
      };
    }
    // Failed (< 70)
    return {
      title: '📖 Tetap Semangat, Coba Lagi!',
      desc: 'Skor Anda saat ini belum melampaui KKM kelulusan (70). Silakan baca kembali ringkasan materi biologi di ruang belajar, pahami penjelasannya, dan ulangi latihan kuis ini.',
      color: themeColors.error,
    };
  };

  const advice = getSmartAdvice();

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>🏆 Hasil Kuis Evaluasi</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Modul: {module.title}
        </Text>
      </View>

      {/* Main Score Board Card */}
      <AppCard style={styles.resultCard}>
        <View style={styles.scoreCircleWrapper}>
          <View
            style={[
              styles.scoreCircle,
              {
                borderColor: isPassed ? themeColors.success : themeColors.error,
              },
            ]}
          >
            <Text style={[styles.scoreValueText, { color: isPassed ? themeColors.success : themeColors.error }]}>
              {score}
            </Text>
            <Text style={[styles.scoreMaxLabel, { color: themeColors.textSecondary }]}>/ 100</Text>
          </View>
          <View style={styles.scoreMetaInfo}>
            <Text
              style={[
                styles.statusBadge,
                {
                  color: isPassed ? themeColors.success : themeColors.error,
                  backgroundColor: isPassed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                },
              ]}
            >
              {isPassed ? '🟢 LULUS KKM' : '🔴 PERLU ULANG'}
            </Text>
            <Text style={[styles.scoreRatio, { color: themeColors.text }]}>
              Jawaban Benar: <Text style={styles.boldText}>{result.correctCount}</Text> dari{' '}
              <Text style={styles.boldText}>{result.totalQuestions}</Text> Soal
            </Text>
          </View>
        </View>

        {/* Score delta indicator */}
        {scoreDelta !== null && (
          <View style={styles.deltaRow}>
            <Text
              style={[
                styles.deltaText,
                { color: scoreDelta > 0 ? themeColors.success : scoreDelta < 0 ? themeColors.error : themeColors.textSecondary },
              ]}
            >
              {scoreDelta > 0 ? `▲ +${scoreDelta}` : scoreDelta < 0 ? `▼ ${scoreDelta}` : '= Sama'} dari percobaan sebelumnya
            </Text>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        {/* Statistical details */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Mode Kuis</Text>
            <Text style={[styles.statValue, { color: result.mode === 'exam' ? themeColors.warning : themeColors.success }]}>
              {result.mode === 'exam' ? 'Ujian' : 'Latihan'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Percobaan</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>Ke-{attemptNumber}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Nilai Terbaik</Text>
            <Text style={[styles.statValue, { color: bestScore >= 70 ? themeColors.success : themeColors.error }]}>
              {bestScore}
            </Text>
          </View>
        </View>

        {/* Score visual progress bar */}
        <View style={styles.progressWrapper}>
          <ProgressBar value={score} label="Peta Skor Pencapaian" />
        </View>
      </AppCard>

      {/* Smart Recommendation Alert */}
      <AppCard style={[styles.adviceCard, { borderLeftColor: advice.color }]}>
        <Text style={[styles.adviceTitle, { color: themeColors.text }]}>{advice.title}</Text>
        <Text style={[styles.adviceDesc, { color: themeColors.textSecondary }]}>{advice.desc}</Text>
      </AppCard>

      {/* Exam Mode Info Alert */}
      {result.mode === 'exam' && (
        <AppCard style={[styles.adviceCard, { borderLeftColor: themeColors.tint, backgroundColor: 'rgba(59, 130, 246, 0.05)' }]}>
          <Text style={[styles.adviceTitle, { color: themeColors.text }]}>ℹ️ Informasi Hasil Mode Ujian</Text>
          <Text style={[styles.adviceDesc, { color: themeColors.textSecondary }]}>
            Pada Mode Ujian, koreksi dan penjelasan untuk masing-masing soal sengaja tidak ditampilkan selama kuis berlangsung demi melatih kemandirian belajar. Hasil evaluasi di atas adalah rangkuman dari seluruh jawaban Anda.
          </Text>
        </AppCard>
      )}

      {/* Attempt History Card */}
      <AppCard style={styles.historyCard}>
        <Text style={[styles.historyTitle, { color: themeColors.text }]}>📊 Riwayat Percobaan</Text>
        {recentAttempts.length > 1 ? (
          <View style={styles.historyList}>
            {recentAttempts.map((attempt, index) => (
              <View
                key={attempt.id}
                style={[
                  styles.historyItem,
                  index < recentAttempts.length - 1 && { borderBottomWidth: 1, borderBottomColor: themeColors.border },
                ]}
              >
                <View style={styles.historyItemLeft}>
                  <Text
                    style={[
                      styles.historyModeBadge,
                      {
                        color: attempt.mode === 'exam' ? themeColors.warning : themeColors.tint,
                        backgroundColor: attempt.mode === 'exam' ? 'rgba(245,158,11,0.1)' : 'rgba(22,163,74,0.1)',
                      },
                    ]}
                  >
                    {attempt.mode === 'exam' ? 'Ujian' : 'Latihan'}
                  </Text>
                  <Text style={[styles.historyDate, { color: themeColors.textSecondary }]}>
                    {formatStudiedDate(attempt.completedAt)}
                  </Text>
                </View>
                <View style={styles.historyItemRight}>
                  <Text
                    style={[
                      styles.historyScore,
                      { color: attempt.passed ? themeColors.success : themeColors.error },
                    ]}
                  >
                    {attempt.score}
                  </Text>
                  <Text
                    style={[
                      styles.historyStatus,
                      { color: attempt.passed ? themeColors.success : themeColors.error },
                    ]}
                  >
                    {attempt.passed ? '✓ Lulus' : '✗ Perlu Ulang'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.historyEmpty, { color: themeColors.textSecondary }]}>
            Ini adalah percobaan pertama Anda untuk modul ini. Riwayat akan muncul setelah percobaan berikutnya.
          </Text>
        )}
      </AppCard>

      {/* Navigation action buttons stack */}
      <View style={styles.buttonStackContainer}>
        <AppButton
          title="Ulangi Kuis"
          onPress={() =>
            router.replace({
              pathname: '/quiz' as any,
              params: { moduleId: module.id },
            })
          }
          variant="primary"
          style={styles.actionBtn}
        />
        <AppButton
          title="Kembali ke Detail Modul"
          onPress={() =>
            router.replace({
              pathname: '/module-detail' as any,
              params: { moduleId: module.id },
            })
          }
          variant="secondary"
          style={styles.actionBtn}
        />
        <View style={styles.rowActions}>
          <AppButton
            title="Daftar Modul"
            onPress={() => router.replace('/modules' as any)}
            variant="ghost"
            style={styles.halfBtn}
          />
          <AppButton
            title="Dashboard"
            onPress={() => router.replace('/dashboard' as any)}
            variant="ghost"
            style={styles.halfBtn}
          />
        </View>
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
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
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
    marginBottom: Spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  buttonStack: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  resultCard: {
    gap: Spacing.md,
  },
  scoreCircleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValueText: {
    fontSize: 24,
    fontWeight: '800',
  },
  scoreMaxLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -2,
  },
  scoreMetaInfo: {
    flex: 1,
    gap: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  scoreRatio: {
    fontSize: 14,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressWrapper: {
    marginTop: Spacing.xs,
  },
  adviceCard: {
    borderLeftWidth: 4,
    gap: Spacing.xs,
    padding: Spacing.lg,
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  adviceDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonStackContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    minHeight: 48,
  },
  rowActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfBtn: {
    flex: 1,
    minHeight: 44,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  deltaRow: {
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  historyCard: {
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  historyList: {
    gap: 0,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  historyItemLeft: {
    gap: 2,
  },
  historyModeBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  historyDate: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  historyItemRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  historyScore: {
    fontSize: 18,
    fontWeight: '800',
  },
  historyStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  historyEmpty: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
