// ─── User & Role ──────────────────────────────────────────────
export type UserRole = 'student' | 'teacher' | 'admin';

// ─── Instructor ───────────────────────────────────────────────
export interface Instructor {
  id: string;
  name: string;
  nickname: string;
  bio: string;
  avatarUrl: string;
  specialization: string;
}

// ─── Learning Module ──────────────────────────────────────────
export type Difficulty = 'Mudah' | 'Sedang' | 'Sulit';

export interface LearningModule {
  id: string;
  title: string;
  grade: number; // 10, 11, or 12
  chapter: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  instructorId: string;

  // Video metadata
  videoTitle: string;
  videoUrl: string;
  videoThumbnail: string;
  videoDuration: number; // seconds

  // Content
  summary: string;
  keyPoints: string[];
  example: string;

  // UI
  icon: string; // emoji or icon name
}

// ─── Quiz ─────────────────────────────────────────────────────
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;

  // Optional metadata (additive; does not affect existing flow)
  difficulty?: QuestionDifficulty;
  topicTag?: string;
  competency?: string;
}

// A question prepared for a single attempt: options are already shuffled
// and correctAnswerIndex is remapped to the shuffled option order.
export type ActiveQuizQuestion = QuizQuestion;

export type QuizMode = 'practice' | 'exam';

// The shuffled question set for the current quiz attempt.
export interface ActiveQuiz {
  moduleId: string;
  questions: ActiveQuizQuestion[];
  mode?: QuizMode;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
}

export interface QuizResult {
  moduleId: string;
  totalQuestions: number;
  correctCount: number;
  score: number; // 0–100
  passed: boolean; // score >= 70
  completedAt: string; // ISO date
  mode?: QuizMode;
}

// ─── Progress ─────────────────────────────────────────────────
export interface LearningProgress {
  moduleId: string;
  videoWatched: boolean;
  completed: boolean;
  lastScore: number | null;
  attempts: number;
  lastStudiedAt: string | null; // ISO date
}
