// Player profile and storage types

export interface Player {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

// Stats for a specific multiplication (e.g., 8×3)
export interface MultiplicationStat {
  totalAttempts: number;
  correctAnswers: number;
  fastAnswers: number; // Under 5 seconds
  totalTimeMs: number; // Sum of all response times for average calculation
  lastAttempted: number;
}

export interface PlayerStats {
  playerId: string;
  totalGames: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  totalStars: number;
  conqueredTables: number[];
  // Per-multiplication tracking: key is "table_multiplicand" e.g., "8_3" for 8×3
  multiplicationStats: Record<string, MultiplicationStat>;
  // Legacy table stats for backward compatibility
  tableStats: Record<number, TableStat>;
  gameHistory: GameHistoryEntry[];
}

export interface TableStat {
  attempts: number;
  correct: number;
  fastAnswers: number;
  averageTimeMs: number;
  lastPlayed: number;
}

export interface GameHistoryEntry {
  date: number;
  tables: number[];
  score: number;
  stars: number;
  correctAnswers: number;
  totalQuestions: number;
  conqueredInGame: number[];
}

export const AVATARS = [
  '🦊', '🐻', '🐰', '🦁', '🐼', '🐨', '🐯', '🦄',
  '🐸', '🐵', '🦋', '🐝', '🦉', '🐧', '🐳', '🦀',
];

// Child-friendly items for visual explanations (rotates on each mistake)
export const VISUAL_ITEMS = [
  { emoji: '🍬', name: 'סוכריות' },
  { emoji: '🍫', name: 'שוקולדים' },
  { emoji: '🍪', name: 'עוגיות' },
  { emoji: '🍎', name: 'תפוחים' },
  { emoji: '🍊', name: 'תפוזים' },
  { emoji: '🍓', name: 'תותים' },
  { emoji: '🍕', name: 'משולשי פיצה' },
  { emoji: '🧁', name: 'קאפקייקים' },
  { emoji: '🍩', name: 'דונאטים' },
  { emoji: '⭐', name: 'כוכבים' },
  { emoji: '🎈', name: 'בלונים' },
  { emoji: '💎', name: 'יהלומים' },
];

export const DEFAULT_PLAYER_STATS: Omit<PlayerStats, 'playerId'> = {
  totalGames: 0,
  totalCorrectAnswers: 0,
  totalQuestions: 0,
  totalStars: 0,
  conqueredTables: [],
  multiplicationStats: {},
  tableStats: {},
  gameHistory: [],
};

export function createPlayer(name: string, avatar: string): Player {
  return {
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    avatar,
    createdAt: Date.now(),
  };
}

export function createPlayerStats(playerId: string): PlayerStats {
  return {
    ...DEFAULT_PLAYER_STATS,
    playerId,
    multiplicationStats: {},
    tableStats: {},
    gameHistory: [],
    conqueredTables: [],
  };
}

// Helper to create multiplication key
export function getMultiplicationKey(table: number, multiplicand: number): string {
  return `${table}_${multiplicand}`;
}

// Helper to parse multiplication key
export function parseMultiplicationKey(key: string): { table: number; multiplicand: number } {
  const [table, multiplicand] = key.split('_').map(Number);
  return { table, multiplicand };
}

// Create empty multiplication stat
export function createMultiplicationStat(): MultiplicationStat {
  return {
    totalAttempts: 0,
    correctAnswers: 0,
    fastAnswers: 0,
    totalTimeMs: 0,
    lastAttempted: 0,
  };
}
