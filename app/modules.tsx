import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';

export default function ModulesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);

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
        <Text style={[styles.title, { color: themeColors.text }]}>📚 Daftar Modul</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Kurikulum Biologi SMA lengkap dan interaktif.
        </Text>
      </View>

      <AppCard style={styles.infoCard}>
        <Text style={[styles.infoTitle, { color: themeColors.text }]}>
          🚧 Halaman Sedang Dibuat
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Halaman daftar modul belajar terlengkap BioLearn sedang dipersiapkan dan akan diimplementasikan secara penuh pada checkpoint berikutnya.
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Saat ini terdapat **{modules.length} modul belajar** aktif di bank data lokal BioLearn.
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
    borderLeftColor: '#16A34A',
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
