import { MultiplicationStat, PlayerStats, getMultiplicationKey } from './playerTypes';

export interface GameState {
  currentScreen: 'welcome' | 'setup' | 'game' | 'summary' | 'boss';
  selectedTables: number[];
  questionCount: number;
  currentQuestion: number;
  score: number;
  stars: number;
  streak: number; // Consecutive correct answers
  currentMultiplier: number;
  currentMultiplicand: number;
  correctAnswer: number;
  userAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  answeredQuestions: AnsweredQuestion[];
  conqueredTables: number[];
  questionStartTime: number;
  mistakeCount: number; // Track mistakes for rotating visual items
  bossTable: number | null; // Which table's boss challenge is active
}

export interface AnsweredQuestion {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  responseTimeMs: number;
  starsEarned: number; // Stars earned for this specific answer
}

// Mastery requirements - based on per-multiplication tracking
export const MASTERY_CONFIG = {
  maxResponseTimeMs: 4000, // 4 seconds - fast answer threshold for training mode
  testModeMaxTimeMs: 6000, // 6 seconds - success threshold for test mode
  requiredCorrect: 15, // Must answer correctly at least 15 times per multiplication
  requiredFast: 3, // At least 3 of those must be under 4 seconds
};

export const INITIAL_STATE: GameState = {
  currentScreen: 'welcome',
  selectedTables: [],
  questionCount: 10,
  currentQuestion: 0,
  score: 0,
  stars: 0,
  streak: 0,
  currentMultiplier: 0,
  currentMultiplicand: 0,
  correctAnswer: 0,
  userAnswer: null,
  showFeedback: false,
  isCorrect: null,
  answeredQuestions: [],
  conqueredTables: [],
  questionStartTime: 0,
  mistakeCount: 0,
  bossTable: null,
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

// Simple random question generation (fallback)
export function generateQuestion(tables: number[]): { multiplier: number; multiplicand: number; answer: number } {
  const multiplier = tables[Math.floor(Math.random() * tables.length)];
  const multiplicand = Math.floor(Math.random() * 10) + 1;
  return {
    multiplier,
    multiplicand,
    answer: multiplier * multiplicand,
  };
}

// Adaptive question generation based on player stats
export function generateAdaptiveQuestion(
  tables: number[],
  playerStats: PlayerStats,
  recentQuestions: AnsweredQuestion[] = []
): { multiplier: number; multiplicand: number; answer: number } {
  // Build weighted pool of all possible questions
  const questionPool: { table: number; multiplicand: number; weight: number }[] = [];
  
  tables.forEach(table => {
    for (let mult = 1; mult <= 10; mult++) {
      const key = getMultiplicationKey(table, mult);
      const stat = playerStats.multiplicationStats[key];
      
      // Calculate weight based on weakness
      let weight = 10; // Base weight
      
      if (stat) {
        const { correctAnswers, fastAnswers, totalAttempts } = stat;
        const avgTimeMs = totalAttempts > 0 ? stat.totalTimeMs / totalAttempts : MASTERY_CONFIG.maxResponseTimeMs;
        
        // Higher weight for struggling multiplications
        if (correctAnswers < MASTERY_CONFIG.requiredCorrect) {
          // Needs more correct answers
          weight += (MASTERY_CONFIG.requiredCorrect - correctAnswers) * 3;
        }
        
        if (fastAnswers < MASTERY_CONFIG.requiredFast) {
          // Needs more fast answers
          weight += (MASTERY_CONFIG.requiredFast - fastAnswers) * 2;
        }
        
        // Add weight for slow average response
        if (avgTimeMs > MASTERY_CONFIG.maxResponseTimeMs) {
          weight += 5;
        }
        
        // Reduce weight for mastered multiplications (but don't exclude them completely)
        if (correctAnswers >= MASTERY_CONFIG.requiredCorrect && fastAnswers >= MASTERY_CONFIG.requiredFast) {
          weight = Math.max(1, weight - 8); // Minimum weight of 1
        }
      } else {
        // Never attempted - higher priority
        weight += 5;
      }
      
      // Reduce weight if recently asked (avoid repetition)
      const recentlyAsked = recentQuestions.slice(-5).some(
        q => q.multiplier === table && q.multiplicand === mult
      );
      if (recentlyAsked) {
        weight = Math.max(1, weight - 10);
      }
      
      questionPool.push({ table, multiplicand: mult, weight });
    }
  });
  
  // Weighted random selection
  const totalWeight = questionPool.reduce((sum, q) => sum + q.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const question of questionPool) {
    random -= question.weight;
    if (random <= 0) {
      return {
        multiplier: question.table,
        multiplicand: question.multiplicand,
        answer: question.table * question.multiplicand,
      };
    }
  }
  
  // Fallback
  return generateQuestion(tables);
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

export function getEncouragingMessage(isCorrect: boolean, isFast?: boolean): string {
  const correctMessages = [
    'מעולה! 🌟',
    'כל הכבוד! 🎉',
    'נפלא! ⭐',
    'וואו! 🚀',
    'יופי! 💪',
    'הידד! 🎊',
    'נכון! 👏',
    'מושלם! ✨',
    'אלוף! 🏅',
    'בול! 🎯',
  ];
  
  const fastMessages = [
    'וואו! סופר מהיר! נראה שאתה כבר זוכר בעל פה! ⚡',
    'מהיר כמו ברק! אתה אלוף! 🏆',
    'בום! תשובה מיידית! 💥',
    'את/ה כבר יודע/ת את זה בעל פה! 🧠✨',
  ];
  
  const incorrectMessages = [
    'אל דאגה, בוא ננסה שוב! 💪',
    'זה בסדר לטעות! בוא נלמד יחד 🤗',
    'קרוב! בוא נראה את זה אחרת 🌈',
  ];
  
  if (isCorrect && isFast) {
    return fastMessages[Math.floor(Math.random() * fastMessages.length)];
  }
  
  const messages = isCorrect ? correctMessages : incorrectMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Check if a specific multiplication is mastered
export function checkMultiplicationMastery(stat: MultiplicationStat | undefined): boolean {
  if (!stat) return false;
  return stat.correctAnswers >= MASTERY_CONFIG.requiredCorrect && 
         stat.fastAnswers >= MASTERY_CONFIG.requiredFast;
}

// Check if a table (world) is fully mastered
// All 10 multiplications (1-10) must meet mastery requirements
export function checkTableMastery(
  playerStats: PlayerStats,
  table: number
): { 
  isMastered: boolean; 
  masteredCount: number; 
  totalCount: number;
  multiplicationDetails: Array<{
    multiplicand: number;
    correctAnswers: number;
    fastAnswers: number;
    isMastered: boolean;
    needsCorrect: number;
    needsFast: number;
  }>;
} {
  const multiplicationDetails: Array<{
    multiplicand: number;
    correctAnswers: number;
    fastAnswers: number;
    isMastered: boolean;
    needsCorrect: number;
    needsFast: number;
  }> = [];
  
  let masteredCount = 0;
  
  for (let mult = 1; mult <= 10; mult++) {
    const key = getMultiplicationKey(table, mult);
    const stat = playerStats.multiplicationStats[key];
    const isMastered = checkMultiplicationMastery(stat);
    
    const correctAnswers = stat?.correctAnswers || 0;
    const fastAnswers = stat?.fastAnswers || 0;
    
    if (isMastered) masteredCount++;
    
    multiplicationDetails.push({
      multiplicand: mult,
      correctAnswers,
      fastAnswers,
      isMastered,
      needsCorrect: Math.max(0, MASTERY_CONFIG.requiredCorrect - correctAnswers),
      needsFast: Math.max(0, MASTERY_CONFIG.requiredFast - fastAnswers),
    });
  }
  
  return {
    isMastered: masteredCount === 10,
    masteredCount,
    totalCount: 10,
    multiplicationDetails,
  };
}

// Get all tables that are mastered
export function getConqueredTables(playerStats: PlayerStats): number[] {
  const conquered: number[] = [];
  
  for (let table = 1; table <= 10; table++) {
    const { isMastered } = checkTableMastery(playerStats, table);
    if (isMastered) {
      conquered.push(table);
    }
  }
  
  return conquered;
}
