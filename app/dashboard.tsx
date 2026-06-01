import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';

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

  // Security check: Redirect back to Login if currentRole is null
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  // If redirecting, render empty view to avoid flicker or layout shifts
  if (!currentRole) {
    return null;
  }

  // Sapaan / Title based on selected role
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
      {/* Sapaan Header */}
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

      {/* Store Data Summary Card */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Ringkasan Data Demo
        </Text>
        <AppCard style={styles.summaryCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {modules.length}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                Modul Biologi
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👩‍🏫</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {instructors.length}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                Pemateri Aktif
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❓</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {questions.length}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                Bank Soal Kuis
              </Text>
            </View>
          </View>
        </AppCard>
      </View>

      {/* Placeholder MVP Info */}
      <AppCard style={styles.infoCard}>
        <Text style={[styles.infoTitle, { color: themeColors.text }]}>
          💡 Informasi Pengembangan MVP
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Halaman ini merupakan placeholder dashboard untuk mendemonstrasikan bahwa alur login
          dummy berbasis peran (*role-based dummy login*) telah terhubung dengan Zustand state
          store secara sempurna.
        </Text>
        <Text style={[styles.infoDesc, { color: themeColors.textSecondary }]}>
          Di checkpoint berikutnya, kita akan membuka modul belajar interaktif sesungguhnya
          berdasarkan peran yang Anda pilih saat ini.
        </Text>
      </AppCard>

      {/* Action / Logout button */}
      <View style={styles.actionContainer}>
        <AppButton
          title="Keluar / Ganti Peran Demo"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>

      <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
        BioLearn Demo Checklist • Checkpoint 4
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
    borderRadius: 6,
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
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  summaryCard: {
    paddingVertical: Spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    gap: Spacing.sm,
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
    marginTop: Spacing.md,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
});
