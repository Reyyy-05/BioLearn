import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';

export default function QuizScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Fetch parameters
  const { moduleId } = useLocalSearchParams();

  // Store connection
  const currentRole = useLearningStore((s) => s.currentRole);
  const questions = useLearningStore((s) => s.questions);
  const modules = useLearningStore((s) => s.modules);

  // Guard routing
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  if (!currentRole) {
    return null;
  }

  // Find module details if moduleId is supplied
  const targetModule = moduleId ? modules.find((m) => m.id === moduleId) : null;
  const moduleQuestions = targetModule
    ? questions.filter((q) => q.moduleId === targetModule.id)
    : [];

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {targetModule ? (
        // ─── MODULE-SPECIFIC QUIZ PLACEHOLDER ───
        <>
          <View style={styles.header}>
            <AppButton
              title="⬅️ Detail Modul"
              onPress={() =>
                router.replace({
                  pathname: '/module-detail' as any,
                  params: { moduleId: targetModule.id },
                })
              }
              variant="ghost"
              style={styles.backBtn}
            />
            <Text style={[styles.title, { color: themeColors.text }]}>❓ Latihan Kuis Interaktif</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Modul: {targetModule.title} (Kelas {targetModule.grade} • Bab {targetModule.chapter})
            </Text>
          </View>

          <AppCard style={styles.infoCard}>
            <Text style={[styles.infoTitle, { color: themeColors.text }]}>
              🚀 Evaluasi Belajar Mandiri: {targetModule.title}
            </Text>
            <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
              Halaman ujian kuis interaktif yang seru untuk menguji pemahaman materi **"{targetModule.title}"** sedang dipersiapkan.
            </Text>
            <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
              Sistem akan secara otomatis memuat **{moduleQuestions.length} butir soal** pilihan ganda, grading otomatis berstandar KKM (70), serta menyajikan pembahasan lengkap di checkpoint khusus berikutnya!
            </Text>
          </AppCard>

          <View style={styles.actionContainer}>
            <AppButton
              title="Kembali ke Detail Modul"
              onPress={() =>
                router.replace({
                  pathname: '/module-detail' as any,
                  params: { moduleId: targetModule.id },
                })
              }
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
        </>
      ) : (
        // ─── GENERAL QUIZ BANK PLACEHOLDER ───
        <>
          <View style={styles.header}>
            <AppButton
              title="⬅️ Dashboard"
              onPress={() => router.replace('/dashboard' as any)}
              variant="ghost"
              style={styles.backBtn}
            />
            <Text style={[styles.title, { color: themeColors.text }]}>❓ Bank Soal Kuis</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Uji pemahaman biologi umum Anda lewat pustaka evaluasi mandiri.
            </Text>
          </View>

          <AppCard style={styles.infoCard}>
            <Text style={[styles.infoTitle, { color: themeColors.text }]}>
              🚧 Ruang Bank Soal BioLearn
            </Text>
            <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
              Ruang pengerjaan kuis umum ini sedang disinkronisasikan ke dalam sistem pembelajaran adaptif.
            </Text>
            <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
              Saat ini, database BioLearn menyimpan total **{questions.length} butir soal aktif** yang terbagi rata di setiap bab Biologi SMA.
            </Text>
          </AppCard>

          <AppButton
            title="Kembali ke Dashboard"
            onPress={() => router.replace('/dashboard' as any)}
            variant="primary"
            style={styles.backBtnAction}
          />
        </>
      )}

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
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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
  },
  actionContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    minHeight: 48,
  },
  backBtnAction: {
    marginTop: Spacing.md,
    minHeight: 48,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
});
