import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const setRole = useLearningStore((s) => s.setRole);

  const handleLogin = (role: UserRole) => {
    setRole(role);
    router.replace('/dashboard' as any);
  };

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {/* Header / Logo section */}
      <View style={styles.header}>
        <Text style={styles.logo}>🧬</Text>
        <Text style={[styles.title, { color: themeColors.tint }]}>BioLearn</Text>
        <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
          Belajar Biologi lewat video, ringkasan materi, dan kuis interaktif.
        </Text>
      </View>

      {/* Description Card */}
      <AppCard style={styles.introCard}>
        <Text style={[styles.introTitle, { color: themeColors.text }]}>
          ✨ BioLearn MVP Foundation
        </Text>
        <Text style={[styles.introDesc, { color: themeColors.textSecondary }]}>
          Selamat datang di platform belajar Biologi khusus tingkat SMA. Silakan pilih salah satu
          akun uji coba di bawah untuk menjelajahi aplikasi sesuai peran masing-masing.
        </Text>
      </AppCard>

      {/* Role Selection Container */}
      <View style={styles.roleContainer}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Pilih Peran Demo
        </Text>

        <AppCard style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <Text style={styles.roleIcon}>🎓</Text>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleName, { color: themeColors.text }]}>Siswa</Text>
              <Text style={[styles.roleDesc, { color: themeColors.textSecondary }]}>
                Akses video belajar, membaca ringkasan materi, dan mengerjakan kuis interaktif.
              </Text>
            </View>
          </View>
          <AppButton
            title="Masuk sebagai Siswa"
            onPress={() => handleLogin('student')}
            variant="primary"
          />
        </AppCard>

        <AppCard style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <Text style={styles.roleIcon}>👩‍🏫</Text>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleName, { color: themeColors.text }]}>Guru</Text>
              <Text style={[styles.roleDesc, { color: themeColors.textSecondary }]}>
                Melihat materi, melacak progress kelas, dan memantau rata-rata nilai siswa.
              </Text>
            </View>
          </View>
          <AppButton
            title="Masuk sebagai Guru"
            onPress={() => handleLogin('teacher')}
            variant="secondary"
          />
        </AppCard>

        <AppCard style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <Text style={styles.roleIcon}>⚙️</Text>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleName, { color: themeColors.text }]}>Admin Konten</Text>
              <Text style={[styles.roleDesc, { color: themeColors.textSecondary }]}>
                Mengelola konten Biologi SMA, mengedit kuis, dan memperbarui daftar pemateri.
              </Text>
            </View>
          </View>
          <AppButton
            title="Masuk sebagai Admin"
            onPress={() => handleLogin('admin')}
            variant="ghost"
          />
        </AppCard>
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
    alignItems: 'center',
    textAlign: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  introCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    gap: Spacing.xs,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  introDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  roleContainer: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  roleCard: {
    gap: Spacing.md,
  },
  roleHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleIcon: {
    fontSize: 32,
    marginTop: 2,
  },
  roleInfo: {
    flex: 1,
    gap: 2,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '700',
  },
  roleDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
});
