import { useState, useEffect, useCallback, useRef } from 'react';
import { FoxMascot } from './FoxMascot';
import { StarHUD } from './StarHUD';
import { FlyingStars } from './FlyingStars';
import { BackButton } from './BackButton';
import { generateQuestionForOperation, getOperationSymbol, Operation, getEncouragingMessage } from '@/lib/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Gauge } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
const DIFFICULTY_CONFIG: Record<Difficulty, { baseSpeed: number; label: string; emoji: string; color: string }> = {
  easy:   { baseSpeed: 0.12, label: 'קל', emoji: '🐢', color: 'hsl(145 60% 55%)' },
  medium: { baseSpeed: 0.22, label: 'בינוני', emoji: '🐇', color: 'hsl(45 90% 60%)' },
  hard:   { baseSpeed: 0.35, label: 'קשה', emoji: '🚀', color: 'hsl(340 80% 65%)' },
};

interface BalloonGameProps {
  selectedNumbers: number[];
  operation: Operation;
  rangeMin: number;
  rangeMax: number;
  totalStars: number;
  isDoubleStarsActive: boolean;
  onGameEnd: (results: { totalScore: number; totalStars: number; correctAnswers: number; totalQuestions: number }) => void;
  onBack: () => void;
}

interface Balloon {
  id: number;
  value: number;
  isCorrect: boolean;
  x: number; // percentage 0-100
  y: number; // percentage, starts at 110 (below screen), goes to -20 (above)
  color: string;
  speed: number; // pixels per frame
  popped: boolean;
  shaking: boolean;
}

interface Question {
  text: string;
  answer: number;
  multiplier: number;
  multiplicand: number;
  operation: Operation;
}

