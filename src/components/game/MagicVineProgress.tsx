import { Star, Leaf, Rocket, Sparkles } from 'lucide-react';
import { PlayerStats } from '@/lib/playerTypes';
import { checkTableMastery, WORLD_COLORS, WORLD_NAMES } from '@/lib/gameUtils';

interface MagicVineProgressProps {
  table: number;
  playerStats: PlayerStats;
  currentSessionCorrect: number;
  isBossUnlocked: boolean;
  isBossMode: boolean;
  onBossClick?: () => void;
}

export function MagicVineProgress({
  table,
  playerStats,
  currentSessionCorrect,
  isBossUnlocked,
  isBossMode,
  onBossClick,
}: MagicVineProgressProps) {
  const { masteredCount, totalCount } = checkTableMastery(playerStats, table);
  
  // Calculate progress: 150 points total (10 multiplicands × 15 correct answers)
  const maxPoints = 150;
  const currentPoints = masteredCount * 15 + (currentSessionCorrect % 15);
  const progressPercent = Math.min(100, (currentPoints / maxPoints) * 100);

  // Determine vine growth stages
  const growthStage = Math.floor(progressPercent / 10); // 0-10 stages

  return (
    <div className="h-full flex flex-col items-center py-4 w-20">
      {/* World label at top */}
      <div className={`${WORLD_COLORS[table]} text-white rounded-2xl px-3 py-1 text-sm font-bold mb-4 shadow-soft`}>
        {table}
      </div>

      {/* Magic Vine Container */}
      <div className="flex-1 relative w-12 flex flex-col-reverse">
        {/* Background track */}
        <div className="absolute inset-x-0 inset-y-0 bg-muted/50 rounded-full mx-auto w-4" />
        
        {/* Growing vine/progress */}
        <div 
          className="absolute inset-x-0 bottom-0 bg-gradient-success rounded-full mx-auto w-4 transition-all duration-700 ease-out animate-grow-vine"
          style={{ height: `${progressPercent}%` }}
        >
          {/* Sparkle effect on vine */}
          {progressPercent > 0 && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <Sparkles className="w-6 h-6 text-accent animate-sparkle" />
            </div>
          )}
        </div>

        {/* Leaves at growth stages */}
        {Array.from({ length: growthStage }, (_, i) => (
          <div
            key={i}
            className={`absolute ${i % 2 === 0 ? '-right-3' : '-left-3'} transition-all duration-300`}
            style={{ bottom: `${(i + 1) * 10}%` }}
          >
            <Leaf 
              className={`w-5 h-5 ${i % 2 === 0 ? 'rotate-45' : '-rotate-45'} text-success drop-shadow-sm`}
            />
          </div>
        ))}

        {/* Boss/Crown at top */}
        {isBossUnlocked && (
          <button
            onClick={onBossClick}
            className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce-soft"
          >
            <div className="bg-gradient-gold rounded-full p-2 shadow-gold hover:scale-110 transition-transform">
              <span className="text-2xl">👑</span>
            </div>
          </button>
        )}
      </div>

      {/* Progress text */}
      <div className="mt-4 text-center">
        <div className="text-sm font-bold text-foreground">{masteredCount}/10</div>
        <div className="text-xs text-muted-foreground">כפולות</div>
      </div>

      {/* Stars earned indicator */}
      {currentSessionCorrect > 0 && (
        <div className="mt-2 flex items-center gap-1 bg-accent/20 rounded-full px-2 py-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-xs font-bold text-accent">+{currentSessionCorrect}</span>
        </div>
      )}
    </div>
  );
}
