import AppButton from '@/components/AppButton';
import AppCard from '@/components/AppCard';
import DifficultyBadge from '@/components/DifficultyBadge';
import InstructorCard from '@/components/InstructorCard';
import ScreenContainer from '@/components/ScreenContainer';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function ModuleDetailScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Parameters
  const { moduleId } = useLocalSearchParams();
  const selectedModuleId = Array.isArray(moduleId) ? moduleId[0] : moduleId;

  // Store connection
  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const instructors = useLearningStore((s) => s.instructors);
  const progress = useLearningStore((s) => s.progress);
  const markVideoWatched = useLearningStore((s) => s.markVideoWatched);

  // Find targeted module, instructor & progress
  const module = modules.find((m) => m.id === selectedModuleId);
  const instructor = module
    ? instructors.find((i) => i.id === module.instructorId)
    : null;
  const moduleProgress = module ? progress[module.id] : null;

  // Local state for our high-fidelity premium mock video player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole, router]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!currentRole) {
    return null;
  }

  if (!module) {
    return (
      <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>Modul Tidak Ditemukan</Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Maaf, modul belajar yang Anda cari tidak tersedia di kurikulum BioLearn saat ini.
          </Text>
          <AppButton
            title="Daftar Modul"
            onPress={() => router.replace('/modules' as any)}
            variant="primary"
          />
        </AppCard>
      </ScreenContainer>
    );
  }

  const isCompleted = moduleProgress?.completed ?? false;
  const isVideoWatched = moduleProgress?.videoWatched ?? false;
  const lastScore = moduleProgress?.lastScore;
  const normalizedScore = typeof lastScore === 'number' ? Math.min(Math.max(lastScore, 0), 100) : 0;
  const learningProgressPercent = Math.round(
    (isVideoWatched ? 35 : 0) + (isCompleted ? 35 : 0) + normalizedScore * 0.3,
  );
  const remainingSeconds = Math.max(module.videoDuration - currentTime, 0);

  // Formatting helpers
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Mock player timer handle
  const handlePlayPause = () => {
    if (isLoading) return;

    if (isPlaying) {
      stopTimer();
      setIsPlaying(false);
      return;
    }

    if (currentTime >= module.videoDuration) {
      setCurrentTime(0);
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);

      stopTimer();
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= module.videoDuration) {
            stopTimer();
            setIsPlaying(false);
            markVideoWatched(module.id);
            return module.videoDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }, 600);
  };

  // Skip video helper
  const handleSkipForward = () => {
    setCurrentTime((prev) => {
      const next = prev + 30;
      if (next >= module.videoDuration) {
        stopTimer();
        setIsPlaying(false);
        markVideoWatched(module.id);
        return module.videoDuration;
      }
      return next;
    });
  };

  const handleSkipBackward = () => {
    setCurrentTime((prev) => {
      const next = prev - 30;
      return next <= 0 ? 0 : next;
    });
  };

  const handleReplay = () => {
    stopTimer();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progressPercent = module.videoDuration > 0 ? (currentTime / module.videoDuration) * 100 : 0;

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
      </View>

      {/* Premium Hero */}
      <View style={styles.heroShell}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />
        <View style={styles.heroContent}>
          <View style={styles.heroBadgeRow}>
            <Text style={styles.heroBadge}>BioLearn Lab</Text>
            <Text style={styles.heroBadge}>Mandiri</Text>
          </View>

          <View style={styles.heroMainRow}>
            <View style={styles.heroIconBox}>
              <Text style={styles.heroEmoji}>{getModuleEmoji(module.title)}</Text>
            </View>
            <View style={styles.heroTitleBlock}>
              <Text style={styles.heroKicker}>Ruang Belajar Mandiri</Text>
              <Text style={styles.heroTitle}>{module.title}</Text>
              <Text style={styles.heroSubTitle}>
                Kelas {module.grade} • Bab {module.chapter} • {formatDuration(module.videoDuration)} video
              </Text>
            </View>
          </View>

          <View style={styles.heroProgressCard}>
            <View style={styles.heroProgressTop}>
              <Text style={styles.heroProgressLabel}>Progress Belajar</Text>
              <Text style={styles.heroProgressValue}>{learningProgressPercent}%</Text>
            </View>
            <View style={styles.heroProgressTrack}>
              <View style={[styles.heroProgressFill, { width: `${learningProgressPercent}%` }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Module Overview Card */}
      <AppCard style={styles.overviewCard}>
        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={module.difficulty} />
          <Text style={[styles.gradeBadge, { color: themeColors.textSecondary }]}>Kelas {module.grade} • Bab {module.chapter}</Text>
        </View>

        <View style={styles.learningPathCard}>
          <View style={styles.pathStep}>
            <Text style={styles.pathIcon}>{isVideoWatched ? '✅' : '▶️'}</Text>
            <Text style={[styles.pathLabel, { color: '#0F172A' }]}>Video</Text>
          </View>
          <View style={styles.pathLine} />
          <View style={styles.pathStep}>
            <Text style={styles.pathIcon}>📚</Text>
            <Text style={[styles.pathLabel, { color: '#0F172A' }]}>Materi</Text>
          </View>
          <View style={styles.pathLine} />
          <View style={styles.pathStep}>
            <Text style={styles.pathIcon}>{lastScore !== undefined && lastScore !== null ? '💯' : '✍️'}</Text>
            <Text style={[styles.pathLabel, { color: '#0F172A' }]}>Kuis</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        <View style={styles.statusGrid}>
          <View style={[styles.statusPill, { borderColor: themeColors.border }]}>
            <Text style={styles.statusIcon}>{isVideoWatched ? '🟢' : '⚪'}</Text>
            <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>Video: {isVideoWatched ? 'Sudah ditonton' : 'Belum ditonton'}</Text>
          </View>
          <View style={[styles.statusPill, { borderColor: themeColors.border }]}>
            <Text style={styles.statusIcon}>{isCompleted ? '🟢' : '⚪'}</Text>
            <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>Modul: {isCompleted ? 'Selesai Belajar' : 'Belum Selesai'}</Text>
          </View>
        </View>

        {lastScore !== undefined && lastScore !== null && (
          <View style={[styles.scoreHighlight, { backgroundColor: lastScore >= 70 ? '#DCFCE7' : '#FEE2E2' }]}>
            <View>
              <Text style={[styles.scoreLabel, { color: '#0F172A' }]}>💯 Skor Kuis Terakhir</Text>
              <Text style={styles.scoreHint}>{lastScore >= 70 ? 'Pertahankan ritmenya.' : 'Ulangi video dan ringkasan dulu.'}</Text>
            </View>
            <Text style={[styles.scoreValue, { color: lastScore >= 70 ? '#16A34A' : '#DC2626' }]}>
              {lastScore}/100
            </Text>
          </View>
        )}
      </AppCard>

      {/* Section Pemateri */}
      {instructor && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>👩‍🏫 Pemateri Modul Ini</Text>
            <Text style={styles.sectionChip}>Verified</Text>
          </View>
          <InstructorCard instructor={instructor} />
        </View>
      )}

      {/* Section Video Lesson & Interactive Mock Player */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>🎥 Pembahasan Video Materi</Text>
          <Text style={styles.sectionChip}>Simulasi</Text>
        </View>
        <AppCard style={styles.videoCard}>
          <View style={styles.videoTopRow}>
            <View style={styles.videoTitleBlock}>
              <Text style={[styles.videoTitle, { color: themeColors.text }]}>{module.videoTitle}</Text>
              <Text style={[styles.videoDurationMeta, { color: themeColors.textSecondary }]}>
                ⏱️ Total Durasi: {formatDuration(module.videoDuration)} • Sisa: {formatDuration(remainingSeconds)}
              </Text>
            </View>
            <Pressable onPress={handleReplay} style={styles.replayChip}>
              <Text style={styles.replayText}>↻ Ulang</Text>
            </Pressable>
          </View>

          {/* Premium Mock Player Screen */}
          <View style={[styles.playerContainer, { backgroundColor: '#0F172A' }]}>
            <View style={styles.playerGridLineOne} />
            <View style={styles.playerGridLineTwo} />
            <View style={styles.playerGlow} />

            {isLoading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#4ADE80" />
                <Text style={styles.loadingText}>Menyiapkan ruang belajar...</Text>
              </View>
            ) : isPlaying ? (
              <View style={styles.playingOverlay}>
                <View style={styles.playingPulse}>
                  <Text style={styles.playingEmoji}>🔬</Text>
                </View>
                <Text style={styles.playingText}>Menonton Video Biologi...</Text>
                <Text style={styles.playingSubText}>Fokus ke konsep inti, nanti lanjut kuis.</Text>
              </View>
            ) : (
              <Pressable onPress={handlePlayPause} style={styles.posterOverlay}>
                <View style={styles.bigPlayButton}>
                  <Text style={styles.bigPlayIcon}>▶️</Text>
                </View>
                <Text style={styles.posterText}>Ketuk untuk Memutar Pembahasan</Text>
                <Text style={styles.posterHint}>Player demo dengan progress otomatis</Text>
              </Pressable>
            )}

            {/* Custom Premium Controls Bar */}
            <View style={styles.controlsBar}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>

              <View style={styles.controlsRow}>
                <View style={styles.leftControls}>
                  <Pressable onPress={handlePlayPause} style={styles.controlIcon}>
                    <Text style={styles.controlEmoji}>{isPlaying ? '⏸️' : '▶️'}</Text>
                  </Pressable>
                  <Pressable onPress={handleSkipBackward} style={styles.controlIcon}>
                    <Text style={styles.controlEmoji}>⏪</Text>
                  </Pressable>
                  <Pressable onPress={handleSkipForward} style={styles.controlIcon}>
                    <Text style={styles.controlEmoji}>⏩</Text>
                  </Pressable>
                  <Text style={styles.timeCounter}>{formatDuration(currentTime)} / {formatDuration(module.videoDuration)}</Text>
                </View>

                <View style={styles.rightControls}>
                  <Pressable onPress={() => setIsMuted(!isMuted)} style={styles.controlIcon}>
                    <Text style={styles.controlEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
                  </Pressable>
                  <View style={styles.qualityPill}>
                    <Text style={styles.qualityText}>HD</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Tandai Video Ditonton Button */}
          <AppButton
            title={isVideoWatched ? '✅ Video Sudah Ditonton' : 'Tandai Video Selesai Ditonton'}
            onPress={() => markVideoWatched(module.id)}
            variant={isVideoWatched ? 'secondary' : 'primary'}
            disabled={isVideoWatched}
            style={styles.watchBtn}
          />
        </AppCard>
      </View>

      {/* Section Ringkasan Materi */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>📝 Ringkasan Materi Biologi</Text>
          <Text style={styles.sectionChip}>Core Notes</Text>
        </View>
        <AppCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryIcon}>🧠</Text>
            <Text style={[styles.summaryHeaderText, { color: themeColors.text }]}>Inti yang perlu kamu pahami</Text>
          </View>
          <Text style={[styles.summaryText, { color: themeColors.text }]}>{module.summary}</Text>
        </AppCard>
      </View>

      {/* Section Poin Penting */}
      {module.keyPoints && module.keyPoints.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>📌 Poin-Poin Penting</Text>
            <Text style={styles.sectionChip}>{module.keyPoints.length} poin</Text>
          </View>
          <AppCard style={styles.pointsCard}>
            {module.keyPoints.map((point, index) => (
              <View key={index} style={styles.pointRow}>
                <View style={[styles.pointBadge, { backgroundColor: '#15803D' }]}>
                  <Text style={styles.pointBadgeText}>{index + 1}</Text>
                </View>
                <Text style={[styles.pointText, { color: themeColors.text }]}>{point}</Text>
              </View>
            ))}
          </AppCard>
        </View>
      )}

      {/* Section Contoh Penerapan */}
      {module.example && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>💡 Contoh Penerapan Kontekstual</Text>
            <Text style={styles.sectionChip}>Real Life</Text>
          </View>
          <AppCard style={styles.exampleCard}>
            <Text style={[styles.exampleTitle, { color: '#047857' }]}>Penerapan di Kehidupan Sehari-hari:</Text>
            <Text style={[styles.exampleText, { color: '#064E3B' }]}>{module.example}</Text>
          </AppCard>
        </View>
      )}

      {/* CTA Bottom Navigation Block */}
      <View style={styles.actionContainer}>
        <View style={styles.ctaDecorCard}>
          <Text style={styles.ctaIcon}>🚀</Text>
          <View style={styles.ctaTextBlock}>
            <Text style={styles.ctaTitle}>Siap uji pemahaman?</Text>
            <Text style={styles.ctaDesc}>Kuis akan memakai modul yang sedang kamu buka.</Text>
          </View>
        </View>
        <AppButton
          title="✍️ Mulai Kuis Interaktif"
          onPress={() =>
            router.push({
              pathname: '/quiz' as any,
              params: { moduleId: module.id },
            })
          }
          variant="primary"
          style={styles.actionBtn}
        />
        <AppButton
          title="Daftar Modul Biologi"
          onPress={() => router.replace('/modules' as any)}
          variant="secondary"
          style={styles.actionBtn}
        />
        <AppButton
          title="Kembali ke Dashboard"
          onPress={() => router.replace('/dashboard' as any)}
          variant="ghost"
          style={styles.actionBtn}
        />
      </View>

      <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>BioLearn Demo Checklist • Checkpoint 10 (Final MVP)</Text>
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
  heroShell: {
    minHeight: 238,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGlowOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(74, 222, 128, 0.28)',
    top: -52,
    right: -48,
  },
  heroGlowTwo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(56, 189, 248, 0.22)',
    bottom: -46,
    left: -42,
  },
  heroContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    gap: Spacing.lg,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroBadge: {
    color: '#BBF7D0',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 38,
  },
  heroTitleBlock: {
    flex: 1,
    gap: 4,
  },
  heroKicker: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: -0.7,
  },
  heroSubTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  heroProgressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  heroProgressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroProgressLabel: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
  },
  heroProgressValue: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '900',
  },
  heroProgressTrack: {
    height: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#4ADE80',
    borderRadius: Radius.full,
  },
  overviewCard: {
    gap: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  learningPathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  pathStep: {
    alignItems: 'center',
    gap: 6,
    minWidth: 64,
  },
  pathIcon: {
    fontSize: 22,
  },
  pathLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  pathLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#94A3B8',
    marginHorizontal: 2,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statusIcon: {
    fontSize: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scoreHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  scoreHint: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 17,
    fontWeight: '900',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionChip: {
    color: '#064E3B',
    backgroundColor: '#D1FAE5',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
  },
  videoCard: {
    gap: Spacing.sm,
  },
  videoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  videoTitleBlock: {
    flex: 1,
    gap: 4,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  videoDurationMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  replayChip: {
    backgroundColor: '#E2E8F0',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  replayText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },
  playerContainer: {
    height: 220,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: Spacing.xs,
  },
  playerGridLineOne: {
    position: 'absolute',
    width: '130%',
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
    top: 62,
    transform: [{ rotate: '-12deg' }],
  },
  playerGridLineTwo: {
    position: 'absolute',
    width: '130%',
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    bottom: 88,
    transform: [{ rotate: '12deg' }],
  },
  playerGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(22, 163, 74, 0.22)',
  },
  loadingOverlay: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    color: '#BBF7D0',
    fontSize: 12,
    fontWeight: '800',
  },
  posterOverlay: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  bigPlayButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigPlayIcon: {
    fontSize: 28,
    marginLeft: 3,
  },
  posterText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '900',
  },
  posterHint: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  playingOverlay: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 24,
  },
  playingPulse: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(74, 222, 128, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingEmoji: {
    fontSize: 42,
  },
  playingText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '900',
  },
  playingSubText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  progressTrack: {
    height: 5,
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  controlIcon: {
    padding: 3,
  },
  controlEmoji: {
    fontSize: 15,
  },
  qualityPill: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qualityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  timeCounter: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  watchBtn: {
    marginTop: Spacing.xs,
  },
  summaryCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryIcon: {
    fontSize: 22,
  },
  summaryHeaderText: {
    fontSize: 14,
    fontWeight: '900',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  pointsCard: {
    gap: Spacing.md,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  pointBadge: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pointBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  exampleCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    gap: Spacing.xs,
    backgroundColor: '#F0FDF4',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  actionContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  ctaDecorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    padding: Spacing.md,
  },
  ctaIcon: {
    fontSize: 32,
  },
  ctaTextBlock: {
    flex: 1,
    gap: 2,
  },
  ctaTitle: {
    color: '#064E3B',
    fontSize: 15,
    fontWeight: '900',
  },
  ctaDesc: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
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