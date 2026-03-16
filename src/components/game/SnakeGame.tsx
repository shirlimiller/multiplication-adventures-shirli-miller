import { useState, useEffect, useCallback, useRef } from 'react';
import { BackButton } from './BackButton';
import { StarHUD } from './StarHUD';
import { FoxMascot } from './FoxMascot';
import { CharacterId } from '@/lib/characterTypes';
import { PlayerClothing } from '@/lib/clothingTypes';
import { generateQuestionForOperation, getOperationSymbol, Operation } from '@/lib/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface SnakeGameProps {
  selectedNumbers: number[];
  operation: Operation;
  rangeMin: number;
  rangeMax: number;
  totalStars: number;
  highScore: number;
  onGameEnd: (results: { totalStars: number; correctAnswers: number; maxLength: number }) => void;
  onBack: () => void;
  characterId?: CharacterId;
  clothing?: PlayerClothing;
}

interface Position { x: number; y: number }
type Direction = 'up' | 'down' | 'left' | 'right';

interface FoodItem {
  pos: Position;
  value: number;
  isCorrect: boolean;
  id: number;
}

interface Question {
  text: string;
  answer: number;
}

// Denser grid — smaller cells, more room to maneuver
const GRID_W = 32;
const GRID_H = 24;

// Speed: ~3x slower (Nokia-style), then progressive difficulty
const BASE_TICK_MS = 780;
const MIN_TICK_MS = 270;
const MAX_TICK_MS = 960;

function generateQuestion(selectedNumbers: number[], operation: Operation, rangeMin: number, rangeMax: number): Question {
  const result = generateQuestionForOperation({ operation, selectedNumbers, rangeMin, rangeMax });
  const op = result.actualOperation;
  const symbol = getOperationSymbol(op);
  const text = (op === 'divide' || op === 'subtract')
    ? `${result.multiplier} ${symbol} ${result.multiplicand}`
    : `${result.multiplicand} ${symbol} ${result.multiplier}`;
  return { text, answer: result.answer };
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrongs = new Set<number>();
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const val = Math.max(0, correct + offset);
    if (val !== correct) wrongs.add(val);
    attempts++;
  }
  return Array.from(wrongs);
}

function getRandomFreePos(occupied: Set<string>): Position {
  let pos: Position;
  let attempts = 0;
  do {
    pos = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) };
    attempts++;
  } while (occupied.has(`${pos.x},${pos.y}`) && attempts < 200);
  return pos;
}

