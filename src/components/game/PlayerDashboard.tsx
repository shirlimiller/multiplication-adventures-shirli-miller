import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { PlayerHeader } from './PlayerHeader';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { checkDivisionTableMastery, checkTableMastery } from '@/lib/gameUtils';
import { Award, Play, Target } from 'lucide-react';

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

  const mulCertCount = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => checkTableMastery(stats, t).isMastered).length;
  const divCertCount = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => checkDivisionTableMastery(stats, t).isMastered).length;

  const getWelcomeMessage = () => {
    if (stats.totalGames === 0) {
      return `שלום ${player.name}! 🎉 בוא נתחיל את ההרפתקה הראשונה שלך!`;
    }
    if (mulCertCount >= 10 && divCertCount >= 10) {
      return `${player.name} האלוף/ה! 🏅 אספת את כל התעודות בכפל ובחילוק!`;
    }
    if (mulCertCount > 0 || divCertCount > 0) {
      return `שלום ${player.name}! ✨ כבר יש לך תעודות: כפל ${mulCertCount}/10, חילוק ${divCertCount}/10. בוא נמשיך!`;
    }
    return `שלום ${player.name}! 💪 בוא נתחיל לאסוף תעודות היום!`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-village-map relative">
      {/* Header */}
      <PlayerHeader player={player} stats={stats} onBack={onBack} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 gap-8 max-w-4xl mx-auto w-full">
        <FoxMascot message={getWelcomeMessage()} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-card rounded-2xl p-4 shadow-card text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{mulCertCount}/10</div>
            <div className="text-xs text-muted-foreground">תעודות כפל</div>
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
            <Award className="w-8 h-8 text-sky-500 mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{divCertCount}/10</div>
            <div className="text-xs text-muted-foreground">תעודות חילוק</div>
          </div>
        </div>

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
