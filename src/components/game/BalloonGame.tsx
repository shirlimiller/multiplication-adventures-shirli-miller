import { useState, useEffect, useCallback, useRef } from 'react';
import { StarHUD } from './StarHUD';
import { FlyingStars } from './FlyingStars';
import { BackButton } from './BackButton';
import { FoxMascot } from './FoxMascot';
import { CharacterId } from '@/lib/characterTypes';
import { PlayerClothing } from '@/lib/clothingTypes';
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
  characterId?: CharacterId;
  clothing?: PlayerClothing;
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
  characterId,
  clothing,
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
  const [flyingGoldStars, setFlyingGoldStars] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [speed, setSpeed] = useState(DIFFICULTY_CONFIG.medium.baseSpeed);
  const [speedLocked, setSpeedLocked] = useState(false);
  
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
      return {
        id: nextBalloonId.current++,
        value: val,
        isCorrect: val === q.answer,
        x,
        y: 110 + Math.random() * 20,
        color: isGoldQuestion ? 'hsl(45 100% 50%)' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        speed: speed + Math.random() * 0.05,
        popped: false,
        shaking: false,
        isGold: isGoldQuestion,
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

      // Flying gold stars animation for gold balloons
      if (balloon.isGold) {
        const balloonEl = document.querySelector(`[data-balloon-id="${balloon.id}"]`);
        const rect = balloonEl?.getBoundingClientRect();
        const startX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const startY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        setFlyingGoldStars([
          { id: Date.now(), startX, startY },
          { id: Date.now() + 1, startX: startX + 20, startY: startY - 10 },
        ]);
        setTimeout(() => setFlyingGoldStars([]), 1500);
      }

      // Confetti burst
      const newConfetti = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: balloon.x,
        y: balloon.y,
      }));
      setConfetti(newConfetti);
      setTimeout(() => setConfetti([]), 1000);

      // Increase difficulty every correct answer (gradual speed increase)
      setCorrectCount(prev => {
        const next = prev + 1;
        if (next % 3 === 0 && maxBalloons < 8) {
          setMaxBalloons(m => Math.min(8, m + 1));
        }
        // Gradually increase speed with every correct answer, unless locked
        if (!speedLocked) {
          setSpeed(s => Math.min(DIFFICULTY_CONFIG[difficulty].baseSpeed * 3, s + 0.008));
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
  }, [gameOver, isDoubleStarsActive, maxBalloons, playClick, playCorrectFast, playIncorrect, question.answer, spawnBalloons, difficulty, speedLocked]);

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
        } characterId={characterId} clothing={clothing} />
        
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
              setSpeedLocked(false);
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
      <div className="relative z-20 flex items-center justify-between p-2 md:p-4 pointer-events-none [&>*]:pointer-events-auto">
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

      {/* Left side - Lives + Speed controls + Stats */}
      <div className="absolute top-14 md:top-16 left-2 md:left-4 z-20 flex flex-col items-center gap-2 pointer-events-none [&>*]:pointer-events-auto">
        {/* Lives */}
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={`text-xl md:text-2xl transition-all ${i < lives ? 'scale-100' : 'scale-75 opacity-30 grayscale'}`}>
              ❤️
            </span>
          ))}
        </div>

        {/* Speed controls */}
        <div className="flex flex-col items-center gap-1">
          {/* Increase speed button */}
          <button
            onClick={() => {
              playClick();
              const keys: Difficulty[] = ['easy', 'medium', 'hard'];
              const idx = keys.indexOf(difficulty);
              if (idx < keys.length - 1) {
                const next = keys[idx + 1];
                setDifficulty(next);
                setSpeed(DIFFICULTY_CONFIG[next].baseSpeed);
                setSpeedLocked(false);
              }
            }}
            disabled={difficulty === 'hard'}
            className="bg-card/90 backdrop-blur-sm rounded-xl px-2 py-1 shadow-card border border-border hover:scale-105 transition-transform disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="text-xs font-bold">מהר</span>
          </button>

          {/* Speedometer gauge */}
          <div className="flex flex-col items-center bg-card/90 backdrop-blur-sm rounded-2xl px-2 py-1.5 shadow-card border-2 border-border">
            <svg width="52" height="34" viewBox="0 0 100 60" className="md:w-[64px] md:h-[40px]">
              <path d="M 10 55 A 45 45 0 0 1 36.7 13.5" fill="none" stroke="hsl(145 70% 45%)" strokeWidth="10" strokeLinecap="round" />
              <path d="M 36.7 13.5 A 45 45 0 0 1 63.3 13.5" fill="none" stroke="hsl(35 90% 55%)" strokeWidth="10" strokeLinecap="round" />
              <path d="M 63.3 13.5 A 45 45 0 0 1 90 55" fill="none" stroke="hsl(0 75% 55%)" strokeWidth="10" strokeLinecap="round" />
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
            <span className="text-[10px] font-extrabold">{DIFFICULTY_CONFIG[difficulty].label}</span>
            {speedLocked && <span className="text-[8px] text-muted-foreground">🔒 קבוע</span>}
          </div>

          {/* Decrease speed button */}
          <button
            onClick={() => {
              playClick();
              const keys: Difficulty[] = ['easy', 'medium', 'hard'];
              const idx = keys.indexOf(difficulty);
              if (idx > 0) {
                const prev = keys[idx - 1];
                setDifficulty(prev);
                setSpeed(DIFFICULTY_CONFIG[prev].baseSpeed);
                setSpeedLocked(true);
              }
            }}
            disabled={difficulty === 'easy'}
            className="bg-card/90 backdrop-blur-sm rounded-xl px-2 py-1 shadow-card border border-border hover:scale-105 transition-transform disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="text-xs font-bold">לאט</span>
          </button>
        </div>

        {/* Stats under speed controls */}
        <div className="flex flex-col items-center gap-1 bg-card/80 backdrop-blur-sm rounded-2xl px-2 py-1.5 shadow-card border border-border">
          <div className="flex items-center gap-1">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-extrabold">{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">🎯</span>
            <span className="text-sm font-extrabold">{correctCount}</span>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold">שיא</span>
            <span className={`text-xs font-bold ${correctCount > highScore ? 'text-accent' : 'text-muted-foreground'}`}>
              {Math.max(highScore, correctCount)}
            </span>
          </div>
        </div>
      </div>

      {/* Balloon area - takes all remaining space */}
      <div className="flex-1 relative z-10">
        {balloons.map(balloon => (
          <button
            key={balloon.id}
            data-balloon-id={balloon.id}
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
              {balloon.isGold && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm animate-pulse z-10">⭐⭐</div>
              )}
              <svg width="64" height="80" viewBox="0 0 80 100" className={`drop-shadow-lg md:w-[80px] md:h-[100px] ${balloon.isGold ? 'drop-shadow-[0_0_8px_gold]' : ''}`}>
                <path d="M40 80 Q42 90 38 100" stroke={balloon.isGold ? 'hsl(45 80% 40%)' : 'hsl(var(--muted-foreground))'} strokeWidth="1.5" fill="none" />
                <ellipse cx="40" cy="42" rx="32" ry="38" fill={balloon.color} />
                {balloon.isGold && <ellipse cx="40" cy="42" rx="32" ry="38" fill="url(#goldShine)" opacity="0.4" />}
                <ellipse cx="28" cy="30" rx="8" ry="12" fill="white" opacity={balloon.isGold ? '0.5' : '0.3'} transform="rotate(-20 28 30)" />
                <polygon points="36,78 40,82 44,78 40,74" fill={balloon.color} />
                {balloon.isGold && (
                  <defs>
                    <radialGradient id="goldShine" cx="40%" cy="35%">
                      <stop offset="0%" stopColor="white" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                )}
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


      {/* Flying gold stars to HUD */}
      {flyingGoldStars.map((star, i) => {
        // Target: StarHUD is at top-right
        const targetX = window.innerWidth - 60;
        const targetY = 24;
        return (
          <div
            key={star.id}
            className="fixed z-50 pointer-events-none"
            style={{
              left: star.startX,
              top: star.startY,
              transform: 'scale(1.5)',
              animation: 'none',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
              ...((() => {
                // Use requestAnimationFrame trick via CSS
                return {};
              })()),
            }}
            ref={(el) => {
              if (el) {
                // Trigger fly animation after mount
                setTimeout(() => {
                  el.style.left = `${targetX}px`;
                  el.style.top = `${targetY}px`;
                  el.style.transform = 'scale(0.3)';
                  el.style.opacity = '0';
                }, 50 + i * 150);
              }
            }}
          >
            <span className="text-3xl drop-shadow-[0_0_8px_gold]">⭐</span>
          </div>
        );
      })}

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
