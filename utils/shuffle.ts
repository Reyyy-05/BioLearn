import {
  ActiveQuiz,
  ActiveQuizQuestion,
  QuizQuestion,
} from '@/types';

// Fisher–Yates shuffle on a *copy*; never mutates the input array.
export function shuffleArray<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle a single question's options while keeping correctAnswerIndex accurate.
// Strategy: capture the correct option's *value* before shuffling, then locate
// its new position afterwards. The original question object is never mutated.
export function shuffleQuestionOptions(
  question: QuizQuestion,
): ActiveQuizQuestion {
  const correctValue = question.options[question.correctAnswerIndex];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctValue);

  return {
    ...question,
    options: shuffledOptions,
    // Fallback to original index if the value lookup ever fails (defensive).
    correctAnswerIndex:
      newCorrectIndex >= 0 ? newCorrectIndex : question.correctAnswerIndex,
  };
}

// Build a fresh shuffled attempt for a module: questions shuffled, and each
// question's options shuffled with the correct index remapped.
export function buildActiveQuiz(
  moduleId: string,
  allQuestions: readonly QuizQuestion[],
): ActiveQuiz {
  const moduleQuestions = allQuestions.filter((q) => q.moduleId === moduleId);
  const questions = shuffleArray(moduleQuestions).map(shuffleQuestionOptions);
  return { moduleId, questions };
}
