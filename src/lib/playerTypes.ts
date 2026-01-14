// Player profile and storage types

export interface Player {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export interface PlayerStats {
  playerId: string;
  totalGames: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  totalStars: number;
  conqueredTables: number[];
  tableStats: Record<number, TableStat>;
  gameHistory: GameHistoryEntry[];
}

export interface TableStat {
  attempts: number;
  correct: number;
  fastAnswers: number; // Under 5 seconds
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

export const DEFAULT_PLAYER_STATS: Omit<PlayerStats, 'playerId'> = {
  totalGames: 0,
  totalCorrectAnswers: 0,
  totalQuestions: 0,
  totalStars: 0,
  conqueredTables: [],
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
    tableStats: {},
    gameHistory: [],
    conqueredTables: [],
  };
}
