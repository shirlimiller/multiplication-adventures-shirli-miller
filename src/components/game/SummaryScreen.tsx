import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { AnsweredQuestion, WORLD_NAMES } from '@/lib/gameUtils';
import { Star, Trophy, Target, RefreshCw } from 'lucide-react';

interface SummaryScreenProps {
  answeredQuestions: AnsweredQuestion[];
  score: number;
  stars: number;
  selectedTables: number[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export function SummaryScreen({
  answeredQuestions,
  score,
  stars,
  selectedTables,
  onPlayAgain,
  onChangeSettings,
}: SummaryScreenProps) {
  const totalQuestions = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Analyze which tables need more practice
  const tableStats: Record<number, { correct: number; total: number }> = {};
  answeredQuestions.forEach(q => {
    if (!tableStats[q.multiplier]) {
      tableStats[q.multiplier] = { correct: 0, total: 0 };
    }
    tableStats[q.multiplier].total++;
    if (q.isCorrect) {
      tableStats[q.multiplier].correct++;
    }
  });

  const conqueredTables = Object.entries(tableStats)
    .filter(([_, stats]) => stats.correct === stats.total)
    .map(([table]) => parseInt(table));

  const needsPractice = Object.entries(tableStats)
    .filter(([_, stats]) => stats.correct < stats.total)
    .map(([table]) => parseInt(table));

  const getMessage = () => {
    if (percentage === 100) {
      return 'וואו! מושלם! אתה אלוף אמיתי! 🏆👑';
    } else if (percentage >= 80) {
      return 'מעולה! עבודה נהדרת! 🌟';
    } else if (percentage >= 60) {
      return 'יופי! אתה בדרך הנכונה! 💪';
    } else {
      return 'המשך להתאמן, אתה משתפר! 🌈';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gradient mb-4">סיכום ההרפתקה!</h1>
        </div>

        <FoxMascot message={getMessage()} />

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-3xl p-6 shadow-card text-center">
            <Star className="w-10 h-10 text-accent fill-accent mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{stars}</div>
            <div className="text-sm text-muted-foreground">כוכבים</div>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-card text-center">
            <Trophy className="w-10 h-10 text-primary mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{percentage}%</div>
            <div className="text-sm text-muted-foreground">הצלחה</div>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-card text-center">
            <Target className="w-10 h-10 text-success mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{correctAnswers}/{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">תשובות נכונות</div>
          </div>
        </div>

        {/* Conquered tables */}
        {conqueredTables.length > 0 && (
          <div className="bg-success/10 border-2 border-success rounded-3xl p-6">
            <h3 className="text-xl font-bold text-success mb-3 flex items-center gap-2">
              <span>✅</span> עולמות שנכבשו!
            </h3>
            <div className="flex flex-wrap gap-2">
              {conqueredTables.map(table => (
                <span key={table} className="bg-success text-white px-4 py-2 rounded-xl font-bold">
                  {WORLD_NAMES[table]} ({table})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tables that need practice */}
        {needsPractice.length > 0 && (
          <div className="bg-secondary/30 border-2 border-secondary rounded-3xl p-6">
            <h3 className="text-xl font-bold text-secondary mb-3 flex items-center gap-2">
              <span>💪</span> עולמות לתרגול נוסף
            </h3>
            <div className="flex flex-wrap gap-2">
              {needsPractice.map(table => (
                <span key={table} className="bg-secondary text-white px-4 py-2 rounded-xl font-bold">
                  {WORLD_NAMES[table]} ({table})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="game"
            size="lg"
            onClick={onPlayAgain}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            שחק שוב!
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onChangeSettings}
          >
            בחר עולמות אחרים
          </Button>
        </div>
      </div>
    </div>
  );
}
