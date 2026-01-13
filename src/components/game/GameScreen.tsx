import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { 
  generateAnswerOptions, 
  getVisualExplanation, 
  getEncouragingMessage,
  WORLD_COLORS
} from '@/lib/gameUtils';
import { Star } from 'lucide-react';

interface GameScreenProps {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  stars: number;
  onAnswer: (answer: number, isCorrect: boolean) => void;
  onContinue: () => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
}

export function GameScreen({
  multiplier,
  multiplicand,
  correctAnswer,
  currentQuestion,
  totalQuestions,
  score,
  stars,
  onAnswer,
  onContinue,
  showFeedback,
  isCorrect,
}: GameScreenProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    setOptions(generateAnswerOptions(correctAnswer));
    setSelectedAnswer(null);
  }, [correctAnswer, multiplier, multiplicand]);

  const handleAnswer = (answer: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    onAnswer(answer, answer === correctAnswer);
  };

  const getMessage = () => {
    if (!showFeedback) {
      return `שאלה ${currentQuestion + 1} מתוך ${totalQuestions} - אתה יכול! 💪`;
    }
    return getEncouragingMessage(isCorrect!);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-background to-muted">
      {/* Header with progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-2 shadow-soft">
          <Star className="w-6 h-6 text-accent fill-accent" />
          <span className="text-xl font-bold">{stars}</span>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-gold transition-all duration-500 rounded-full"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="bg-card rounded-2xl px-4 py-2 shadow-soft">
          <span className="text-lg font-bold">{currentQuestion + 1}/{totalQuestions}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <FoxMascot message={getMessage()} animate={!showFeedback} />

        {/* Question */}
        <div className={`${WORLD_COLORS[multiplier]} text-white rounded-3xl p-8 shadow-card text-center ${showFeedback && !isCorrect ? 'animate-shake' : ''}`}>
          <div className="text-5xl md:text-6xl font-extrabold">
            {multiplier} × {multiplicand} = ?
          </div>
        </div>

        {/* Answer options */}
        {!showFeedback ? (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {options.map((option) => (
              <Button
                key={option}
                variant="answer"
                size="xl"
                onClick={() => handleAnswer(option)}
                className={selectedAnswer === option ? 'border-primary' : ''}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 text-center max-w-lg">
            {isCorrect ? (
              <div className="text-6xl animate-celebrate">🎉</div>
            ) : (
              <div className="bg-card rounded-3xl p-6 shadow-card space-y-4">
                <p className="text-xl font-medium">
                  התשובה הנכונה היא: <span className="text-2xl font-bold text-primary">{correctAnswer}</span>
                </p>
                <p className="text-lg text-muted-foreground">
                  {multiplier} קבוצות, בכל אחת {multiplicand} פריטים:
                </p>
                <div className="text-3xl leading-loose break-all">
                  {getVisualExplanation(multiplier, multiplicand)}
                </div>
                <p className="text-lg font-medium">
                  = {correctAnswer}
                </p>
              </div>
            )}

            <Button
              variant="game"
              size="lg"
              onClick={onContinue}
              className="mt-4"
            >
              {currentQuestion + 1 < totalQuestions ? 'השאלה הבאה! ➡️' : 'לסיכום! 🏆'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