export function SnakeGame({
  selectedNumbers,
  operation,
  rangeMin,
  rangeMax,
  totalStars,
  highScore,
  onGameEnd,
  onBack,
  characterId,
  clothing,
}: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([
    { x: 16, y: 12 }, { x: 15, y: 12 }, { x: 14, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>('right');
  const [question, setQuestion] = useState<Question>(() => generateQuestion(selectedNumbers, operation, rangeMin, rangeMax));
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [score, setScore] = useState(3);
  const [maxScore, setMaxScore] = useState(3);
  const [stars, setStars] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [paused, setPaused] = useState(true);
  const [tickMs, setTickMs] = useState(BASE_TICK_MS);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; pos: Position } | null>(null);
  const [wrongExplanation, setWrongExplanation] = useState<{ question: string; answer: number } | null>(null);

  const dirRef = useRef(direction);
  const directionQueueRef = useRef<Direction[]>([]);
  const snakeRef = useRef(snake);
  const foodsRef = useRef(foods);
  const gameOverRef = useRef(gameOver);
  const pausedRef = useRef(paused);
  const nextFoodId = useRef(0);
  const questionRef = useRef(question);

  const MAX_QUEUE = 3;
  const pushDirection = useCallback((dir: Direction) => {
    const opposites: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
    const current = dirRef.current;
    if (dir === opposites[current]) return;
    const q = directionQueueRef.current;
    if (q.length >= MAX_QUEUE) return;
    if (q.length > 0 && q[q.length - 1] === dir) return;
    q.push(dir);
  }, []);

  const { playCorrect, playCorrectFast, playIncorrect, playClick } = useSoundEffects();

  // Keep refs in sync
  useEffect(() => { dirRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodsRef.current = foods; }, [foods]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { questionRef.current = question; }, [question]);

  // Generate food items for current question — exactly 3: 1 correct + 2 wrong
  const spawnFoods = useCallback((q: Question, currentSnake: Position[]) => {
    const occupied = new Set(currentSnake.map(s => `${s.x},${s.y}`));
    const wrongs = generateWrongAnswers(q.answer, 2);
    const values = [q.answer, ...wrongs].sort(() => Math.random() - 0.5);
    const newFoods: FoodItem[] = values.map(val => {
      const pos = getRandomFreePos(occupied);
      occupied.add(`${pos.x},${pos.y}`);
      return {
        pos,
        value: val,
        isCorrect: val === q.answer,
        id: nextFoodId.current++,
      };
    });
    setFoods(newFoods);
  }, []);

  // Initial spawn
  useEffect(() => {
    spawnFoods(question, snake);
  }, []);

  // Auto-hide intro
  useEffect(() => {
    if (showIntro) {
      const t = setTimeout(() => { setShowIntro(false); setPaused(false); }, 3000);
      return () => clearTimeout(t);
    }
  }, [showIntro]);

  // Keyboard: push to queue for instant response (order preserved at high speed)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showIntro) { setShowIntro(false); setPaused(false); return; }
      const map: Record<string, Direction> = {
        ArrowUp: 'up', ArrowDown: 'down',
        ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      pushDirection(dir);
      const q = directionQueueRef.current;
      if (q.length > 0) {
        dirRef.current = q[0];
        setDirection(q[0]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showIntro, pushDirection]);

  // Touch/swipe controls
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (showIntro) { setShowIntro(false); setPaused(false); return; }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, [showIntro]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    const opposites: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
    let dir: Direction;
    if (absDx > absDy) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }
    pushDirection(dir);
    const q = directionQueueRef.current;
    if (q.length > 0) {
      dirRef.current = q[0];
      setDirection(q[0]);
    }
    touchStart.current = null;
  }, [pushDirection]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (pausedRef.current || gameOverRef.current) return;

      const q = directionQueueRef.current;
      if (q.length > 0) {
        dirRef.current = q.shift()!;
      }
      setDirection(dirRef.current);

      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const dir = dirRef.current;

      // Move head
      if (dir === 'up') head.y--;
      else if (dir === 'down') head.y++;
      else if (dir === 'left') head.x--;
      else head.x++;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (currentSnake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...currentSnake];
      let ate = false;

      // Check food collision
      const currentFoods = foodsRef.current;
      const eatenFood = currentFoods.find(f => f.pos.x === head.x && f.pos.y === head.y);

      if (eatenFood) {
        if (eatenFood.isCorrect) {
          playCorrectFast();
          setTickMs(prev => Math.max(MIN_TICK_MS, prev - 45));
          // Grow: add 2 segments (don't remove tail + add head = +1, plus keep 1 more)
          const grown = [head, ...currentSnake]; // already +1 from head, keep tail
          setSnake(grown);
          setScore(grown.length);
          setMaxScore(prev => Math.max(prev, grown.length));
          setStars(s => s + 2);
          setCorrectCount(c => c + 1);
          setFeedback({ type: 'correct', pos: head });
          setTimeout(() => setFeedback(null), 800);

          // New question
          const newQ = generateQuestion(selectedNumbers, operation, rangeMin, rangeMax);
          setQuestion(newQ);
          questionRef.current = newQ;

          // Remove eaten food, spawn new set after brief delay
          setFoods([]);
          setTimeout(() => {
            if (!gameOverRef.current) {
              spawnFoods(newQ, snakeRef.current);
            }
          }, 400);
          ate = true;
        } else {
          playIncorrect();
          setTickMs(prev => Math.min(MAX_TICK_MS, prev + 45));
          // Shrink: remove 1 segment
          const shrunk = newSnake.slice(0, -2); // remove tail twice (head added + remove 2 = net -1)
          if (shrunk.length < 2) {
            setGameOver(true);
            return;
          }
          setSnake(shrunk);
          setScore(shrunk.length);
          setFeedback({ type: 'wrong', pos: head });
          setWrongExplanation({ question: questionRef.current.text, answer: questionRef.current.answer });
          setTimeout(() => { setFeedback(null); setWrongExplanation(null); }, 2500);

          // Remove only the wrong food, keep others
          setFoods(prev => prev.filter(f => f.id !== eatenFood.id));
          ate = true;
        }
      }

      if (!ate) {
        // Normal move: remove tail
        newSnake.pop();
        setSnake(newSnake);
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [gameOver, tickMs, selectedNumbers, operation, rangeMin, rangeMax, spawnFoods, playCorrectFast, playIncorrect]);

  const isNewHighScore = maxScore > highScore;

  // D-Pad controls for mobile (same queue as keyboard)
  const handleDirClick = useCallback((dir: Direction) => {
    if (showIntro) { setShowIntro(false); setPaused(false); return; }
    playClick();
    pushDirection(dir);
    const q = directionQueueRef.current;
    if (q.length > 0) {
      dirRef.current = q[0];
      setDirection(q[0]);
    }
  }, [showIntro, playClick, pushDirection]);

  if (gameOver) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[hsl(100_40%_85%)] to-[hsl(140_35%_75%)] flex flex-col items-center justify-center p-6 gap-6" dir="rtl">
        <FoxMascot
          message={isNewHighScore
            ? `שיא חדש! 🎉 הנחש הגיע לאורך ${maxScore}!`
            : `כל הכבוד! הנחש הגיע לאורך ${maxScore}! 🐍`
          }
          characterId={characterId} clothing={clothing}
        />
        {isNewHighScore && (
          <div className="text-2xl font-extrabold text-accent animate-bounce">🏆 שיא חדש! 🏆</div>
        )}
        <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">🐍</div>
            <div className="text-2xl font-extrabold">{maxScore}</div>
            <div className="text-[10px] text-muted-foreground">אורך מקסימלי</div>
          </div>
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-2xl font-extrabold">{correctCount}</div>
            <div className="text-[10px] text-muted-foreground">תשובות נכונות</div>
          </div>
          <div className="bg-card rounded-3xl p-4 shadow-card text-center">
            <div className="text-3xl mb-1">🌰</div>
            <div className="text-2xl font-extrabold">{stars}</div>
            <div className="text-[10px] text-muted-foreground">כוכבים</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setGameOver(false);
              setSnake([{ x: 16, y: 12 }, { x: 15, y: 12 }, { x: 14, y: 12 }]);
              setDirection('right');
              dirRef.current = 'right';
              directionQueueRef.current = [];
              setScore(3);
              setMaxScore(3);
              setStars(0);
              setCorrectCount(0);
              setPaused(false);
              setTickMs(BASE_TICK_MS);
              const q = generateQuestion(selectedNumbers, operation, rangeMin, rangeMax);
              setQuestion(q);
              spawnFoods(q, [{ x: 16, y: 12 }, { x: 15, y: 12 }, { x: 14, y: 12 }]);
            }}
            className="bg-primary text-primary-foreground font-bold text-xl px-8 py-4 rounded-full shadow-card hover:scale-105 transition-transform"
          >
            שחק שוב! 🎮
          </button>
          <button
            onClick={() => onGameEnd({ totalStars: stars, correctAnswers: correctCount, maxLength: maxScore })}
            className="bg-muted text-foreground font-bold text-xl px-8 py-4 rounded-full shadow-card hover:scale-105 transition-transform"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // Fixed cell size so grid doesn't shift on mobile (use vmin for stability)
  const cellSizeVmin = Math.min(90 / GRID_W, 90 / GRID_H);
  const boardStyle = {
    display: 'grid' as const,
    gridTemplateColumns: `repeat(${GRID_W}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_H}, 1fr)`,
    width: `${GRID_W * cellSizeVmin}vmin`,
    height: `${GRID_H * cellSizeVmin}vmin`,
    minWidth: 0,
    minHeight: 0,
    background: 'linear-gradient(135deg, hsl(100 45% 88%), hsl(120 40% 82%))',
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[hsl(100_40%_85%)] to-[hsl(140_35%_75%)] flex flex-col relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Intro overlay */}
      {showIntro && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => { setShowIntro(false); setPaused(false); }}
        >
          <div className="bg-card rounded-3xl p-8 mx-6 shadow-card border-4 border-success text-center animate-scale-in max-w-sm">
            <div className="text-5xl mb-4">🐍</div>
            <div className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              נחש החשבון!
            </div>
            <div className="text-base text-muted-foreground mb-2">
              כוון את הנחש אל התשובה הנכונה!
            </div>
            <div className="text-sm text-muted-foreground">
              לחץ או החלק כדי להתחיל...
            </div>
          </div>
        </div>
      )}

      {/* Header — no question here; it's on the snake head */}
      <div className="relative z-20 flex items-center justify-between p-2 md:p-4 pointer-events-none [&>*]:pointer-events-auto">
        <BackButton onClick={() => onGameEnd({ totalStars: stars, correctAnswers: correctCount, maxLength: maxScore })} />
        <div className="flex-1" />
        <StarHUD totalStars={totalStars} sessionStars={stars} />
      </div>

      {/* Left HUD */}
      <div className="absolute top-14 md:top-16 left-2 md:left-4 z-20 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1 bg-card/80 backdrop-blur-sm rounded-2xl px-2 py-1.5 shadow-card border border-border">
          <div className="flex items-center gap-1">
            <span className="text-sm">🐍</span>
            <span className="text-sm font-extrabold">{score}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">🌰</span>
            <span className="text-sm font-extrabold">{stars}</span>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold">שיא</span>
            <span className={`text-xs font-bold ${maxScore > highScore ? 'text-accent' : 'text-muted-foreground'}`}>
              {Math.max(highScore, maxScore)}
            </span>
          </div>
        </div>
      </div>

      {/* Wrong answer explanation overlay */}
      {wrongExplanation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-card/95 backdrop-blur-sm rounded-3xl p-4 shadow-card border-2 border-destructive animate-scale-in text-center">
          <div className="text-lg font-extrabold text-destructive mb-1">לא נכון!</div>
          <div className="text-xl font-extrabold" dir="ltr">
            {wrongExplanation.question} = {wrongExplanation.answer}
          </div>
        </div>
      )}

      {/* Game grid — fixed size so cells don't shift on mobile */}
      <div className="flex-1 flex items-center justify-center px-2 pb-2 min-h-0">
        <div
          className="relative border-4 border-[hsl(100_30%_60%)] rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
          style={boardStyle}
        >
          {/* Checkerboard grass pattern */}
          {Array.from({ length: GRID_W * GRID_H }, (_, i) => {
            const x = i % GRID_W;
            const y = Math.floor(i / GRID_W);
            const isLight = (x + y) % 2 === 0;
            return (
              <div
                key={i}
                className="min-w-0 min-h-0 overflow-hidden"
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  background: isLight ? 'hsl(100 45% 85%)' : 'hsl(110 40% 80%)',
                }}
              />
            );
          })}

          {/* Snake body — fixed ratio so it doesn't expand/shrink */}
          {snake.map((seg, i) => {
            const isHead = i === 0;
            return (
              <div
                key={`snake-${i}`}
                className="flex items-center justify-center min-w-0 min-h-0 overflow-visible"
                style={{
                  gridColumn: seg.x + 1,
                  gridRow: seg.y + 1,
                  position: 'relative',
                  zIndex: 10,
                }}
              >
                {isHead && (
                  <div
                    className="absolute left-0 right-0 bottom-full text-center whitespace-nowrap pointer-events-none"
                    style={{ zIndex: 15, marginBottom: '2%' }}
                  >
                    <span className="text-[2vmin] font-bold text-foreground/95 bg-card/95 rounded px-1.5 py-0.5 shadow-sm border border-[hsl(100_30%_60%)]" dir="ltr">
                      {question.text} = ?
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-full flex-shrink-0 ${isHead ? 'shadow-md' : ''}`}
                  style={{
                    width: '78%',
                    height: '78%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    aspectRatio: '1',
                    background: isHead
                      ? 'linear-gradient(135deg, hsl(145 70% 45%), hsl(155 60% 35%))'
                      : `hsl(145 ${60 - Math.min(i * 2, 20)}% ${50 + Math.min(i, 15)}%)`,
                    border: isHead ? '2px solid hsl(145 70% 30%)' : 'none',
                  }}
                />
              </div>
            );
          })}

          {/* Food items — number only, no icon; fixed size so cells don't grow */}
          {foods.map(food => (
            <div
              key={food.id}
              className="flex items-center justify-center min-w-0 min-h-0"
              style={{
                gridColumn: food.pos.x + 1,
                gridRow: food.pos.y + 1,
                position: 'relative',
                zIndex: 5,
              }}
            >
              <span className="text-sm font-extrabold bg-card/95 rounded px-1 py-0.5 shadow-sm leading-none select-none" style={{ fontSize: 'clamp(8px, 2.2vmin, 14px)' }}>
                {food.value}
              </span>
            </div>
          ))}

          {/* Feedback effects */}
          {feedback && (
            <div
              className="flex items-center justify-center pointer-events-none animate-scale-in"
              style={{
                gridColumn: feedback.pos.x + 1,
                gridRow: feedback.pos.y + 1,
                position: 'relative',
                zIndex: 20,
              }}
            >
              <span className="text-2xl">
                {feedback.type === 'correct' ? '✨' : '❌'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile D-Pad controls — large, touch-friendly */}
      <div className="flex justify-center pb-4 md:pb-6 z-20">
        <div className="relative w-40 h-40 md:w-44 md:h-44">
          {/* Up */}
          <button
            type="button"
            onClick={() => handleDirClick('up')}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 md:w-16 md:h-16 bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border-2 border-border flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform touch-manipulation"
            aria-label="למעלה"
          >
            ▲
          </button>
          {/* Down */}
          <button
            type="button"
            onClick={() => handleDirClick('down')}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 md:w-16 md:h-16 bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border-2 border-border flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform touch-manipulation"
            aria-label="למטה"
          >
            ▼
          </button>
          {/* Left (visually on right in RTL) */}
          <button
            type="button"
            onClick={() => handleDirClick('right')}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border-2 border-border flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform touch-manipulation"
            aria-label="ימינה"
          >
            ◄
          </button>
          {/* Right (visually on left in RTL) */}
          <button
            type="button"
            onClick={() => handleDirClick('left')}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border-2 border-border flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform touch-manipulation"
            aria-label="שמאלה"
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
}
