import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { AnsweredQuestion, MASTERY_CONFIG, checkDivisionTableMastery, checkTableMastery, Operation } from '@/lib/gameUtils';
import { PlayerStats } from '@/lib/playerTypes';
import { Award, Star, Trophy, RefreshCw, Clock, Zap } from 'lucide-react';

interface SummaryScreenProps {
  answeredQuestions: AnsweredQuestion[];
  score: number;
  stars: number;
  selectedTables: number[];
  operation: Operation;
  playerStats: PlayerStats;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export function SummaryScreen({
  answeredQuestions,
  score,
  stars,
  selectedTables,
  operation,
  playerStats,
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
    <div className="flex-1 flex flex-col items-center justify-center p-6">
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

        {/* Certificates for selected tables (× and ÷) */}
        {selectedTables.length > 0 && (
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              תעודות ללוחות שבחרת
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[...new Set(selectedTables)].sort((a, b) => a - b).map((t) => {
                const mul = checkTableMastery(playerStats, t).isMastered;
                const div = checkDivisionTableMastery(playerStats, t).isMastered;
                const certClass = (earned: boolean) => earned ? 'opacity-100' : 'opacity-30 grayscale blur-[1px]';
                return (
                  <div key={t} className="bg-muted/30 rounded-2xl p-3 text-center">
                    <div className="text-2xl font-extrabold mb-2">{t}</div>
                    <div className="flex justify-center gap-2">
                      <div className={`flex items-center gap-1 bg-background/80 rounded-full px-2 py-1 ${certClass(mul)}`}>
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold">×</span>
                      </div>
                      <div className={`flex items-center gap-1 bg-background/80 rounded-full px-2 py-1 ${certClass(div)}`}>
                        <Award className="w-4 h-4 text-sky-500" />
                        <span className="text-xs font-bold">÷</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-muted/50 rounded-2xl p-4 text-center text-sm text-muted-foreground">
          <p>🎯 כדי לקבל תעודה ללוח:</p>
          <p>כל עובדה (1–10) צריכה {MASTERY_CONFIG.requiredCorrect} תשובות נכונות, ולפחות {MASTERY_CONFIG.requiredFast} מהן מהירות (פחות מ-{MASTERY_CONFIG.maxResponseTimeMs / 1000} שניות)</p>
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
            בחר הגדרות אחרות
          </Button>
        </div>
      </div>
    </div>
  );
}
