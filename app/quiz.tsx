import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';

export default function QuizScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const currentRole = useLearningStore((s) => s.currentRole);
  const questions = useLearningStore((s) => s.questions);

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
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>❓ Latihan & Kuis</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Uji pemahaman Biologi Anda dengan kuis interaktif yang seru.
        </Text>
      </View>

      <AppCard style={styles.infoCard}>
        <Text style={[styles.infoTitle, { color: themeColors.text }]}>
          🚧 Flow Kuis Sedang Dibuat
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Halaman flow pengerjaan kuis interaktif BioLearn beserta grading otomatis dan pembahasannya sedang dipersiapkan dan akan diimplementasikan secara penuh pada checkpoint khusus berikutnya.
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Saat ini terdapat **{questions.length} soal latihan** aktif di database lokal BioLearn.
        </Text>
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
  backButton: {
    marginTop: Spacing.md,
  },
});
