import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { AnsweredQuestion, WORLD_NAMES, MASTERY_CONFIG, checkTableMastery } from '@/lib/gameUtils';
import { Star, Trophy, Target, RefreshCw, Clock, Zap } from 'lucide-react';

interface SummaryScreenProps {
  answeredQuestions: AnsweredQuestion[];
  score: number;
  stars: number;
  selectedTables: number[];
  conqueredTables: number[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export function SummaryScreen({
  answeredQuestions,
  score,
  stars,
  selectedTables,
  conqueredTables,
  onPlayAgain,
  onChangeSettings,
}: SummaryScreenProps) {
  const totalQuestions = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const avgResponseTime = answeredQuestions.length > 0 
    ? Math.round(answeredQuestions.filter(q => q.isCorrect).reduce((sum, q) => sum + q.responseTimeMs, 0) / Math.max(1, answeredQuestions.filter(q => q.isCorrect).length))
    : 0;
  const fastAnswers = answeredQuestions.filter(q => q.isCorrect && q.responseTimeMs <= MASTERY_CONFIG.maxResponseTimeMs).length;

  // Analyze which tables need more practice
  const tableStats = selectedTables.map(table => {
    const mastery = checkTableMastery(answeredQuestions, table);
    return {
      table,
      ...mastery,
    };
  });

  const masteredTables = tableStats.filter(t => t.isMastered).map(t => t.table);
  const needsPractice = tableStats.filter(t => !t.isMastered);

  const getMessage = () => {
    if (percentage === 100 && fastAnswers >= answeredQuestions.length * 0.7) {
      return 'וואו! מושלם ומהיר! אתה אלוף אמיתי! 🏆👑⚡';
    } else if (percentage === 100) {
      return 'מושלם! עכשיו בוא ננסה להיות גם מהירים יותר! 🌟';
    } else if (percentage >= 80) {
      return 'מעולה! עבודה נהדרת! 🌟';
    } else if (percentage >= 60) {
      return 'יופי! אתה בדרך הנכונה! 💪';
    } else {
      return 'המשך להתאמן, אתה משתפר! 🌈';
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${seconds}.${tenths}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gradient mb-4">סיכום ההרפתקה!</h1>
        </div>

        <FoxMascot message={getMessage()} />

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <Star className="w-8 h-8 text-accent fill-accent mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{stars}</div>
            <div className="text-xs text-muted-foreground">כוכבים</div>
          </div>
          
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{percentage}%</div>
            <div className="text-xs text-muted-foreground">הצלחה</div>
          </div>
          
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{formatTime(avgResponseTime)}</div>
            <div className="text-xs text-muted-foreground">זמן ממוצע</div>
          </div>
          
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <Zap className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{fastAnswers}</div>
            <div className="text-xs text-muted-foreground">תשובות מהירות</div>
          </div>
        </div>

        {/* Mastered tables */}
        {masteredTables.length > 0 && (
          <div className="bg-success/10 border-2 border-success rounded-3xl p-6">
            <h3 className="text-xl font-bold text-success mb-3 flex items-center gap-2">
              <span>🏆</span> עולמות שנכבשו!
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              כל התשובות נכונות ומהירות!
            </p>
            <div className="flex flex-wrap gap-2">
              {masteredTables.map(table => (
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
            <div className="space-y-3">
              {needsPractice.map(({ table, correctCount, fastCount, totalCount, allFast }) => (
                <div key={table} className="bg-card rounded-xl p-3 flex items-center justify-between">
                  <span className="font-bold">{WORLD_NAMES[table]} ({table})</span>
                  <div className="text-sm text-muted-foreground">
                    {!allFast && fastCount < totalCount ? (
                      <span className="text-destructive">{totalCount - fastCount} איטיות מדי</span>
                    ) : correctCount < totalCount ? (
                      <span className="text-destructive">{totalCount - correctCount} טעויות</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mastery requirements explanation */}
        <div className="bg-muted/50 rounded-2xl p-4 text-center text-sm text-muted-foreground">
          <p>🎯 כדי לכבוש עולם:</p>
          <p>כל התשובות צריכות להיות נכונות ומהירות (פחות מ-{MASTERY_CONFIG.maxResponseTimeMs / 1000} שניות)</p>
        </div>

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
