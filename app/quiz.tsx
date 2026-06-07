import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useLearningStore } from '@/store/useLearningStore';
import ScreenContainer from '@/components/ScreenContainer';
import AppCard from '@/components/AppCard';
import AppButton from '@/components/AppButton';
import ProgressBar from '@/components/ProgressBar';
import DifficultyBadge from '@/components/DifficultyBadge';
import QuizOption from '@/components/QuizOption';
import { QuizMode } from '@/types';

export default function QuizScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Parameters
  const { moduleId } = useLocalSearchParams();

  // Store data & actions
  const currentRole = useLearningStore((s) => s.currentRole);
  const modules = useLearningStore((s) => s.modules);
  const questions = useLearningStore((s) => s.questions);
  const activeQuiz = useLearningStore((s) => s.activeQuiz);
  const startQuiz = useLearningStore((s) => s.startQuiz);
  const answerQuestion = useLearningStore((s) => s.answerQuestion);
  const finishQuiz = useLearningStore((s) => s.finishQuiz);

  // Find module & questions
  const moduleIdStr = typeof moduleId === 'string' ? moduleId : '';
  const module = modules.find((m) => m.id === moduleIdStr);

  // Raw seed questions drive the "truly no questions" guard; the shuffled
  // active set (built by startQuiz) is what we actually render & grade.
  const rawModuleQuestions = questions.filter((q) => q.moduleId === moduleIdStr);
  const moduleQuestions =
    activeQuiz && activeQuiz.moduleId === moduleIdStr
      ? activeQuiz.questions
      : [];

  // Local state for quiz flow
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  // Reset local state on mount or module change
  useEffect(() => {
    setSelectedMode(null);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setShowFeedback(false);
  }, [moduleIdStr]);

  if (!currentRole) {
    return null;
  }

  // 1. Guard check if moduleId is missing
  if (!moduleIdStr) {
    return (
      <ScreenContainer style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Parameter Modul Hilang
          </Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Silakan pilih modul terlebih dahulu melalui halaman Daftar Modul.
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

  // 2. Guard check if module is not found
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
            title="Kembali ke Daftar Modul"
            onPress={() => router.replace('/modules' as any)}
            variant="primary"
            style={styles.fullWidth}
          />
        </AppCard>
      </ScreenContainer>
    );
  }

  // 3. Guard check if questions list is empty (no seed questions at all)
  if (rawModuleQuestions.length === 0) {
    return (
      <ScreenContainer style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>📝</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Belum Ada Soal
          </Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Belum ada soal latihan kuis untuk modul "{module.title}".
          </Text>
          <AppButton
            title="Kembali ke Detail Modul"
            onPress={() =>
              router.replace({
                pathname: '/module-detail' as any,
                params: { moduleId: module.id },
              })
            }
            variant="primary"
            style={styles.fullWidth}
          />
        </AppCard>
      </ScreenContainer>
    );
  }

  // 4. Mode Selection Guard
  const handleSelectMode = (mode: QuizMode) => {
    setSelectedMode(mode);
    startQuiz(module.id, mode);
  };

  if (selectedMode === null) {
    return (
      <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.modeCard}>
          <Text style={styles.modeIcon}>🧠</Text>
          <Text style={[styles.modeTitle, { color: themeColors.text }]}>
            Pilih Mode Kuis
          </Text>
          <Text style={[styles.modeDesc, { color: themeColors.textSecondary }]}>
            Silakan pilih metode pengerjaan untuk modul:{"\n"}
            <Text style={[styles.boldText, { color: themeColors.text }]}>{module.title}</Text>
          </Text>

          <View style={styles.modeOptionContainer}>
            <View style={[styles.modeOptionCard, { borderColor: themeColors.border, backgroundColor: themeColors.surface }]}>
              <View style={styles.modeHeaderRow}>
                <Text style={styles.modeOptionEmoji}>🟢</Text>
                <Text style={[styles.modeOptionTitle, { color: themeColors.text }]}>
                  Mode Latihan
                </Text>
              </View>
              <Text style={[styles.modeOptionDesc, { color: themeColors.textSecondary }]}>
                Dapatkan pembahasan dan konfirmasi jawaban benar/salah secara langsung setelah setiap soal dijawab.
              </Text>
              <AppButton
                title="Mulai Mode Latihan"
                onPress={() => handleSelectMode('practice')}
                variant="primary"
                style={styles.modeButton}
              />
            </View>

            <View style={[styles.modeOptionCard, { borderColor: themeColors.border, backgroundColor: themeColors.surface }]}>
              <View style={styles.modeHeaderRow}>
                <Text style={styles.modeOptionEmoji}>🔥</Text>
                <Text style={[styles.modeOptionTitle, { color: themeColors.text }]}>
                  Mode Ujian
                </Text>
              </View>
              <Text style={[styles.modeOptionDesc, { color: themeColors.textSecondary }]}>
                Uji kemampuan Anda secara mandiri. Penjelasan jawaban hanya akan ditampilkan di halaman hasil kuis.
              </Text>
              <AppButton
                title="Mulai Mode Ujian"
                onPress={() => handleSelectMode('exam')}
                variant="secondary"
                style={styles.modeButton}
              />
            </View>
          </View>

          <AppButton
            title="Batal & Kembali"
            onPress={() =>
              router.replace({
                pathname: '/module-detail' as any,
                params: { moduleId: module.id },
              })
            }
            variant="ghost"
            style={styles.fullWidth}
          />
        </AppCard>
      </ScreenContainer>
    );
  }

  // 5. Active (shuffled) set not built yet
  if (moduleQuestions.length === 0) {
    return (
      <ScreenContainer style={styles.container} contentContainerStyle={styles.centerContent}>
        <AppCard style={styles.errorCard}>
          <Text style={styles.errorIcon}>⏳</Text>
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Menyiapkan Kuis...
          </Text>
          <Text style={[styles.errorDesc, { color: themeColors.textSecondary }]}>
            Soal sedang diacak untuk Anda.
          </Text>
        </AppCard>
      </ScreenContainer>
    );
  }

  const currentQuestion = moduleQuestions[currentQuestionIndex];
  const totalQuestions = moduleQuestions.length;
  const progressPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);

  // Handle checking of answer
  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null) return;
    answerQuestion(currentQuestion.id, selectedOptionIndex);
    setShowFeedback(true);
  };

  // Handle moving to next state
  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    if (isLastQuestion) {
      // Save result and navigate to results page
      finishQuiz(module.id);
      router.replace({
        pathname: '/quiz-result' as any,
        params: { moduleId: module.id },
      });
    } else {
      // Load next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setShowFeedback(false);
    }
  };

  // Handle moving to next state in exam mode
  const handleNextExam = () => {
    if (selectedOptionIndex === null) return;
    answerQuestion(currentQuestion.id, selectedOptionIndex);

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    if (isLastQuestion) {
      finishQuiz(module.id);
      router.replace({
        pathname: '/quiz-result' as any,
        params: { moduleId: module.id },
      });
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    }
  };

  // Exit Quiz confirmation logic
  const handleExitQuiz = () => {
    Alert.alert(
      'Keluar Kuis',
      'Apakah Anda yakin ingin keluar dari kuis? Semua jawaban Anda saat ini tidak akan disimpan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () =>
            router.replace({
              pathname: '/module-detail' as any,
              params: { moduleId: module.id },
            }),
        },
      ]
    );
  };

  // Option letters mapping
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <ScreenContainer scroll style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <AppButton
          title="⬅️ Keluar Kuis"
          onPress={handleExitQuiz}
          variant="ghost"
          style={styles.backBtn}
        />
        <Text style={[styles.title, { color: themeColors.text }]}>❓ Kuis: {module.title}</Text>
        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={module.difficulty} />
          <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
            Kelas {module.grade} • Bab {module.chapter}
          </Text>
        </View>
      </View>

      {/* Progress Tracker Card */}
      <AppCard style={styles.progressCard}>
        <ProgressBar value={progressPercent} label={`Soal ${currentQuestionIndex + 1} dari ${totalQuestions}`} />
      </AppCard>

      {/* Question Details */}
      <AppCard style={styles.questionCard}>
        <Text style={[styles.questionText, { color: themeColors.text }]}>
          {currentQuestion.question}
        </Text>
      </AppCard>

      {/* Multiple Choices Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((optionText, index) => {
          const isSelected = selectedOptionIndex === index;
          const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;

          let isCorrect = false;
          let isWrong = false;

          if (showFeedback) {
            if (isCorrectAnswer) {
              isCorrect = true;
            } else if (isSelected) {
              isWrong = true;
            }
          }

          return (
            <QuizOption
              key={index}
              label={optionLabels[index]}
              text={optionText}
              selected={isSelected}
              correct={isCorrect}
              wrong={isWrong}
              onPress={() => {
                if (!showFeedback) {
                  setSelectedOptionIndex(index);
                }
              }}
            />
          );
        })}
      </View>

      {/* Feedback Alert Explanatory Card */}
      {showFeedback && (
        <AppCard
          style={[
            styles.feedbackCard,
            {
              borderLeftColor:
                selectedOptionIndex === currentQuestion.correctAnswerIndex
                  ? themeColors.success
                  : themeColors.error,
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackTitle,
              {
                color:
                  selectedOptionIndex === currentQuestion.correctAnswerIndex
                    ? themeColors.success
                    : themeColors.error,
              },
            ]}
          >
            {selectedOptionIndex === currentQuestion.correctAnswerIndex
              ? '🎉 Jawaban Benar!'
              : '❌ Jawaban Salah!'}
          </Text>
          <Text style={[styles.feedbackLabel, { color: themeColors.text }]}>
            Penjelasan:
          </Text>
          <Text style={[styles.feedbackExplanation, { color: themeColors.textSecondary }]}>
            {currentQuestion.explanation}
          </Text>
        </AppCard>
      )}

      {/* Action Buttons Footer */}
      <View style={styles.footer}>
        {selectedMode === 'practice' ? (
          !showFeedback ? (
            <AppButton
              title="Cek Jawaban"
              onPress={handleCheckAnswer}
              variant="primary"
              disabled={selectedOptionIndex === null}
              style={styles.actionBtn}
            />
          ) : (
            <AppButton
              title={currentQuestionIndex === totalQuestions - 1 ? 'Selesaikan Kuis' : 'Soal Berikutnya'}
              onPress={handleNext}
              variant="primary"
              style={styles.actionBtn}
            />
          )
        ) : (
          <AppButton
            title={currentQuestionIndex === totalQuestions - 1 ? 'Selesaikan Kuis' : 'Simpan & Lanjut'}
            onPress={handleNextExam}
            variant="primary"
            disabled={selectedOptionIndex === null}
            style={styles.actionBtn}
          />
        )}
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
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
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
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressCard: {
    padding: Spacing.md,
  },
  questionCard: {
    padding: Spacing.lg,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  feedbackCard: {
    borderLeftWidth: 4,
    gap: Spacing.xs,
    padding: Spacing.lg,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  feedbackLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  feedbackExplanation: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    marginTop: Spacing.md,
  },
  actionBtn: {
    minHeight: 48,
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
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  modeCard: {
    width: '100%',
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 54,
    marginBottom: Spacing.xs,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  modeDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  modeOptionContainer: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  modeOptionCard: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  modeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  modeOptionEmoji: {
    fontSize: 18,
  },
  modeOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  modeOptionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  modeButton: {
    marginTop: Spacing.xs,
    width: '100%',
  },
  boldText: {
    fontWeight: '700',
  },
});
