import { Player, PlayerStats } from '@/lib/playerTypes';
import { checkDivisionTableMastery, checkTableMastery } from '@/lib/gameUtils';
import { ArrowRight, Award, Star } from 'lucide-react';

interface PlayerHeaderProps {
  player: Player;
  stats: PlayerStats;
  onBack: () => void;
}

export function PlayerHeader({ player, stats, onBack }: PlayerHeaderProps) {
  const mulCertCount = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => checkTableMastery(stats, t).isMastered).length;
  const divCertCount = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => checkDivisionTableMastery(stats, t).isMastered).length;

  return (
    <div className="bg-card shadow-soft rounded-2xl px-4 py-3 flex items-center justify-between">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
        <span className="text-sm font-medium">חזרה</span>
      </button>

      {/* Player info */}
      <div className="flex items-center gap-4">
        {/* Quick stats */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="font-bold">{stats.totalStars}</span>
          </div>
          <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">× {mulCertCount}/10</span>
              <span className="text-muted-foreground">|</span>
              <span className="font-bold">÷ {divCertCount}/10</span>
          </div>
        </div>

        {/* Avatar and name */}
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <span className="text-2xl">{player.avatar}</span>
          <span className="font-bold">{player.name}</span>
        </div>
      </div>
    </div>
  );
}
