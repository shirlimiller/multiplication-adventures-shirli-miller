import { Lightbulb, Heart } from 'lucide-react';

interface SmartFeedbackProps {
  table: number;
  multiplicand: number;
  correctAnswer: number;
}

// Strategy tips for specific tables
const STRATEGY_TIPS: Record<number, (multiplicand: number) => string> = {
  2: (mult) => `טיפ: פשוט מכפילים! ${mult} כפול 2 = ${mult} + ${mult} = ${mult * 2}`,
  5: (mult) => `טיפ: מכפילים ב-10 ומחלקים ב-2! ${mult} × 10 = ${mult * 10}, חלקי 2 = ${mult * 5}`,
  9: (mult) => `טיפ: מכפילים ב-10 ומחסרים! ${mult} × 10 = ${mult * 10}, פחות ${mult} = ${mult * 9}`,
  10: (mult) => `טיפ: פשוט מוסיפים 0 בסוף! ${mult}0 = ${mult * 10}`,
  4: (mult) => `טיפ: מכפילים ב-2 פעמיים! ${mult} × 2 = ${mult * 2}, × 2 = ${mult * 4}`,
  11: (mult) => `טיפ: המספר כפול עצמו! ${mult}${mult} = ${mult * 11}`,
};

const ENCOURAGEMENT_MESSAGES = [
  'לא נורא! טעויות עוזרות לנו ללמוד 💪',
  'זה בסדר! בוא ננסה להבין יחד 🤗',
  'אל דאגה, אתה בדרך הנכונה! 🌟',
  'כל אחד טועה לפעמים, זה איך שלומדים! 📚',
];

export function SmartFeedback({ table, multiplicand, correctAnswer }: SmartFeedbackProps) {
  const strategyTip = STRATEGY_TIPS[table]?.(multiplicand);
  const encouragement = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft space-y-3 animate-fade-in" dir="rtl">
      {/* Encouragement */}
      <div className="flex items-start gap-2 text-muted-foreground">
        <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm">{encouragement}</p>
      </div>

      {/* Strategy tip (if available for this table) */}
      {strategyTip && (
        <div className="flex items-start gap-2 bg-accent/10 rounded-xl p-3 border border-accent/20">
          <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground" dir="ltr">
              {strategyTip}
            </p>
          </div>
        </div>
      )}

      {/* Show the correct answer */}
      <div className="text-center pt-2 border-t border-muted">
        <p className="text-sm text-muted-foreground">התשובה הנכונה:</p>
        <p className="text-2xl font-bold text-primary" dir="ltr">
          {multiplicand} × {table} = {correctAnswer}
        </p>
      </div>
    </div>
  );
}
