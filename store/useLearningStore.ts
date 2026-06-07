import { create } from 'zustand';
import {
  UserRole,
  Instructor,
  LearningModule,
  QuizQuestion,
  LearningProgress,
  QuizAnswer,
  QuizResult,
  ActiveQuiz,
  QuizMode,
} from '@/types';
import { seedInstructors } from '@/data/seedInstructors';
import { seedModules } from '@/data/seedModules';
import { seedQuestions } from '@/data/seedQuestions';
import { buildActiveQuiz } from '@/utils/shuffle';

// ─── State Shape ──────────────────────────────────────────────
interface LearningState {
  currentRole: UserRole | null;
  instructors: Instructor[];
  modules: LearningModule[];
  questions: QuizQuestion[];
  progress: Record<string, LearningProgress>;
  quizAnswers: QuizAnswer[];
  lastQuizResult: QuizResult | null;
  activeQuiz: ActiveQuiz | null;
}

// ─── Actions ──────────────────────────────────────────────────
interface LearningActions {
  setRole: (role: UserRole | null) => void;
  markVideoWatched: (moduleId: string) => void;
  startQuiz: (moduleId: string, mode?: QuizMode) => void;
  answerQuestion: (questionId: string, selectedIndex: number) => void;
  finishQuiz: (moduleId: string) => void;
  resetDemo: () => void;
}

// ─── Initial State ────────────────────────────────────────────
const initialState: LearningState = {
  currentRole: null,
  instructors: seedInstructors,
  modules: seedModules,
  questions: seedQuestions,
  progress: {},
  quizAnswers: [],
  lastQuizResult: null,
  activeQuiz: null,
};

// ─── Helper ───────────────────────────────────────────────────
function ensureProgress(
  progress: Record<string, LearningProgress>,
  moduleId: string,
): LearningProgress {
  return (
    progress[moduleId] ?? {
      moduleId,
      videoWatched: false,
      completed: false,
      lastScore: null,
      attempts: 0,
      lastStudiedAt: null,
    }
  );
}

// ─── Store ────────────────────────────────────────────────────
export const useLearningStore = create<LearningState & LearningActions>(
  (set, get) => ({
    ...initialState,

    // ── Set active role ─────────────────────────────────────
    setRole: (role) => set({ currentRole: role }),

    // ── Mark a module's video as watched ────────────────────
    markVideoWatched: (moduleId) =>
      set((state) => {
        const prev = ensureProgress(state.progress, moduleId);
        return {
          progress: {
            ...state.progress,
            [moduleId]: {
              ...prev,
              videoWatched: true,
              lastStudiedAt: new Date().toISOString(),
            },
          },
        };
      }),

    // ── Begin a quiz attempt (build a fresh shuffled set) ───
    startQuiz: (moduleId, mode = 'practice') =>
      set((state) => ({
        quizAnswers: [],
        lastQuizResult: null,
        activeQuiz: {
          ...buildActiveQuiz(moduleId, state.questions),
          mode,
        },
      })),

    // ── Record a single answer ──────────────────────────────
    answerQuestion: (questionId, selectedIndex) =>
      set((state) => {
        // Replace existing answer for the same question, if any
        const filtered = state.quizAnswers.filter(
          (a) => a.questionId !== questionId,
        );
        return {
          quizAnswers: [...filtered, { questionId, selectedIndex }],
        };
      }),

    // ── Finish & grade a quiz ───────────────────────────────
    finishQuiz: (moduleId) => {
      const { questions, quizAnswers, progress, activeQuiz } = get();

      // 1. Grade against the active (shuffled) set so option indices match
      //    the order shown to the user. Fall back to seed questions only if
      //    no active attempt exists (defensive).
      const moduleQuestions =
        activeQuiz && activeQuiz.moduleId === moduleId
          ? activeQuiz.questions
          : questions.filter((q) => q.moduleId === moduleId);
      const totalQuestions = moduleQuestions.length;

      // 2. Count correct answers
      let correctCount = 0;
      for (const q of moduleQuestions) {
        const answer = quizAnswers.find((a) => a.questionId === q.id);
        if (answer && answer.selectedIndex === q.correctAnswerIndex) {
          correctCount++;
        }
      }

      // 3. Calculate score (0–100)
      const score =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;

      // 4. Determine pass/fail
      const passed = score >= 70;

      // 5. Build quiz result
      const quizResult: QuizResult = {
        moduleId,
        totalQuestions,
        correctCount,
        score,
        passed,
        completedAt: new Date().toISOString(),
        mode: activeQuiz?.mode || 'practice',
      };

      // 6. Update progress
      const prev = ensureProgress(progress, moduleId);
      const updatedProgress: LearningProgress = {
        ...prev,
        lastScore: score,
        attempts: prev.attempts + 1,
        completed: passed && prev.videoWatched,
        lastStudiedAt: new Date().toISOString(),
      };

      set({
        lastQuizResult: quizResult,
        progress: {
          ...progress,
          [moduleId]: updatedProgress,
        },
      });
    },

    // ── Reset all data to initial state ─────────────────────
    resetDemo: () => set({ ...initialState }),
  }),
);
