import { useState, useCallback } from 'react';
import { Player, PlayerStats, createPlayerStats, GameHistoryEntry, getMultiplicationKey, createMultiplicationStat } from '@/lib/playerTypes';
import { AnsweredQuestion, MASTERY_CONFIG, getConqueredTables } from '@/lib/gameUtils';

const PLAYERS_KEY = 'multiplication_game_players';
const STATS_KEY = 'multiplication_game_stats';

export function usePlayerStorage() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(PLAYERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [allStats, setAllStats] = useState<Record<string, PlayerStats>>(() => {
    const saved = localStorage.getItem(STATS_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [isLoaded] = useState(true);

  // Save players to localStorage
  const savePlayers = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(newPlayers));
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: Record<string, PlayerStats>) => {
    setAllStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  }, []);

  // Add a new player
  const addPlayer = useCallback((player: Player) => {
    const newPlayers = [...players, player];
    savePlayers(newPlayers);
    
    // Initialize stats for new player
    const newStats = { ...allStats, [player.id]: createPlayerStats(player.id) };
    saveStats(newStats);
    
    return player;
  }, [players, allStats, savePlayers, saveStats]);

  // Delete a player
  const deletePlayer = useCallback((playerId: string) => {
    const newPlayers = players.filter(p => p.id !== playerId);
    savePlayers(newPlayers);
    
    // Also delete stats
    const newStats = { ...allStats };
    delete newStats[playerId];
    saveStats(newStats);
  }, [players, allStats, savePlayers, saveStats]);

  // Reset player history only (keep profile)
  const resetPlayerHistory = useCallback((playerId: string) => {
    const newStats = { ...allStats, [playerId]: createPlayerStats(playerId) };
    saveStats(newStats);
  }, [allStats, saveStats]);

  // Get stats for a specific player
  const getPlayerStats = useCallback((playerId: string): PlayerStats => {
    const stats = allStats[playerId];
    if (stats) {
      // Ensure multiplicationStats exists (for backward compatibility)
      if (!stats.multiplicationStats) {
        stats.multiplicationStats = {};
      }
      return stats;
    }
    return createPlayerStats(playerId);
  }, [allStats]);

  // Update player stats after a game - with per-multiplication tracking
  const updatePlayerStats = useCallback((
    playerId: string,
    answeredQuestions: AnsweredQuestion[],
    selectedTables: number[],
    stars: number
  ) => {
    const currentStats = getPlayerStats(playerId);
    
    // Calculate game results
    const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
    const totalQuestions = answeredQuestions.length;
    
    // Update per-multiplication stats
    const newMultiplicationStats = { ...currentStats.multiplicationStats };
    
    answeredQuestions.forEach(q => {
      const key = getMultiplicationKey(q.multiplier, q.multiplicand);
      const existing = newMultiplicationStats[key] || createMultiplicationStat();
      
      const isFast = q.responseTimeMs <= MASTERY_CONFIG.maxResponseTimeMs;
      
      newMultiplicationStats[key] = {
        totalAttempts: existing.totalAttempts + 1,
        correctAnswers: existing.correctAnswers + (q.isCorrect ? 1 : 0),
        fastAnswers: existing.fastAnswers + (q.isCorrect && isFast ? 1 : 0),
        totalTimeMs: existing.totalTimeMs + q.responseTimeMs,
        lastAttempted: Date.now(),
      };
    });
    
    // Update legacy table-specific stats (for dashboard compatibility)
    const newTableStats = { ...currentStats.tableStats };
    
    selectedTables.forEach(table => {
      const tableQuestions = answeredQuestions.filter(q => q.multiplier === table);
      const tableCorrect = tableQuestions.filter(q => q.isCorrect);
      const tableFast = tableCorrect.filter(q => q.responseTimeMs <= MASTERY_CONFIG.maxResponseTimeMs);
      const avgTime = tableCorrect.length > 0 
        ? tableCorrect.reduce((sum, q) => sum + q.responseTimeMs, 0) / tableCorrect.length
        : 0;
      
      const existing = newTableStats[table] || {
        attempts: 0,
        correct: 0,
        fastAnswers: 0,
        averageTimeMs: 0,
        lastPlayed: 0,
      };
      
      // Update with weighted average for time
      const totalCorrectSoFar = existing.correct + tableCorrect.length;
      const newAvgTime = totalCorrectSoFar > 0
        ? ((existing.averageTimeMs * existing.correct) + (avgTime * tableCorrect.length)) / totalCorrectSoFar
        : 0;
      
      newTableStats[table] = {
        attempts: existing.attempts + tableQuestions.length,
        correct: existing.correct + tableCorrect.length,
        fastAnswers: existing.fastAnswers + tableFast.length,
        averageTimeMs: Math.round(newAvgTime),
        lastPlayed: Date.now(),
      };
    });

    // Calculate conquered tables based on per-multiplication mastery
    const updatedStatsForCheck: PlayerStats = {
      ...currentStats,
      multiplicationStats: newMultiplicationStats,
    };
    const newConqueredTables = getConqueredTables(updatedStatsForCheck);

    // Create game history entry
    const gameEntry: GameHistoryEntry = {
      date: Date.now(),
      tables: selectedTables,
      score: stars * 10,
      stars,
      correctAnswers,
      totalQuestions,
      conqueredInGame: newConqueredTables.filter(t => !currentStats.conqueredTables.includes(t)),
    };

    // Update stats
    const updatedStats: PlayerStats = {
      ...currentStats,
      totalGames: currentStats.totalGames + 1,
      totalCorrectAnswers: currentStats.totalCorrectAnswers + correctAnswers,
      totalQuestions: currentStats.totalQuestions + totalQuestions,
      totalStars: currentStats.totalStars + stars,
      conqueredTables: newConqueredTables,
      multiplicationStats: newMultiplicationStats,
      tableStats: newTableStats,
      gameHistory: [...currentStats.gameHistory, gameEntry],
    };

    const newAllStats = { ...allStats, [playerId]: updatedStats };
    saveStats(newAllStats);
    
    return updatedStats;
  }, [allStats, getPlayerStats, saveStats]);

  return {
    players,
    isLoaded,
    addPlayer,
    deletePlayer,
    resetPlayerHistory,
    getPlayerStats,
    updatePlayerStats,
  };
}
