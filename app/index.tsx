import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';

export default function HomeScreen() {
  const modules = useLearningStore((s) => s.modules);
  const instructors = useLearningStore((s) => s.instructors);
  const questions = useLearningStore((s) => s.questions);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🧬</Text>
      <Text style={styles.title}>BioLearn</Text>
      <Text style={styles.tagline}>
        Belajar Biologi SMA — Lebih Seru, Lebih Paham.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>✅ Fondasi Siap</Text>
        <Text style={styles.stat}>📚 {modules.length} modul tersedia</Text>
        <Text style={styles.stat}>👩‍🏫 {instructors.length} pemateri</Text>
        <Text style={styles.stat}>❓ {questions.length} soal kuis</Text>
        <Text style={styles.stat}>🗂️ Zustand store aktif</Text>
        <Text style={styles.stat}>📝 TypeScript strict mode</Text>
      </View>

      <Text style={styles.footer}>
        Checkpoint 1 — Foundation complete
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.light.tint,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  stat: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  footer: {
    marginTop: Spacing.xl,
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
});
