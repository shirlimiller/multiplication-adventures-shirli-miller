import { useState, useEffect, useCallback, useRef } from 'react';
import { StarHUD } from './StarHUD';
import { FlyingStars } from './FlyingStars';
import { BackButton } from './BackButton';
import { FoxMascot } from './FoxMascot';
import { generateQuestionForOperation, getOperationSymbol, Operation, getEncouragingMessage } from '@/lib/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

type Difficulty = 'easy' | 'medium' | 'hard';
const DIFFICULTY_CONFIG: Record<Difficulty, { baseSpeed: number; label: string; emoji: string; color: string; starMultiplier: number }> = {
  easy:   { baseSpeed: 0.08, label: 'לאט', emoji: '🐢', color: 'hsl(145 60% 55%)', starMultiplier: 1 },
  medium: { baseSpeed: 0.14, label: 'בינוני', emoji: '🐇', color: 'hsl(45 90% 60%)', starMultiplier: 1 },
  hard:   { baseSpeed: 0.22, label: 'מהיר', emoji: '🚀', color: 'hsl(340 80% 65%)', starMultiplier: 2 },
};

interface BalloonGameProps {
  selectedNumbers: number[];
  operation: Operation;
  rangeMin: number;
  rangeMax: number;
  totalStars: number;
  highScore: number;
  isDoubleStarsActive: boolean;
  onGameEnd: (results: { totalScore: number; totalStars: number; correctAnswers: number; totalQuestions: number }) => void;
  onBack: () => void;
}

interface Balloon {
  id: number;
  value: number;
  isCorrect: boolean;
  x: number;
  y: number;
  color: string;
  speed: number;
  popped: boolean;
  shaking: boolean;
  isGold: boolean;
}

interface Question {
  text: string;
  answer: number;
  multiplier: number;
  multiplicand: number;
  operation: Operation;
}

const BALLOON_COLORS = [
  'hsl(340 80% 65%)',
  'hsl(200 80% 60%)',
  'hsl(45 90% 60%)',
  'hsl(145 60% 55%)',
  'hsl(280 60% 65%)',
  'hsl(20 85% 60%)',
  'hsl(170 60% 55%)',
  'hsl(320 70% 65%)',
];

function generateQuestion(selectedNumbers: number[], operation: Operation, rangeMin: number, rangeMax: number): Question {
  const result = generateQuestionForOperation({ operation, selectedNumbers, rangeMin, rangeMax });
  const op = result.actualOperation;
  const symbol = getOperationSymbol(op);
  
  const text = (op === 'divide' || op === 'subtract')
    ? `${result.multiplier} ${symbol} ${result.multiplicand}`
    : `${result.multiplicand} ${symbol} ${result.multiplier}`;

  return { text, answer: result.answer, multiplier: result.multiplier, multiplicand: result.multiplicand, operation: op };
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrongs = new Set<number>();
  while (wrongs.size < count) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const val = Math.max(0, correct + offset);
    if (val !== correct) wrongs.add(val);
  }
  return Array.from(wrongs);
}

