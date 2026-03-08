import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { CharacterId } from '@/lib/characterTypes';
import { PlayerClothing } from '@/lib/clothingTypes';
import { Crown, Zap, X, Trophy, Star, Flame } from 'lucide-react';
import { WORLD_COLORS, WORLD_NAMES, generateAnswerOptions, MASTERY_CONFIG } from '@/lib/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface BossChallengeProps {
  table: number;
  onComplete: (success: boolean) => void;
  onExit: () => void;
  characterId?: CharacterId;
  clothing?: PlayerClothing;
}

interface BossQuestion {
  multiplicand: number;
  answer: number;
  answered: boolean;
  correct: boolean;
}

export function BossChallenge({ table, onComplete, onExit }: BossChallengeProps) {
  const [questions, setQuestions] = useState<BossQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [phase, setPhase] = useState<'intro' | 'battle' | 'victory' | 'defeat'>('intro');
  
  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  // Initialize boss questions (random order of 1-10)
  useEffect(() => {
    const shuffled = Array.from({ length: 10 }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map(mult => ({
        multiplicand: mult,
        answer: table * mult,
        answered: false,
        correct: false,
      }));
    setQuestions(shuffled);
  }, [table]);

  // Generate options for current question
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      setOptions(generateAnswerOptions(questions[currentIndex].answer));
      setQuestionStartTime(Date.now());
    }
  }, [questions, currentIndex]);

  const handleAnswer = useCallback((answer: number) => {
    if (showFeedback || phase !== 'battle') return;
    
    playClick();
    
    const currentQuestion = questions[currentIndex];
    const correct = answer === currentQuestion.answer;
    const responseTime = Date.now() - questionStartTime;
    const isFast = responseTime <= MASTERY_CONFIG.maxResponseTimeMs;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Update question status
    setQuestions(prev => prev.map((q, i) => 
      i === currentIndex ? { ...q, answered: true, correct } : q
    ));
    
    if (correct) {
      if (isFast) {
        playCorrectFast();
      } else {
        playCorrect();
      }
      setStreak(prev => prev + 1);
      
      // Check if all questions answered correctly
      if (currentIndex === questions.length - 1) {
        setTimeout(() => setPhase('victory'), 1000);
      } else {
        setTimeout(() => {
          setShowFeedback(false);
          setCurrentIndex(prev => prev + 1);
        }, 1000);
      }
    } else {
      playIncorrect();
      setTimeout(() => setPhase('defeat'), 1500);
    }
  }, [currentIndex, questions, showFeedback, phase, questionStartTime, playClick, playCorrect, playCorrectFast, playIncorrect]);

  const startBattle = () => {
    setPhase('battle');
    setQuestionStartTime(Date.now());
  };

  const handleVictory = () => {
    onComplete(true);
  };

  const handleDefeat = () => {
    onComplete(false);
  };

  const currentQuestion = questions[currentIndex];

  // Intro phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Star 
              key={i}
              className="absolute text-yellow-300/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className={`${WORLD_COLORS[table]} p-6 rounded-3xl shadow-2xl inline-block`}>
            <Crown className="w-20 h-20 text-yellow-300 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-white">{WORLD_NAMES[table]}</h1>
          </div>
          
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-foreground">🏆 אתגר הכתר!</h2>
            <p className="text-muted-foreground">
              כדי לכבוש את העולם, עליך לענות נכון על כל 10 הכפולות של {table} ברצף - בלי אף טעות!
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-500">
              <Flame className="w-5 h-5" />
              <span className="font-bold">אפס טעויות מותרות!</span>
              <Flame className="w-5 h-5" />
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={startBattle}
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-xl px-10 py-6 rounded-2xl shadow-lg"
          >
            <Zap className="w-6 h-6 ml-2" />
            התחל אתגר!
          </Button>
          
          <Button variant="ghost" onClick={onExit} className="text-white/70 hover:text-white">
            <X className="w-5 h-5 ml-1" />
            חזרה
          </Button>
        </div>
      </div>
    );
  }

  // Victory phase
  if (phase === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-500 via-amber-500 to-orange-500 flex flex-col items-center justify-center p-6">
        <div className="relative z-10 text-center space-y-6 animate-bounce-soft">
          <div className="relative">
            <Crown className="w-32 h-32 text-yellow-200 mx-auto drop-shadow-2xl" />
            <div className="absolute inset-0 animate-ping">
              <Crown className="w-32 h-32 text-yellow-200/30 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🎉 כבשת את העולם! 🎉</h1>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-xl text-white font-bold mb-2">
              {WORLD_NAMES[table]} נכבש!
            </p>
            <p className="text-white/90">
              ענית נכון על כל 10 הכפולות ברצף! אתה אלוף! 🏆
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={handleVictory}
            className="bg-white text-amber-600 hover:bg-white/90 font-bold text-xl px-10 py-6 rounded-2xl shadow-lg"
          >
            <Trophy className="w-6 h-6 ml-2" />
            קבל את הכתר!
          </Button>
        </div>
      </div>
    );
  }

  // Defeat phase
  if (phase === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
        <div className="relative z-10 text-center space-y-6">
          <FoxMascot message="לא נורא! נסה שוב - אתה יכול! 💪" animate />
          
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-foreground">כמעט! 🌟</h2>
            <p className="text-muted-foreground">
              הצלחת {streak} מתוך 10! המשך לתרגל ונסה שוב כשאתה מוכן.
            </p>
            <div className="flex justify-center gap-1">
              {questions.map((q, i) => (
                <div 
                  key={i}
                  className={`w-6 h-6 rounded-full ${
                    q.correct ? 'bg-green-500' : q.answered ? 'bg-red-500' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={() => {
                setPhase('intro');
                setStreak(0);
                setCurrentIndex(0);
                setShowFeedback(false);
                setIsCorrect(null);
                // Re-shuffle questions
                const shuffled = Array.from({ length: 10 }, (_, i) => i + 1)
                  .sort(() => Math.random() - 0.5)
                  .map(mult => ({
                    multiplicand: mult,
                    answer: table * mult,
                    answered: false,
                    correct: false,
                  }));
                setQuestions(shuffled);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              נסה שוב
            </Button>
            <Button variant="outline" onClick={handleDefeat}>
              חזרה לתרגול
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Battle phase
  return (
    <div className={`min-h-screen ${WORLD_COLORS[table]} flex flex-col p-6`}>
      {/* Header with streak */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onExit} className="text-white/70 hover:text-white">
          <X className="w-6 h-6" />
        </Button>
        
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
          <Flame className="w-6 h-6 text-orange-300" />
          <span className="text-xl font-bold text-white">{streak}/10</span>
        </div>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((q, i) => (
          <div 
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              q.correct 
                ? 'bg-green-400 scale-110' 
                : q.answered 
                ? 'bg-red-400' 
                : i === currentIndex 
                ? 'bg-white scale-125 ring-2 ring-white/50' 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <FoxMascot 
          message={
            showFeedback 
              ? isCorrect 
                ? 'מעולה! המשך! 🔥' 
                : 'אוי לא...'
              : 'אתה יכול! 💪'
          } 
          animate={!showFeedback} 
        />

        {currentQuestion && (
          <>
            <div className={`bg-white/20 backdrop-blur-sm text-white rounded-3xl p-8 shadow-card text-center ${showFeedback && !isCorrect ? 'animate-shake' : ''}`} dir="ltr">
              <div className="text-5xl md:text-6xl font-extrabold">
                {currentQuestion.multiplicand} × {table} = ?
              </div>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {options.map((option) => (
                <Button
                  key={option}
                  variant="secondary"
                  size="lg"
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className={`
                    text-3xl font-bold py-8 rounded-2xl transition-all
                    ${showFeedback && option === currentQuestion.answer
                      ? 'bg-green-500 text-white ring-4 ring-green-300'
                      : showFeedback && option !== currentQuestion.answer
                      ? 'opacity-50'
                      : 'hover:scale-105'
                    }
                  `}
                >
                  {option}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