const BALLOON_COLORS = [
  'hsl(340 80% 65%)', // strawberry
  'hsl(200 80% 60%)', // sky blue
  'hsl(45 90% 60%)',  // sunny yellow
  'hsl(145 60% 55%)', // mint green
  'hsl(280 60% 65%)', // grape purple
  'hsl(20 85% 60%)',  // orange
  'hsl(170 60% 55%)', // teal
  'hsl(320 70% 65%)', // pink
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
  const [foxMessage, setFoxMessage] = useState('לחץ על הבלון עם התשובה הנכונה! 🎈');
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [speed, setSpeed] = useState(DIFFICULTY_CONFIG.medium.baseSpeed);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  const nextBalloonId = useRef(0);
  const animFrameRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  // Generate new question and balloons
  const spawnBalloons = useCallback(() => {
    const q = generateQuestion(selectedNumbers, operation, rangeMin, rangeMax);
    setQuestion(q);
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
        y: 110 + Math.random() * 20, // start below screen with slight stagger
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        speed: speed + Math.random() * 0.05,
        popped: false,
        shaking: false,
      };
    });

    setBalloons(newBalloons);
  }, [selectedNumbers, operation, rangeMin, rangeMax, maxBalloons, speed]);

  // Initial spawn
  useEffect(() => {
    if (!gameOver) spawnBalloons();
  }, []);

  // Animation loop
  useEffect(() => {
    if (gameOver) return;

    const animate = () => {
      setBalloons(prev => {
        let anyEscaped = false;
        const updated = prev.map(b => {
          if (b.popped) return b;
          const newY = b.y - b.speed;
          if (newY < -15) anyEscaped = true;
          return { ...b, y: newY };
        });

        // Check if all balloons escaped or popped
        const allGone = updated.every(b => b.popped || b.y < -15);
        if (allGone && updated.length > 0) {
          // If the correct balloon escaped, lose a life
          const correctEscaped = updated.some(b => b.isCorrect && !b.popped && b.y < -15);
          if (correctEscaped) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameOver(true);
                setFoxMessage('המשחק נגמר! כל הכבוד על הניסיון! 🌟');
              }
              return newLives;
            });
            setFoxMessage('אוי, הבלון ברח! ננסה שוב 💪');
          }
          // Spawn new balloons after a short delay
          setTimeout(() => {
            if (!gameOver) spawnBalloons();
          }, 800);
          return updated;
        }
        return updated;
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
      // Pop with confetti!
      playCorrectFast();
      setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, popped: true } : b));
      
      const earned = isDoubleStarsActive ? 4 : 2;
      setScore(s => s + 10);
      setStars(s => s + earned);
      setCorrectCount(c => c + 1);
      setShowStarAnimation(true);
      setFoxMessage(getEncouragingMessage(true, true));

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
          setSpeed(s => Math.min(0.35, s + 0.02));
        }
        return next;
      });

      // Spawn next question after brief pause
      setTimeout(() => {
        if (!gameOver) spawnBalloons();
      }, 600);
    } else {
      // Wrong answer - shake
      playIncorrect();
      setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, shaking: true } : b));
      setFoxMessage(`לא נכון... חפש את ${question.answer}! 🤔`);
      setTimeout(() => {
        setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, shaking: false } : b));
      }, 500);
    }
  }, [gameOver, isDoubleStarsActive, maxBalloons, playClick, playCorrectFast, playIncorrect, question.answer, spawnBalloons]);

  const handleEndGame = () => {
    onGameEnd({
      totalScore: score,
      totalStars: stars,
      correctAnswers: correctCount,
      totalQuestions: questionNum,
    });
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-village-map flex flex-col items-center justify-center p-6 gap-6">
        <FoxMascot message={`סיימת עם ${correctCount} תשובות נכונות ו-${stars} כוכבים! 🎉`} />
        <div className="grid grid-cols-3 gap-4 max-w-md w-full">
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-2xl font-extrabold">{correctCount}</div>
            <div className="text-xs text-muted-foreground">נכונות</div>
          </div>
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-2xl font-extrabold">{stars}</div>
            <div className="text-xs text-muted-foreground">כוכבים</div>
          </div>
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-extrabold">{score}</div>
            <div className="text-xs text-muted-foreground">ניקוד</div>
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
              setSpeed(0.15);
              spawnBalloons();
            }}
            className="bg-primary text-primary-foreground font-bold text-xl px-8 py-4 rounded-full shadow-card hover:scale-105 transition-transform"
          >
            שחק שוב! 🎮
          </button>
          <button
            onClick={onBack}
            className="bg-muted text-foreground font-bold text-xl px-8 py-4 rounded-full shadow-card hover:scale-105 transition-transform"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col relative overflow-hidden select-none">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <StarHUD totalStars={totalStars} sessionStars={stars} />
        {/* Lives */}
        <div className="flex gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={`text-2xl transition-all ${i < lives ? 'scale-100' : 'scale-75 opacity-30 grayscale'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Question display - ellipse with balloon decorations */}
      <div className="relative z-20 flex justify-center mb-4">
        <div className="relative">
          {/* Decorative mini balloons around the ellipse */}
          <div className="absolute -top-3 -left-4 text-2xl animate-float" style={{ animationDelay: '0s' }}>🎈</div>
          <div className="absolute -top-2 -right-4 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🎈</div>
          <div className="absolute -bottom-2 left-2 text-xl animate-float" style={{ animationDelay: '1s' }}>🎈</div>
          <div className="absolute -bottom-1 right-2 text-xl animate-float" style={{ animationDelay: '1.5s' }}>🎈</div>
          
          <div 
            className="bg-card border-[4px] border-accent shadow-gold px-10 py-5 text-center"
            style={{ borderRadius: '50%' }}
          >
            <div className="text-4xl md:text-5xl font-extrabold text-foreground" dir="ltr">
              {question.text} = ?
            </div>
          </div>
        </div>
      </div>

      {/* Fox */}
      <div className="relative z-20 flex justify-center mb-2">
        <FoxMascot message={foxMessage} className="scale-75" />
      </div>

      {/* Balloon area */}
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
            }}
          >
            {/* Balloon SVG */}
            <div className="relative">
              <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
                {/* String */}
                <path d="M40 80 Q42 90 38 100" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" />
                {/* Balloon body */}
                <ellipse cx="40" cy="42" rx="32" ry="38" fill={balloon.color} />
                {/* Shine */}
                <ellipse cx="28" cy="30" rx="8" ry="12" fill="white" opacity="0.3" transform="rotate(-20 28 30)" />
                {/* Knot */}
                <polygon points="36,78 40,82 44,78 40,74" fill={balloon.color} />
              </svg>
              {/* Number on balloon */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: '20px' }}>
                <span className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">
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
      <div className="relative z-20 bg-card/90 backdrop-blur-sm border-t-2 border-border p-3 flex justify-around items-center">
        <div className="text-center">
          <div className="text-lg font-bold">{correctCount}</div>
          <div className="text-xs text-muted-foreground">נכונות 🎯</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{stars}</div>
          <div className="text-xs text-muted-foreground">כוכבים ⭐</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{maxBalloons}</div>
          <div className="text-xs text-muted-foreground">בלונים 🎈</div>
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
