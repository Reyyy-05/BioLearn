import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import DifficultyBadge from '@/components/DifficultyBadge';
import InstructorCard from '@/components/InstructorCard';

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
  const progress = useLearningStore((s) => s.progress);
  const markVideoWatched = useLearningStore((s) => s.markVideoWatched);

  // Find targeted module, instructor & progress
  const module = modules.find((m) => m.id === moduleId);
  const instructor = module
    ? instructors.find((i) => i.id === module.instructorId)
    : null;
  const moduleProgress = module ? progress[module.id] : null;

  // Local state for our high-fidelity premium mock video player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<any>(null);

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

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
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Modul Tidak Ditemukan
          </Text>
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

  // Mock player timer handle
  const handlePlayPause = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);
        timerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= module.videoDuration) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsPlaying(false);
              markVideoWatched(module.id);
              return module.videoDuration;
            }
            return prev + 1;
          });
        }, 1000);
      }, 600);
    }
  };

  // Skip video helper
  const handleSkipForward = () => {
    setCurrentTime((prev) => {
      const next = prev + 30;
      return next >= module.videoDuration ? module.videoDuration : next;
    });
  };

  const handleSkipBackward = () => {
    setCurrentTime((prev) => {
      const next = prev - 30;
      return next <= 0 ? 0 : next;
    });
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
        <Text style={[styles.title, { color: themeColors.text }]}>🔬 Ruang Belajar Mandiri</Text>
      </View>

      {/* Module Overview Card */}
      <AppCard style={styles.overviewCard}>
        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={module.difficulty} />
          <Text style={[styles.gradeBadge, { color: themeColors.textSecondary }]}>
            Kelas {module.grade} • Bab {module.chapter}
          </Text>
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.emojiLogo}>{getModuleEmoji(module.title)}</Text>
          <Text style={[styles.moduleTitle, { color: themeColors.text }]}>
            {module.title}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>{isVideoWatched ? '🟢' : '⚪'}</Text>
            <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>
              Video: {isVideoWatched ? 'Sudah ditonton' : 'Belum ditonton'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>{isCompleted ? '🟢' : '⚪'}</Text>
            <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>
              Modul: {isCompleted ? 'Selesai Belajar' : 'Belum Selesai'}
            </Text>
          </View>
        </View>

        {lastScore !== undefined && lastScore !== null && (
          <View style={[styles.scoreHighlight, { backgroundColor: themeColors.border }]}>
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
              {lastScore} / 100 ({lastScore >= 70 ? 'Lulus KKM' : 'Remidi'})
            </Text>
          </View>
        )}
      </AppCard>

      {/* Section Pemateri */}
      {instructor && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            👩‍🏫 Pemateri Modul Ini
          </Text>
          <InstructorCard instructor={instructor} />
        </View>
      )}

      {/* Section Video Lesson & Interactive Mock Player */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          🎥 Pembahasan Video Materi
        </Text>
        <AppCard style={styles.videoCard}>
          <Text style={[styles.videoTitle, { color: themeColors.text }]}>
            {module.videoTitle}
          </Text>
          <Text style={[styles.videoDurationMeta, { color: themeColors.textSecondary }]}>
            ⏱️ Total Durasi: {formatDuration(module.videoDuration)}
          </Text>

          {/* Premium Mock Player Screen */}
          <View style={[styles.playerContainer, { backgroundColor: '#0F172A' }]}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#4ADE80" />
            ) : isPlaying ? (
              <View style={styles.playingOverlay}>
                <Text style={styles.playingEmoji}>🔬</Text>
                <Text style={styles.playingText}>Menonton Video Biologi...</Text>
              </View>
            ) : (
              <View style={styles.posterOverlay}>
                <Text style={styles.posterIcon}>🎬</Text>
                <Text style={styles.posterText}>Ketuk untuk Memutar Pembahasan</Text>
              </View>
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
                  <Text style={styles.timeCounter}>
                    {formatDuration(currentTime)} / {formatDuration(module.videoDuration)}
                  </Text>
                </View>

                <View style={styles.rightControls}>
                  <Pressable onPress={() => setIsMuted(!isMuted)} style={styles.controlIcon}>
                    <Text style={styles.controlEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
                  </Pressable>
                  <View style={styles.controlIcon}>
                    <Text style={styles.controlEmoji}>📺</Text>
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
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          📝 Ringkasan Materi Biologi
        </Text>
        <AppCard style={styles.summaryCard}>
          <Text style={[styles.summaryText, { color: themeColors.text }]}>
            {module.summary}
          </Text>
        </AppCard>
      </View>

      {/* Section Poin Penting */}
      {module.keyPoints && module.keyPoints.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            📌 Poin-Poin Penting
          </Text>
          <AppCard style={styles.pointsCard}>
            {module.keyPoints.map((point, index) => (
              <View key={index} style={styles.pointRow}>
                <View style={[styles.pointBadge, { backgroundColor: themeColors.tint }]}>
                  <Text style={styles.pointBadgeText}>{index + 1}</Text>
                </View>
                <Text style={[styles.pointText, { color: themeColors.text }]}>
                  {point}
                </Text>
              </View>
            ))}
          </AppCard>
        </View>
      )}

      {/* Section Contoh Penerapan */}
      {module.example && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            💡 Contoh Penerapan Kontekstual
          </Text>
          <AppCard style={styles.exampleCard}>
            <Text style={[styles.exampleTitle, { color: themeColors.tint }]}>
              Penerapan di Kehidupan Sehari-hari:
            </Text>
            <Text style={[styles.exampleText, { color: themeColors.text }]}>
              {module.example}
            </Text>
          </AppCard>
        </View>
      )}

      {/* CTA Bottom Navigation Block */}
      <View style={styles.actionContainer}>
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

      <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
        BioLearn Demo Checklist • Checkpoint 7
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
    fontWeight: '600',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiLogo: {
    fontSize: 36,
  },
  moduleTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    fontSize: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scoreHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  videoCard: {
    gap: Spacing.sm,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  videoDurationMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  playerContainer: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: Spacing.xs,
  },
  posterOverlay: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  posterIcon: {
    fontSize: 48,
  },
  posterText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  playingOverlay: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playingEmoji: {
    fontSize: 48,
  },
  playingText: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '700',
  },
  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  progressTrack: {
    height: 4,
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
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
    padding: 2,
  },
  controlEmoji: {
    fontSize: 15,
  },
  timeCounter: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  watchBtn: {
    marginTop: Spacing.xs,
  },
  summaryCard: {
    padding: Spacing.lg,
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
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pointBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  exampleCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    gap: Spacing.xs,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '700',
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
