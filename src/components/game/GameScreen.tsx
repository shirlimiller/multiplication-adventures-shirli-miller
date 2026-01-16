import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { FlyingStars } from './FlyingStars';
import { StarHUD } from './StarHUD';
import { WorldProgressBar } from './WorldProgressBar';
import { SmartFeedback } from './SmartFeedback';
import { VisualExplanation } from './VisualExplanation';
import { 
  generateAnswerOptions, 
  getEncouragingMessage,
  WORLD_COLORS,
  MASTERY_CONFIG,
  checkTableMastery
} from '@/lib/gameUtils';
import { PlayerStats } from '@/lib/playerTypes';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Zap } from 'lucide-react';

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
  onAnswer: (answer: number, isCorrect: boolean, responseTimeMs: number, starsEarned: number) => void;
  onContinue: () => void;
  onBossUnlock: () => void;
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
  streak,
  totalStars,
  playerStats,
  onAnswer,
  onContinue,
  onBossUnlock,
  showFeedback,
  isCorrect,
  questionStartTime,
}: GameScreenProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number>(0);
  const [starRewards, setStarRewards] = useState<StarReward[]>([]);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [starCounterRef, setStarCounterRef] = useState<HTMLDivElement | null>(null);
  const [pendingStars, setPendingStars] = useState(0);
  
  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  // Check if boss is unlocked for current table
  const { masteredCount } = checkTableMastery(playerStats, multiplier);
  const progressPercent = (masteredCount / 10) * 100;
  const isBossUnlocked = progressPercent >= 100;

  useEffect(() => {
    setOptions(generateAnswerOptions(correctAnswer));
    setSelectedAnswer(null);
    setStarRewards([]);
    setShowStarAnimation(false);
  }, [correctAnswer, multiplier, multiplicand]);

  const calculateStarRewards = useCallback((isCorrect: boolean, isFast: boolean, currentStreak: number): StarReward[] => {
    if (!isCorrect) return [];
    
    const rewards: StarReward[] = [];
    
    // Accuracy star - always for correct answer
    rewards.push({ type: 'accuracy', label: 'תשובה נכונה! ⭐' });
    
    // Speed star - under 4 seconds
    if (isFast) {
      rewards.push({ type: 'speed', label: 'מהירות ברק! ⚡' });
    }
    
    // Streak star - every 3rd consecutive correct
    const newStreak = currentStreak + 1;
    if (newStreak > 0 && newStreak % 3 === 0) {
      rewards.push({ type: 'streak', label: `${newStreak} ברצף! 🔥` });
    }
    
    return rewards;
  }, []);

  const handleAnswer = (answer: number) => {
    if (showFeedback) return;
    
    playClick();
    
    const timeTaken = Date.now() - questionStartTime;
    setResponseTimeMs(timeTaken);
    setSelectedAnswer(answer);
    
    const isAnswerCorrect = answer === correctAnswer;
    const isFast = timeTaken <= MASTERY_CONFIG.maxResponseTimeMs;
    
    // Calculate rewards
    const rewards = calculateStarRewards(isAnswerCorrect, isFast, streak);
    const starsEarned = rewards.length;
    
    if (isAnswerCorrect) {
      setStarRewards(rewards);
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

  const handleStarAnimationComplete = () => {
    setShowStarAnimation(false);
    setPendingStars(0);
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

      {/* Sidebar Progress Bar */}
      <div className="hidden md:flex w-20">
        <WorldProgressBar
          table={multiplier}
          playerStats={playerStats}
          currentSessionCorrect={stars}
          isBossUnlocked={isBossUnlocked}
          isBossMode={false}
          onBossClick={onBossUnlock}
        />
      </div>

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
          <div className={`${WORLD_COLORS[multiplier]} text-white rounded-3xl p-8 shadow-card text-center ${showFeedback && !isCorrect ? 'animate-shake' : ''}`} dir="ltr">
            <div className="text-5xl md:text-6xl font-extrabold">
              {multiplicand} × {multiplier} = ?
            </div>
          </div>

          {/* Show response time ONLY after a fast correct answer */}
          {showFeedback && isCorrect && isFastAnswer && (
            <div className="flex items-center gap-2 bg-blue-500/20 text-blue-500 rounded-xl px-4 py-2 animate-fade-in">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{formatTime(responseTimeMs)} שניות</span>
            </div>
          )}

          {/* Feedback or Visual Explanation */}
          {showFeedback && !isCorrect && (
            <div className="w-full max-w-lg space-y-4">
              <SmartFeedback 
                table={multiplier}
                multiplicand={multiplicand}
                correctAnswer={correctAnswer}
              />
              <VisualExplanation
                multiplier={multiplier}
                multiplicand={multiplicand}
                correctAnswer={correctAnswer}
                mistakeIndex={mistakeCount}
              />
            </div>
          )}

          {/* Answer options */}
          {!showFeedback && (
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

          {/* Continue button */}
          {showFeedback && (
            <Button
              size="lg"
              onClick={onContinue}
              className={`text-xl font-bold px-10 py-6 rounded-2xl shadow-lg transition-all hover:scale-105 ${
                isCorrect 
                  ? 'bg-gradient-gold text-white' 
                  : 'bg-primary text-primary-foreground'
              }`}
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
