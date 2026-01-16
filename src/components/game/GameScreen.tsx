import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { VisualExplanation } from './VisualExplanation';
import { 
  generateAnswerOptions, 
  getEncouragingMessage,
  WORLD_COLORS,
  MASTERY_CONFIG
} from '@/lib/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Star, Clock } from 'lucide-react';

interface GameScreenProps {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  stars: number;
  mistakeCount: number;
  onAnswer: (answer: number, isCorrect: boolean, responseTimeMs: number) => void;
  onContinue: () => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  questionStartTime: number;
}

export function GameScreen({
  multiplier,
  multiplicand,
  correctAnswer,
  currentQuestion,
  totalQuestions,
  score,
  stars,
  mistakeCount,
  onAnswer,
  onContinue,
  showFeedback,
  isCorrect,
  questionStartTime,
}: GameScreenProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  useEffect(() => {
    setOptions(generateAnswerOptions(correctAnswer));
    setSelectedAnswer(null);
    setElapsedTime(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - questionStartTime);
    }, 100);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [correctAnswer, multiplier, multiplicand, questionStartTime]);

  const handleAnswer = (answer: number) => {
    if (showFeedback) return;
    
    playClick();
    
    const timeTaken = Date.now() - questionStartTime;
    setResponseTimeMs(timeTaken);
    setSelectedAnswer(answer);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    const isAnswerCorrect = answer === correctAnswer;
    const isFast = timeTaken <= MASTERY_CONFIG.maxResponseTimeMs;
    
    // Play appropriate sound
    setTimeout(() => {
      if (isAnswerCorrect) {
        if (isFast) {
          playCorrectFast();
        } else {
          playCorrect();
        }
      } else {
        playIncorrect();
      }
    }, 100);
    
    onAnswer(answer, isAnswerCorrect, timeTaken);
  };

  const isFastAnswer = responseTimeMs > 0 && responseTimeMs <= MASTERY_CONFIG.maxResponseTimeMs;
  
  const getMessage = () => {
    if (!showFeedback) {
      return `שאלה ${currentQuestion + 1} מתוך ${totalQuestions} - אתה יכול! 💪`;
    }
    return getEncouragingMessage(isCorrect!, isFastAnswer);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${seconds}.${tenths}`;
  };

  const getTimeColor = () => {
    if (elapsedTime <= 3000) return 'text-success';
    if (elapsedTime <= MASTERY_CONFIG.maxResponseTimeMs) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="flex-1 flex flex-col p-6">
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
        
        <div className="flex items-center gap-4">
          {/* Timer */}
          {!showFeedback && (
            <div className={`flex items-center gap-1 bg-card rounded-2xl px-3 py-2 shadow-soft ${getTimeColor()}`}>
              <Clock className="w-5 h-5" />
              <span className="text-lg font-bold font-mono">{formatTime(elapsedTime)}</span>
            </div>
          )}
          
          <div className="bg-card rounded-2xl px-4 py-2 shadow-soft">
            <span className="text-lg font-bold">{currentQuestion + 1}/{totalQuestions}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <FoxMascot message={getMessage()} animate={!showFeedback} />

        {/* Question - displayed left to right */}
        <div className={`${WORLD_COLORS[multiplier]} text-white rounded-3xl p-8 shadow-card text-center ${showFeedback && !isCorrect ? 'animate-shake' : ''}`} dir="ltr">
          <div className="text-5xl md:text-6xl font-extrabold">
            {multiplicand} × {multiplier} = ?
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
              <div className="space-y-4">
                <div className="text-6xl animate-celebrate">🎉</div>
                {/* Show response time feedback */}
                <div className={`text-xl font-bold ${isFastAnswer ? 'text-success' : 'text-primary'}`}>
                  {isFastAnswer ? (
                    <span className="flex items-center justify-center gap-2">
                      <span>⚡</span>
                      <span>{formatTime(responseTimeMs)} שניות!</span>
                    </span>
                  ) : (
                    <span>{formatTime(responseTimeMs)} שניות</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-3xl p-6 shadow-card">
                <VisualExplanation 
                  multiplier={multiplier} 
                  multiplicand={multiplicand} 
                  correctAnswer={correctAnswer}
                  mistakeIndex={mistakeCount}
                />
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