export function BalloonGame({
  selectedNumbers,
  operation,
  rangeMin,
  rangeMax,
  totalStars,
  highScore,
  isDoubleStarsActive,
  onGameEnd,
  onBack,
}: BalloonGameProps) {
  const [question, setQuestion] = useState<Question>(() => generateQuestion(selectedNumbers, operation, rangeMin, rangeMax));
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [maxBalloons, setMaxBalloons] = useState(2);
  const [lives, setLives] = useState(3);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [speed, setSpeed] = useState(DIFFICULTY_CONFIG.medium.baseSpeed);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const nextBalloonId = useRef(0);
  const animFrameRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  const gameOverRef = useRef(false);
  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  // Keep ref in sync
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Auto-hide intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const t = setTimeout(() => setShowIntro(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showIntro]);

  // Generate new question and balloons
  const spawnBalloons = useCallback(() => {
    const q = generateQuestion(selectedNumbers, operation, rangeMin, rangeMax);
    setQuestion(q);
    
    // Check if this should be a gold balloon question (every 10 questions on hard mode)
    const currentQuestionNum = questionNum + 1;
    const isGoldQuestion = difficulty === 'hard' && currentQuestionNum > 0 && currentQuestionNum % 10 === 0;
    
    setQuestionNum(prev => prev + 1);

    const wrongCount = maxBalloons - 1;
    const wrongs = generateWrongAnswers(q.answer, wrongCount);
    const values = [q.answer, ...wrongs].sort(() => Math.random() - 0.5);

    const newBalloons: Balloon[] = values.map((val, i) => {
      const spacing = 80 / values.length;
      const x = 10 + spacing * i + Math.random() * (spacing * 0.5);
      const isCorrectBalloon = val === q.answer;
      return {
        id: nextBalloonId.current++,
        value: val,
        isCorrect: isCorrectBalloon,
        x,
        y: 110 + Math.random() * 20,
        color: (isGoldQuestion && isCorrectBalloon) ? 'hsl(45 100% 50%)' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        speed: speed + Math.random() * 0.05,
        popped: false,
        shaking: false,
        isGold: isGoldQuestion && isCorrectBalloon,
      };
    });

    setBalloons(newBalloons);
  }, [selectedNumbers, operation, rangeMin, rangeMax, maxBalloons, speed, questionNum, difficulty]);

  // Initial spawn
  useEffect(() => {
    if (!gameOver) spawnBalloons();
  }, []);

  // Animation loop - correct balloon reappears from bottom when it escapes
  useEffect(() => {
    if (gameOver) return;

    const animate = () => {
      setBalloons(prev => {
        const updated = prev.map(b => {
          if (b.popped) return b;
          const newY = b.y - b.speed;
          return { ...b, y: newY };
        });

        // Recycle: wrong balloons that escaped are gone, correct balloon respawns from bottom but loses a life
        let correctEscaped = false;
        const recycled = updated.map(b => {
          if (b.popped) return b;
          if (b.y < -15) {
            if (b.isCorrect) {
              correctEscaped = true;
              // Correct balloon reappears from bottom with new x position
              return {
                ...b,
                y: 110 + Math.random() * 10,
                x: 10 + Math.random() * 70,
              };
            } else {
              // Wrong balloon disappears
              return { ...b, popped: true };
            }
          }
          return b;
        });

        if (correctEscaped) {
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setEndTime(Date.now());
            }
            return newLives;
          });
        }

        return recycled;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameOver, spawnBalloons]);

  const handleBalloonClick = useCallback((balloon: Balloon) => {
    if (balloon.popped || gameOver) return;
    playClick();

    if (balloon.isCorrect) {
      playCorrectFast();
      setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, popped: true } : b));
      
      const earned = balloon.isGold ? 2 : 1;
      setScore(s => s + (balloon.isGold ? 20 : 10));
      setStars(s => s + earned);
      setCorrectCount(c => c + 1);
      setShowStarAnimation(true);

      // Confetti burst
      const newConfetti = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: balloon.x,
        y: balloon.y,
      }));
      setConfetti(newConfetti);
      setTimeout(() => setConfetti([]), 1000);

      // Increase difficulty every 3 correct answers
      setCorrectCount(prev => {
        const next = prev + 1;
        if (next % 3 === 0 && maxBalloons < 8) {
          setMaxBalloons(m => Math.min(8, m + 1));
          setSpeed(s => Math.min(DIFFICULTY_CONFIG[difficulty].baseSpeed * 2.5, s + 0.02));
        }
        return next;
      });

      // Spawn next question after brief pause
      setTimeout(() => {
        if (!gameOverRef.current) spawnBalloons();
      }, 600);
    } else {
      // Wrong answer - shake & lose a life
      playIncorrect();
      setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, shaking: true } : b));
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setEndTime(Date.now());
        }
        return newLives;
      });
      setTimeout(() => {
        setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, shaking: false } : b));
      }, 500);
    }
  }, [gameOver, isDoubleStarsActive, maxBalloons, playClick, playCorrectFast, playIncorrect, question.answer, spawnBalloons, difficulty]);

  const isNewHighScore = correctCount > highScore;

  if (gameOver) {
    const elapsedMs = (endTime || Date.now()) - startTime;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    const timeStr = minutes > 0 ? `${minutes} דקות ו-${seconds} שניות` : `${seconds} שניות`;

    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-sky flex flex-col items-center justify-center p-6 gap-6" dir="rtl">
        <FoxMascot message={isNewHighScore 
          ? `שיא חדש! 🎉 ${correctCount} תשובות נכונות!` 
          : `כל הכבוד! ענית ${correctCount} תשובות נכונות! 🎉`
        } />
        
        {isNewHighScore && (
          <div className="text-2xl font-extrabold text-accent animate-bounce">🏆 שיא חדש! 🏆</div>
        )}

        <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-2xl font-extrabold">{correctCount}</div>
            <div className="text-[10px] text-muted-foreground">תשובות נכונות</div>
          </div>
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">⏱️</div>
            <div className="text-lg font-extrabold">{timeStr}</div>
            <div className="text-[10px] text-muted-foreground">זמן משחק</div>
          </div>
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-2xl font-extrabold">{stars}</div>
            <div className="text-[10px] text-muted-foreground">כוכבים</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setGameOver(false);
              setLives(3);
              setScore(0);
              setStars(0);
              setCorrectCount(0);
              setQuestionNum(0);
              setMaxBalloons(2);
              setSpeed(DIFFICULTY_CONFIG[difficulty].baseSpeed);
              spawnBalloons();
            }}
            className="bg-primary text-primary-foreground font-bold text-xl px-8 py-4 rounded-full shadow-card hover:scale-105 transition-transform"
          >
            שחק שוב! 🎮
          </button>
          <button
            onClick={() => onGameEnd({
              totalScore: score,
              totalStars: stars,
              correctAnswers: correctCount,
              totalQuestions: questionNum,
            })}
            className="bg-muted text-foreground font-bold text-xl px-8 py-4 rounded-full shadow-card hover:scale-105 transition-transform"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-sky flex flex-col relative overflow-hidden select-none">
      {/* Intro overlay */}
      {showIntro && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowIntro(false)}
        >
          <div className="bg-card rounded-3xl p-8 mx-6 shadow-card border-4 border-accent text-center animate-scale-in max-w-sm">
            <div className="text-5xl mb-4">🎈</div>
            <div className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              לחץ על הבלון עם התשובה הנכונה!
            </div>
            <div className="text-base text-muted-foreground">
              לחץ כדי להתחיל...
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-2 md:p-4">
        <BackButton onClick={() => onGameEnd({
          totalScore: score,
          totalStars: stars,
          correctAnswers: correctCount,
          totalQuestions: questionNum,
        })} />
        
        {/* Question display - center of header */}
        <div className="relative pointer-events-none">
          <div className="absolute -top-2 -left-3 text-sm md:text-lg animate-float">🎈</div>
          <div className="absolute -top-1 -right-3 text-sm md:text-lg animate-float" style={{ animationDelay: '0.5s' }}>🎈</div>
          <div 
            className="bg-card/95 backdrop-blur-sm border-[3px] border-accent shadow-gold px-4 py-2 md:px-8 md:py-3 text-center"
            style={{ borderRadius: '50%' }}
          >
            <div className="text-2xl md:text-4xl font-extrabold text-foreground" dir="ltr">
              {question.text} = ?
            </div>
          </div>
        </div>

        <StarHUD totalStars={totalStars} sessionStars={stars} />
      </div>

      {/* Lives + Difficulty - left side */}
      <div className="absolute top-14 md:top-16 left-2 md:left-4 z-20 flex flex-col items-center gap-2">
        {/* Lives */}
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={`text-xl md:text-2xl transition-all ${i < lives ? 'scale-100' : 'scale-75 opacity-30 grayscale'}`}>
              ❤️
            </span>
          ))}
        </div>

        {/* Difficulty gauge */}
        <div className="relative">
          <button
            onClick={() => setShowDifficultyPicker(p => !p)}
            className="flex flex-col items-center bg-card/90 backdrop-blur-sm rounded-2xl px-2 py-1.5 shadow-card border-2 border-border hover:scale-105 transition-transform"
          >
            {/* Speedometer SVG gauge */}
            <svg width="52" height="34" viewBox="0 0 100 60" className="md:w-[64px] md:h-[40px]">
              {/* Green arc (easy) */}
              <path d="M 10 55 A 45 45 0 0 1 36.7 13.5" fill="none" stroke="hsl(145 70% 45%)" strokeWidth="10" strokeLinecap="round" />
              {/* Orange arc (medium) */}
              <path d="M 36.7 13.5 A 45 45 0 0 1 63.3 13.5" fill="none" stroke="hsl(35 90% 55%)" strokeWidth="10" strokeLinecap="round" />
              {/* Red arc (hard) */}
              <path d="M 63.3 13.5 A 45 45 0 0 1 90 55" fill="none" stroke="hsl(0 75% 55%)" strokeWidth="10" strokeLinecap="round" />
              {/* Needle */}
              {(() => {
                const angles: Record<Difficulty, number> = { easy: -70, medium: 0, hard: 70 };
                const angle = angles[difficulty];
                const rad = (angle - 90) * Math.PI / 180;
                const nx = 50 + 30 * Math.cos(rad);
                const ny = 55 + 30 * Math.sin(rad);
                return (
                  <>
                    <line x1="50" y1="55" x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="55" r="5" fill="hsl(var(--foreground))" />
                  </>
                );
              })()}
            </svg>
            <span className="text-[8px] text-muted-foreground font-medium">רמת קושי</span>
            <span className="text-[10px] font-extrabold">{DIFFICULTY_CONFIG[difficulty].label}</span>
          </button>
          
          {showDifficultyPicker && (
            <div className="absolute top-full mt-2 left-0 bg-card rounded-2xl shadow-card border-2 border-border p-2 flex flex-col gap-1 animate-fade-in z-30 min-w-[120px]">
              {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.easy][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => {
                    setDifficulty(key);
                    setSpeed(cfg.baseSpeed);
                    setShowDifficultyPicker(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                    difficulty === key ? 'bg-primary/20 scale-105 ring-2 ring-primary' : 'hover:bg-muted'
                  }`}
                >
                  <span className="text-lg">{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Balloon area - takes all remaining space */}
      <div className="flex-1 relative z-10">
        {balloons.map(balloon => (
          <button
            key={balloon.id}
            onClick={() => handleBalloonClick(balloon)}
            disabled={balloon.popped}
            className={`absolute transition-transform cursor-pointer focus:outline-none ${
              balloon.popped ? 'animate-pop scale-150 opacity-0 pointer-events-none' : ''
            } ${balloon.shaking ? 'animate-shake' : ''}`}
            style={{
              left: `${balloon.x}%`,
              bottom: `${100 - balloon.y}%`,
              transform: 'translate(-50%, 50%)',
              transition: balloon.popped ? 'all 0.3s ease-out' : 'none',
              zIndex: 15,
            }}
          >
            <div className="relative">
              <svg width="64" height="80" viewBox="0 0 80 100" className="drop-shadow-lg md:w-[80px] md:h-[100px]">
                <path d="M40 80 Q42 90 38 100" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" />
                <ellipse cx="40" cy="42" rx="32" ry="38" fill={balloon.color} />
                <ellipse cx="28" cy="30" rx="8" ry="12" fill="white" opacity="0.3" transform="rotate(-20 28 30)" />
                <polygon points="36,78 40,82 44,78 40,74" fill={balloon.color} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: '16px' }}>
                <span className="text-xl md:text-3xl font-extrabold text-white drop-shadow-md">
                  {balloon.value}
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* Confetti particles */}
        {confetti.map(c => (
          <div key={c.id} className="absolute pointer-events-none" style={{ left: `${c.x}%`, bottom: `${100 - c.y}%` }}>
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * 360;
              const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#FB923C', '#34D399'];
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: colors[i % colors.length],
                    animation: `confetti-burst 0.8s ease-out forwards`,
                    transform: `rotate(${angle}deg) translateY(-${20 + Math.random() * 40}px)`,
                    opacity: 0,
                  }}
                />
              );
            })}
            <span className="text-3xl animate-pop">💥</span>
          </div>
        ))}
      </div>

      {/* Score bar at bottom */}
      <div className="relative z-20 bg-card/90 backdrop-blur-sm border-t-2 border-border p-2 md:p-3 flex justify-around items-center safe-area-bottom">
        <div className="text-center">
          <div className="text-base md:text-lg font-bold">{correctCount}</div>
          <div className="text-[10px] md:text-xs text-muted-foreground">נכונות 🎯</div>
        </div>
        <div className="text-center">
          <div className="text-base md:text-lg font-bold">{stars}</div>
          <div className="text-[10px] md:text-xs text-muted-foreground">כוכבים ⭐</div>
        </div>
        <div className="text-center">
          <div className={`text-base md:text-lg font-bold ${correctCount > highScore ? 'text-accent' : ''}`}>
            {Math.max(highScore, correctCount)}
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground">שיא 🏆</div>
        </div>
      </div>

      {/* Confetti burst CSS */}
      <style>{`
        @keyframes confetti-burst {
          0% { transform: scale(0) translate(0, 0); opacity: 1; }
          100% { transform: scale(1) translate(var(--tx, 30px), var(--ty, -50px)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
