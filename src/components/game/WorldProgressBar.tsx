import { Crown, Star, Trophy, Zap } from 'lucide-react';
import { WORLD_COLORS, WORLD_NAMES, MASTERY_CONFIG, checkTableMastery } from '@/lib/gameUtils';
import { PlayerStats } from '@/lib/playerTypes';

interface WorldProgressBarProps {
  table: number;
  playerStats: PlayerStats;
  currentSessionCorrect: number;
  isBossUnlocked: boolean;
  isBossMode: boolean;
  isBossCompleted?: boolean;
  onBossClick?: () => void;
}

export function WorldProgressBar({ 
  table, 
  playerStats, 
  currentSessionCorrect,
  isBossUnlocked,
  isBossMode,
  isBossCompleted = false,
  onBossClick 
}: WorldProgressBarProps) {
  const { masteredCount, multiplicationDetails, isMastered } = checkTableMastery(playerStats, table);
  
  // Calculate total progress points: each multiplication needs 15 correct answers
  // Total possible = 10 * 15 = 150 points
  const totalPoints = multiplicationDetails.reduce((sum, detail) => {
    const points = Math.min(detail.correctAnswers, MASTERY_CONFIG.requiredCorrect);
    return sum + points;
  }, 0);
  
  const maxPoints = 10 * MASTERY_CONFIG.requiredCorrect; // 150
  
  // Progress logic:
  // - During training: progress grows gradually but caps at 90%
  // - Boss unlocked but not completed: stays at 90%
  // - Boss completed (isMastered): jumps to 100%
  let baseProgress = (totalPoints / maxPoints) * 100;
  
  // Add session progress for visual feedback (small increment per correct answer)
  const sessionBonus = Math.min(currentSessionCorrect * 2, 10); // 2% per correct, max 10%
  
  // Cap at 90% until boss is completed
  const cappedProgress = isMastered || isBossCompleted 
    ? 100 
    : Math.min(baseProgress + sessionBonus, 90);
  
  const displayProgress = cappedProgress;

  return (
    <div className="flex flex-col items-center gap-2 h-full py-4">
      {/* World name and progress */}
      <div className={`${WORLD_COLORS[table]} text-white rounded-xl px-3 py-2 text-center shadow-lg`}>
        <span className="text-xs font-bold">{WORLD_NAMES[table]}</span>
        <div className="text-lg font-bold">{table}</div>
      </div>

      {/* Boss button (when unlocked) */}
      {isBossUnlocked && !isMastered && (
        <button
          onClick={onBossClick}
          className={`
            relative p-2 rounded-xl transition-all duration-300
            ${isBossMode 
              ? 'bg-gradient-to-b from-purple-500 to-purple-700 ring-2 ring-purple-300' 
              : 'bg-gradient-to-b from-amber-400 to-orange-500 hover:scale-110 animate-pulse'
            }
          `}
        >
          <Crown className="w-6 h-6 text-white" />
          <Zap className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 fill-yellow-300" />
        </button>
      )}

      {/* Conquered crown */}
      {isMastered && (
        <div className="p-2 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-xl shadow-lg">
          <Crown className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Vertical progress bar */}
      <div className="flex-1 w-8 relative">
        <div className="absolute inset-0 bg-muted rounded-full overflow-hidden border-2 border-muted-foreground/20">
          {/* Progress fill */}
          <div 
            className={`
              absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700 ease-out
              ${isMastered 
                ? 'bg-gradient-to-t from-yellow-400 via-amber-400 to-yellow-300' 
                : `bg-gradient-to-t from-primary via-primary to-accent`
              }
            `}
            style={{ height: `${displayProgress}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          
          {/* Milestone markers */}
          {[25, 50, 75, 100].map((milestone) => (
            <div 
              key={milestone}
              className="absolute left-0 right-0 h-0.5 bg-muted-foreground/30"
              style={{ bottom: `${milestone}%` }}
            />
          ))}
        </div>
      </div>

      {/* Progress stats */}
      <div className="text-center space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="font-bold">{masteredCount}/10</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {totalPoints}/{maxPoints}
        </div>
      </div>

      {/* Trophy for conquered */}
      {isMastered && (
        <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-bounce" />
      )}
    </div>
  );
}
