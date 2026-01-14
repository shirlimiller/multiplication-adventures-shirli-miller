import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { PlayerHeader } from './PlayerHeader';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { WORLD_NAMES, WORLD_COLORS } from '@/lib/gameUtils';
import { Play, Trophy, Target, Clock } from 'lucide-react';

interface PlayerDashboardProps {
  player: Player;
  stats: PlayerStats;
  onBack: () => void;
  onStartGame: () => void;
}

export function PlayerDashboard({ player, stats, onBack, onStartGame }: PlayerDashboardProps) {
  const successRate = stats.totalQuestions > 0 
    ? Math.round((stats.totalCorrectAnswers / stats.totalQuestions) * 100) 
    : 0;

  const getWelcomeMessage = () => {
    if (stats.totalGames === 0) {
      return `שלום ${player.name}! 🎉 בוא נתחיל את ההרפתקה הראשונה שלך!`;
    }
    if (stats.conqueredTables.length >= 10) {
      return `${player.name} האלוף/ה! 🏆 כבשת את כל העולמות! רוצה לתרגל?`;
    }
    if (stats.conqueredTables.length > 0) {
      return `שלום ${player.name}! ✨ כבר כבשת ${stats.conqueredTables.length} עולמות! בוא נמשיך!`;
    }
    return `שלום ${player.name}! 💪 בוא נכבוש עולמות חדשים היום!`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <PlayerHeader player={player} stats={stats} onBack={onBack} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 gap-8 max-w-4xl mx-auto w-full">
        <FoxMascot message={getWelcomeMessage()} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-card rounded-2xl p-4 shadow-card text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{stats.conqueredTables.length}/10</div>
            <div className="text-xs text-muted-foreground">עולמות נכבשו</div>
          </div>
          
          <div className="bg-card rounded-2xl p-4 shadow-card text-center">
            <Target className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{successRate}%</div>
            <div className="text-xs text-muted-foreground">אחוז הצלחה</div>
          </div>
          
          <div className="bg-card rounded-2xl p-4 shadow-card text-center">
            <span className="text-3xl block mb-1">⭐</span>
            <div className="text-2xl font-extrabold">{stats.totalStars}</div>
            <div className="text-xs text-muted-foreground">כוכבים</div>
          </div>
          
          <div className="bg-card rounded-2xl p-4 shadow-card text-center">
            <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{stats.totalGames}</div>
            <div className="text-xs text-muted-foreground">משחקים</div>
          </div>
        </div>

        {/* Conquered Tables */}
        {stats.conqueredTables.length > 0 && (
          <div className="w-full bg-card rounded-2xl p-6 shadow-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🏆</span> העולמות שכבשת
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.conqueredTables.sort((a, b) => a - b).map(table => (
                <span 
                  key={table} 
                  className={`${WORLD_COLORS[table]} text-white px-3 py-1.5 rounded-xl text-sm font-bold`}
                >
                  {table} - {WORLD_NAMES[table]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Remaining Tables */}
        {stats.conqueredTables.length < 10 && (
          <div className="w-full bg-muted/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🎯</span> עולמות לכיבוש
            </h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .filter(t => !stats.conqueredTables.includes(t))
                .map(table => (
                  <span 
                    key={table} 
                    className="bg-muted text-muted-foreground px-3 py-1.5 rounded-xl text-sm font-bold"
                  >
                    {table} - {WORLD_NAMES[table]}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Start Game Button */}
        <Button
          variant="game"
          size="game"
          onClick={onStartGame}
          className="flex items-center gap-3"
        >
          <Play className="w-6 h-6" />
          התחל משחק חדש!
        </Button>
      </div>
    </div>
  );
}
