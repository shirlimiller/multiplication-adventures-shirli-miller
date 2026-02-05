import { MultiplicationStat, PlayerStats, getDivisionKey, getMultiplicationKey } from './playerTypes';

export type Operation = 'multiply' | 'divide' | 'add' | 'subtract';

export function getOperationSymbol(operation: Operation): string {
  switch (operation) {
    case 'add':
      return '+';
    case 'subtract':
      return '−';
    case 'divide':
      return '÷';
    case 'multiply':
    default:
      return '×';
  }
}

export interface GameState {
  currentScreen: 'welcome' | 'setup' | 'game' | 'summary' | 'boss';
  selectedTables: number[];
  operation: Operation;
  rangeMin: number;
  rangeMax: number;
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
  hintUsedInCurrentQuestion: boolean; // Track if hint was used in current question
}

export interface AnsweredQuestion {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  responseTimeMs: number;
  starsEarned: number; // Stars earned for this specific answer
  operation?: Operation;
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
  operation: 'multiply',
  rangeMin: 1,
  rangeMax: 10,
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
  hintUsedInCurrentQuestion: false,
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
  recentQuestions: AnsweredQuestion[] = [],
  rangeMin: number = 1,
  rangeMax: number = 10
): { multiplier: number; multiplicand: number; answer: number } {
  // Clamp range to sane values (and to 1..12 for multiplication facts)
  const min = Math.max(1, Math.min(rangeMin, rangeMax));
  const max = Math.min(12, Math.max(rangeMin, rangeMax));

  // Build weighted pool of all possible questions
  const questionPool: { table: number; multiplicand: number; weight: number }[] = [];
  
  tables.forEach(table => {
    for (let mult = min; mult <= max; mult++) {
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

function randomInt(min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export function generateQuestionForOperation(params: {
  operation: Operation;
  selectedNumbers: number[]; // "focus" numbers the student selected
  rangeMin: number;
  rangeMax: number;
}): { multiplier: number; multiplicand: number; answer: number } {
  const { operation, selectedNumbers, rangeMin, rangeMax } = params;
  const min = Math.min(rangeMin, rangeMax);
  const max = Math.max(rangeMin, rangeMax);
  const focus = selectedNumbers.length > 0 ? selectedNumbers : [randomInt(min, max)];
  const pickFocus = () => focus[Math.floor(Math.random() * focus.length)];

  switch (operation) {
    case 'add': {
      const a = pickFocus();
      const b = randomInt(min, max);
      return { multiplier: a, multiplicand: b, answer: a + b };
    }
    case 'subtract': {
      // Keep non-negative results
      const a = pickFocus();
      const b = randomInt(min, max);
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      return { multiplier: big, multiplicand: small, answer: big - small };
    }
    case 'divide': {
      // Integer division facts: dividend = divisor * quotient
      const divisor = Math.max(1, pickFocus());
      const quotient = randomInt(min, max);
      const dividend = divisor * quotient;
      return { multiplier: dividend, multiplicand: divisor, answer: quotient };
    }
    case 'multiply':
    default: {
      const table = pickFocus();
      const mult = randomInt(Math.max(1, min), Math.min(12, max));
      return { multiplier: table, multiplicand: mult, answer: table * mult };
    }
  }
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

// Check if a division table (divisor) is fully mastered
// All 10 quotients (1-10) must meet mastery requirements
export function checkDivisionTableMastery(
  playerStats: PlayerStats,
  divisor: number
): {
  isMastered: boolean;
  masteredCount: number;
  totalCount: number;
  divisionDetails: Array<{
    quotient: number;
    correctAnswers: number;
    fastAnswers: number;
    isMastered: boolean;
    needsCorrect: number;
    needsFast: number;
  }>;
} {
  const divisionDetails: Array<{
    quotient: number;
    correctAnswers: number;
    fastAnswers: number;
    isMastered: boolean;
    needsCorrect: number;
    needsFast: number;
  }> = [];

  let masteredCount = 0;

  for (let q = 1; q <= 10; q++) {
    const key = getDivisionKey(divisor, q);
    const stat = playerStats.divisionStats?.[key];
    const isMastered = checkMultiplicationMastery(stat);
    const correctAnswers = stat?.correctAnswers || 0;
    const fastAnswers = stat?.fastAnswers || 0;
    if (isMastered) masteredCount++;

    divisionDetails.push({
      quotient: q,
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
    divisionDetails,
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
