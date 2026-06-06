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
  const startQuiz = useLearningStore((s) => s.startQuiz);
  const answerQuestion = useLearningStore((s) => s.answerQuestion);
  const finishQuiz = useLearningStore((s) => s.finishQuiz);

  // Find module & questions
  const moduleIdStr = typeof moduleId === 'string' ? moduleId : '';
  const module = modules.find((m) => m.id === moduleIdStr);
  const moduleQuestions = questions.filter((q) => q.moduleId === moduleIdStr);

  // Local state for quiz flow
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Security guard
  useEffect(() => {
    if (!currentRole) {
      router.replace('/' as any);
    }
  }, [currentRole]);

  // Start quiz on mount when module is valid
  useEffect(() => {
    if (module) {
      startQuiz(module.id);
    }
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

  // 3. Guard check if questions list is empty
  if (moduleQuestions.length === 0) {
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
        {!showFeedback ? (
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
});
