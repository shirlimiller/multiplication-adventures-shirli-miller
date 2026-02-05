import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { checkDivisionTableMastery, checkTableMastery, Operation } from '@/lib/gameUtils';
import { PlayerStats } from '@/lib/playerTypes';
import { Award, Gamepad2, GraduationCap, Plus, Minus, X, Divide } from 'lucide-react';

export type GameMode = 'training' | 'test';

export interface GameSetupConfig {
  operation: Operation;
  selectedNumbers: number[];
  rangeMin: number;
  rangeMax: number;
  questionCount: number;
  mode: GameMode;
}

interface SetupScreenProps {
  onStartGame: (config: GameSetupConfig) => void;
  playerStats: PlayerStats;
}

export function SetupScreen({ onStartGame, playerStats }: SetupScreenProps) {
  const [operation, setOperation] = useState<Operation>('multiply');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [rangeMin, setRangeMin] = useState(1);
  const [rangeMax, setRangeMax] = useState(10);
  const [questionCount, setQuestionCount] = useState(10);
  const [gameMode, setGameMode] = useState<GameMode>('training');

  const toggleNumber = (n: number) => {
    setSelectedNumbers(prev => (prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]));
  };

  const handleStart = () => {
    if (selectedNumbers.length === 0) return;
    const min = Math.min(rangeMin, rangeMax);
    const max = Math.max(rangeMin, rangeMax);
    onStartGame({
      operation,
      selectedNumbers: selectedNumbers.slice().sort((a, b) => a - b),
      rangeMin: min,
      rangeMax: max,
      questionCount: Math.max(1, Math.min(200, Math.floor(questionCount || 10))),
      mode: gameMode,
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        <FoxMascot 
          message="מה תרצה לתרגל היום? 🎯"
          className="mb-8"
        />

        {/* Operation selection */}
        <div className="bg-card rounded-ac-xl p-8 shadow-card space-y-6 border-[3px] border-[hsl(var(--border))]">
          <h2 className="text-2xl font-bold text-foreground text-center">בחר פעולה</h2>
          <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
            {([
              { op: 'add' as const, label: 'חיבור', Icon: Plus },
              { op: 'subtract' as const, label: 'חיסור', Icon: Minus },
              { op: 'multiply' as const, label: 'כפל', Icon: X },
              { op: 'divide' as const, label: 'חילוק', Icon: Divide },
            ]).map(({ op, label, Icon }) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-4 rounded-full border-[3px] transition-all duration-200
                  ${operation === op ? 'border-[hsl(145_40%_55%)] bg-wood scale-105 shadow-wood' : 'border-[hsl(35_30%_70%)] bg-wood hover:border-primary/50 shadow-wood'}
                `}
              >
                <Icon className={`w-10 h-10 ${operation === op ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-bold">{label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            תעודות לכפל/חילוק יוצגו ליד כל מספר (× / ÷).
          </p>
        </div>

        {/* Choose numbers */}
        <div className="bg-card rounded-ac-xl p-8 shadow-card space-y-6 border-[3px] border-[hsl(var(--border))]">
          <h2 className="text-2xl font-bold text-foreground text-center">בחר מספרים לתרגול</h2>
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
              const isSelected = selectedNumbers.includes(n);
              const multiplyCert = checkTableMastery(playerStats, n).isMastered;
              const divideCert = checkDivisionTableMastery(playerStats, n).isMastered;
              const certClass = (earned: boolean) =>
                earned ? 'opacity-100' : 'opacity-30 grayscale blur-[1px]';
              return (
                <button
                  key={n}
                  onClick={() => toggleNumber(n)}
                  className={`
                    relative flex items-center justify-center p-4 rounded-full border-[3px] transition-all duration-200 font-extrabold text-xl
                    ${isSelected ? 'border-[hsl(145_40%_55%)] bg-wood scale-105 shadow-wood' : 'border-[hsl(35_30%_70%)] bg-wood hover:border-primary/50 shadow-wood'}
                  `}
                >
                  {n}

                  {/* Certificates (only for × and ÷) */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <div
                      className={`flex items-center gap-0.5 bg-background/80 rounded-full px-1.5 py-0.5 shadow ${certClass(multiplyCert)}`}
                      title="תעודת כפל"
                    >
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-bold">×</span>
                    </div>
                    <div
                      className={`flex items-center gap-0.5 bg-background/80 rounded-full px-1.5 py-0.5 shadow ${certClass(divideCert)}`}
                      title="תעודת חילוק"
                    >
                      <Award className="w-3 h-3 text-sky-500" />
                      <span className="text-[10px] font-bold">÷</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            המספרים שבחרת יהיו “מספרי מיקוד” (למשל: בכפל/חילוק – הלוח/המחלק).
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="bg-card rounded-ac-xl p-8 shadow-card space-y-6 border-[3px] border-[hsl(var(--border))]">
          <h2 className="text-2xl font-bold text-foreground text-center">סוג משחק</h2>
          
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => setGameMode('training')}
              className={`
                flex flex-col items-center gap-3 p-6 rounded-full border-[3px] transition-all duration-200
                ${gameMode === 'training' 
                  ? 'border-[hsl(145_40%_55%)] bg-wood scale-105 shadow-wood' 
                  : 'border-[hsl(35_30%_70%)] bg-wood hover:border-primary/50 shadow-wood'}
              `}
            >
              <Gamepad2 className={`w-12 h-12 ${gameMode === 'training' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-xl font-bold">אימון</span>
              <span className="text-sm text-muted-foreground text-center">בחירה מתוך 4 תשובות</span>
            </button>
            
            <button
              onClick={() => setGameMode('test')}
              className={`
                flex flex-col items-center gap-3 p-6 rounded-full border-[3px] transition-all duration-200
                ${gameMode === 'test' 
                  ? 'border-[hsl(45_60%_65%)] bg-wood scale-105 shadow-wood' 
                  : 'border-[hsl(35_30%_70%)] bg-wood hover:border-accent/50 shadow-wood'}
              `}
            >
              <GraduationCap className={`w-12 h-12 ${gameMode === 'test' ? 'text-accent' : 'text-muted-foreground'}`} />
              <span className="text-xl font-bold">מבחן</span>
              <span className="text-sm text-muted-foreground text-center">כתוב את התשובה בעצמך</span>
            </button>
          </div>
          
          {gameMode === 'test' && (
            <p className="text-center text-sm text-muted-foreground animate-fade-in">
              ⏱️ הצלחה = תשובה נכונה בפחות מ-6 שניות
            </p>
          )}
        </div>

        {/* Question count */}
        <div className="bg-card rounded-ac-xl p-8 shadow-card space-y-6 border-[3px] border-[hsl(var(--border))]">
          <h2 className="text-2xl font-bold text-foreground text-center">מספר שאלות</h2>

          <div className="flex justify-center">
            <div className="bg-muted/30 rounded-ac-lg p-4 border-2 border-[hsl(var(--border))] max-w-xs w-full">
              <div className="font-bold mb-2 text-center">כמה שאלות תרצה?</div>
              <input
                type="number"
                className="w-full rounded-full border-2 border-[hsl(var(--border))] bg-wood px-4 py-2 shadow-wood text-center text-xl font-bold"
                value={questionCount}
                min={1}
                max={200}
                onChange={(e) => setQuestionCount(parseInt(e.target.value || '10', 10))}
              />
              <div className="text-xs text-muted-foreground mt-1 text-center">ברירת מחדל: 10</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="game"
            size="game"
            onClick={handleStart}
            disabled={selectedNumbers.length === 0}
          >
            יוצאים להרפתקה! 🎮
          </Button>
        </div>
      </div>
    </div>
  );
}
