import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { FlyingStars } from './FlyingStars';
import { StarHUD } from './StarHUD';
import { SmartFeedback } from './SmartFeedback';
import { VisualExplanation } from './VisualExplanation';
import { NumberPad } from './NumberPad';
import { GameMode } from './SetupScreen';
import { 
  generateAnswerOptions, 
  getEncouragingMessage,
  WORLD_COLORS,
  MASTERY_CONFIG,
  getOperationSymbol,
  Operation
} from '@/lib/gameUtils';
import { PlayerStats } from '@/lib/playerTypes';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Lightbulb } from 'lucide-react';

interface StarReward {
  type: 'accuracy' | 'speed' | 'streak';
  label: string;
}

interface GameScreenProps {
  multiplier: number;
  multiplicand: number;
  correctAnswer: number;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  stars: number;
  mistakeCount: number;
  streak: number;
  totalStars: number;
  playerStats: PlayerStats;
  gameMode: GameMode;
  operation: Operation;
  onAnswer: (answer: number, isCorrect: boolean, responseTimeMs: number, starsEarned: number) => void;
  onContinue: () => void;
  onBossUnlock: () => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  questionStartTime: number;
  hintUsedInCurrentQuestion: boolean;
  onHintUsed: () => void;
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
  streak,
  totalStars,
  playerStats,
  gameMode,
  operation,
  onAnswer,
  onContinue,
  onBossUnlock,
  showFeedback,
  isCorrect,
  questionStartTime,
  hintUsedInCurrentQuestion,
  onHintUsed,
}: GameScreenProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number>(0);
  const [starRewards, setStarRewards] = useState<StarReward[]>([]);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [starCounterRef, setStarCounterRef] = useState<HTMLDivElement | null>(null);
  const [pendingStars, setPendingStars] = useState(0);
  const [showMultipleChoice, setShowMultipleChoice] = useState(false);
  
  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  // Auto-advance to next question when answer is correct (1.4s) or wrong (4s)
  useEffect(() => {
    if (!showFeedback) return;
    const delay = isCorrect ? 1400 : 4000;
    const timer = setTimeout(() => onContinue(), delay);
    return () => clearTimeout(timer);
  }, [showFeedback, isCorrect, onContinue]);

  useEffect(() => {
    setOptions(generateAnswerOptions(correctAnswer));
    setSelectedAnswer(null);
    setStarRewards([]);
    setShowStarAnimation(false);
    setShowMultipleChoice(false);
  }, [correctAnswer, multiplier, multiplicand]);

  const calculateStarRewards = useCallback((isCorrect: boolean, isFast: boolean, currentStreak: number, mode: GameMode, hintUsed: boolean): { rewards: StarReward[], starsEarned: number, rewardMessage: string } => {
    if (!isCorrect) return { rewards: [], starsEarned: 0, rewardMessage: '' };
    
    const BASE_REWARD = 2; // Base stars per correct answer
    const TEST_MODE_MULTIPLIER = 2; // 2x multiplier for test mode without hint
    
    let starsEarned = BASE_REWARD;
    let rewardMessage = '';
    
    // In test mode, if no hint was used, apply 2x multiplier
    if (mode === 'test' && !hintUsed) {
      starsEarned = BASE_REWARD * TEST_MODE_MULTIPLIER;
      rewardMessage = 'Perfect! You earned 4 stars (Test Bonus!)';
    } else if (mode === 'test' && hintUsed) {
      starsEarned = BASE_REWARD;
      rewardMessage = 'Good job! You used a hint and earned 2 stars.';
    } else {
      // Training mode - base reward
      starsEarned = BASE_REWARD;
      rewardMessage = `Perfect! You earned ${BASE_REWARD} stars!`;
    }
    
    const rewards: StarReward[] = [];
    
    // Accuracy star - always for correct answer
    rewards.push({ type: 'accuracy', label: 'תשובה נכונה! ⭐' });
    
    // Speed star - under threshold (4s for training, 6s for test)
    if (isFast) {
      rewards.push({ type: 'speed', label: mode === 'test' ? 'יודע בעל פה! 🎓' : 'מהירות ברק! ⚡' });
    }
    
    // Streak star - every 3rd consecutive correct
    const newStreak = currentStreak + 1;
    if (newStreak > 0 && newStreak % 3 === 0) {
      rewards.push({ type: 'streak', label: `${newStreak} ברצף! 🔥` });
    }
    
    // Note: The starsEarned is now based on base reward and test mode multiplier
    // The additional rewards (speed, streak) are visual feedback but don't add to base count
    // We'll use the calculated starsEarned value
    
    return { rewards, starsEarned, rewardMessage };
  }, []);

  const handleAnswer = (answer: number) => {
    if (showFeedback) return;
    
    playClick();
    
    const timeTaken = Date.now() - questionStartTime;
    setResponseTimeMs(timeTaken);
    setSelectedAnswer(answer);
    
    const isAnswerCorrect = answer === correctAnswer;
    // Use different time threshold based on game mode
    const timeThreshold = gameMode === 'test' ? MASTERY_CONFIG.testModeMaxTimeMs : MASTERY_CONFIG.maxResponseTimeMs;
    const isFast = timeTaken <= timeThreshold;
    
    // Calculate rewards with hint consideration
    const rewardResult = calculateStarRewards(isAnswerCorrect, isFast, streak, gameMode, hintUsedInCurrentQuestion);
    const starsEarned = rewardResult.starsEarned;
    
    if (isAnswerCorrect) {
      setStarRewards(rewardResult.rewards);
      setShowStarAnimation(true);
      setPendingStars(starsEarned);
      
      if (isFast) {
        playCorrectFast();
      } else {
        playCorrect();
      }
    } else {
      playIncorrect();
    }
    
    onAnswer(answer, isAnswerCorrect, timeTaken, starsEarned);
  };

  const handleHintClick = () => {
    if (showFeedback || hintUsedInCurrentQuestion) return;
    
    playClick();
    setShowMultipleChoice(true);
    onHintUsed();
  };

  const handleStarAnimationComplete = () => {
    setShowStarAnimation(false);
    setPendingStars(0);
  };

  const timeThreshold = gameMode === 'test' ? MASTERY_CONFIG.testModeMaxTimeMs : MASTERY_CONFIG.maxResponseTimeMs;
  const isFastAnswer = responseTimeMs > 0 && responseTimeMs <= timeThreshold;
  
  const getMessage = () => {
    if (!showFeedback) {
      return `שאלה ${currentQuestion + 1} מתוך ${totalQuestions} - אתה יכול! 💪`;
    }
    return getEncouragingMessage(isCorrect!, isFastAnswer);
  };

  // Get star counter position for flying animation
  const getStarCounterPosition = () => {
    if (starCounterRef) {
      const rect = starCounterRef.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: 60, y: 40 };
  };

  return (
    <div className="flex-1 flex p-4 gap-4">
      {/* Flying Stars Animation */}
      {showStarAnimation && (
        <FlyingStars
          rewards={starRewards}
          onAnimationComplete={handleStarAnimationComplete}
          targetPosition={getStarCounterPosition()}
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Star HUD */}
        <div className="flex justify-between items-center mb-4">
          <StarHUD 
            totalStars={totalStars} 
            sessionStars={stars + pendingStars}
            onStarCounterRef={setStarCounterRef}
          />
          
          <div className="flex-1 mx-4">
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-gold transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Streak indicator */}
          {streak >= 2 && (
            <div className="flex items-center gap-1 bg-orange-500/20 text-orange-500 rounded-xl px-3 py-1">
              <span className="text-lg">🔥</span>
              <span className="font-bold">{streak}</span>
            </div>
          )}
        </div>

        {/* Game Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <FoxMascot message={getMessage()} animate={!showFeedback} />

          {/* Question - displayed left to right, NO TIMER during question */}
          <div className="flex flex-col items-center gap-3">
          <div className={`${operation === 'multiply' ? WORLD_COLORS[multiplier] : 'bg-primary'} text-white rounded-ac-xl p-8 shadow-card text-center border-[3px] border-white/20 ${showFeedback && !isCorrect ? 'animate-shake' : ''}`} dir="ltr">
              <div className="text-5xl md:text-6xl font-extrabold">
                {(operation === 'divide' || operation === 'subtract')
                  ? `${multiplier} ${getOperationSymbol(operation)} ${multiplicand} = ?`
                  : `${multiplicand} ${getOperationSymbol(operation)} ${multiplier} = ?`}
              </div>
            </div>
            
            {/* 2x Stars Badge - only in test mode, disappears when hint is used */}
            {gameMode === 'test' && !showFeedback && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 ${
                hintUsedInCurrentQuestion 
                  ? 'bg-muted/50 text-muted-foreground/50' 
                  : 'bg-accent/20 text-accent animate-pulse'
              }`}>
                <span className="text-lg">⭐</span>
                <span className="font-bold">2x כוכבים</span>
                {hintUsedInCurrentQuestion && (
                  <span className="text-xs ml-2">(בונוס בוטל)</span>
                )}
              </div>
            )}
          </div>


          {/* Feedback */}
          {showFeedback && !isCorrect && (
            <div className="w-full max-w-lg space-y-4">
              <SmartFeedback 
                table={multiplier}
                multiplicand={multiplicand}
                correctAnswer={correctAnswer}
              />
            </div>
          )}

          {/* Answer input - Number Pad for test mode OR Multiple Choice if hint was used */}
          {gameMode === 'test' && !showMultipleChoice && !showFeedback && (
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <NumberPad
                onSubmit={handleAnswer}
                onContinue={onContinue}
                disabled={showFeedback}
                correctAnswer={correctAnswer}
                showResult={showFeedback}
                isCorrect={isCorrect}
                gameMode={gameMode}
              />
              
              {/* Hint Button - only visible in test mode before feedback */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleHintClick}
                disabled={showFeedback || hintUsedInCurrentQuestion}
                className="flex items-center gap-2 text-lg font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-soft border-accent text-accent hover:bg-accent/10"
              >
                <Lightbulb className="w-5 h-5" />
                <span>רמז 💡</span>
              </Button>
            </div>
          )}

          {/* Multiple Choice Options - shown when hint is used in test mode */}
          {gameMode === 'test' && showMultipleChoice && !showFeedback && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {options.map((option) => (
                <Button
                  key={option}
                  variant="secondary"
                  size="lg"
                  onClick={() => handleAnswer(option)}
                  className="text-3xl font-bold py-8 rounded-2xl hover:scale-105 transition-transform shadow-soft"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {/* Number Pad for test mode feedback - V turns green when correct */}
          {gameMode === 'test' && showFeedback && (
            <NumberPad
              onSubmit={handleAnswer}
              onContinue={onContinue}
              disabled={showFeedback}
              correctAnswer={correctAnswer}
              showResult={showFeedback}
              isCorrect={isCorrect}
              gameMode={gameMode}
            />
          )}

          {!showFeedback && gameMode === 'training' && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {options.map((option) => (
                <Button
                  key={option}
                  variant="secondary"
                  size="lg"
                  onClick={() => handleAnswer(option)}
                  className="text-3xl font-bold py-8 rounded-2xl hover:scale-105 transition-transform shadow-soft"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {/* Continue button - only for wrong answers (correct auto-advances) */}
          {showFeedback && !isCorrect && (
            <Button
              size="lg"
              onClick={onContinue}
              className="text-xl font-bold px-10 py-6 rounded-2xl shadow-lg transition-all hover:scale-105 bg-primary text-primary-foreground"
            >
              {currentQuestion + 1 >= totalQuestions ? 'סיום! 🎉' : 'המשך ➡️'}
            </Button>
          )}
        </div>

        {/* Mobile progress indicator */}
        <div className="md:hidden flex justify-center gap-1 mt-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div 
              key={i}
              className={`w-2 h-8 rounded-full transition-all ${
                i < (stars % 10) ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
