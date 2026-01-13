export interface GameState {
  currentScreen: 'welcome' | 'setup' | 'game' | 'summary';
  selectedTables: number[];
  questionCount: number;
  currentQuestion: number;
  score: number;
  stars: number;
  currentMultiplier: number;
  currentMultiplicand: number;
  correctAnswer: number;
  userAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  answeredQuestions: AnsweredQuestion[];
  conqueredTables: number[];
}

export interface AnsweredQuestion {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
}

export const INITIAL_STATE: GameState = {
  currentScreen: 'welcome',
  selectedTables: [],
  questionCount: 10,
  currentQuestion: 0,
  score: 0,
  stars: 0,
  currentMultiplier: 0,
  currentMultiplicand: 0,
  correctAnswer: 0,
  userAnswer: null,
  showFeedback: false,
  isCorrect: null,
  answeredQuestions: [],
  conqueredTables: [],
};

export const WORLD_COLORS: Record<number, string> = {
  1: 'bg-world-1',
  2: 'bg-world-2',
  3: 'bg-world-3',
  4: 'bg-world-4',
  5: 'bg-world-5',
  6: 'bg-world-6',
  7: 'bg-world-7',
  8: 'bg-world-8',
  9: 'bg-world-9',
  10: 'bg-world-10',
};

export const WORLD_NAMES: Record<number, string> = {
  1: 'עולם האחדות',
  2: 'עולם הזוגות',
  3: 'עולם המשולשים',
  4: 'עולם הריבועים',
  5: 'עולם הכוכבים',
  6: 'עולם הקסם',
  7: 'עולם הקשת',
  8: 'עולם המזל',
  9: 'עולם החלומות',
  10: 'עולם המספרים',
};

export const EMOJIS = ['🍎', '🌟', '🎈', '🍕', '🌸', '🐱', '🦋', '🍬', '🎁', '🌈'];

export function generateQuestion(tables: number[]): { multiplier: number; multiplicand: number; answer: number } {
  const multiplier = tables[Math.floor(Math.random() * tables.length)];
  const multiplicand = Math.floor(Math.random() * 10) + 1;
  return {
    multiplier,
    multiplicand,
    answer: multiplier * multiplicand,
  };
}

export function generateAnswerOptions(correctAnswer: number): number[] {
  const options = new Set<number>([correctAnswer]);
  
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrongAnswer = Math.max(1, correctAnswer + offset);
    if (wrongAnswer !== correctAnswer) {
      options.add(wrongAnswer);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
}

export function getVisualExplanation(multiplier: number, multiplicand: number): string {
  const emoji = EMOJIS[multiplier % EMOJIS.length];
  const groups: string[] = [];
  
  for (let i = 0; i < multiplier; i++) {
    groups.push(emoji.repeat(multiplicand));
  }
  
  return groups.join(' | ');
}

export function getEncouragingMessage(isCorrect: boolean): string {
  const correctMessages = [
    'מעולה! 🌟',
    'כל הכבוד! 🎉',
    'נפלא! אתה כוכב! ⭐',
    'וואו! מדהים! 🚀',
    'יופי! המשך כך! 💪',
  ];
  
  const incorrectMessages = [
    'אל דאגה, בוא ננסה שוב! 💪',
    'זה בסדר לטעות! בוא נלמד יחד 🤗',
    'קרוב! בוא נראה את זה אחרת 🌈',
  ];
  
  const messages = isCorrect ? correctMessages : incorrectMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}
