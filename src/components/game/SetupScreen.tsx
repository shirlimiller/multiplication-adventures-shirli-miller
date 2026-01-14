import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { WORLD_COLORS, WORLD_NAMES } from '@/lib/gameUtils';
import { Check } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (tables: number[], questionCount: number) => void;
  conqueredTables: number[];
}

export function SetupScreen({ onStartGame, conqueredTables }: SetupScreenProps) {
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3]);
  const [questionCount, setQuestionCount] = useState(10);

  const toggleTable = (table: number) => {
    setSelectedTables(prev =>
      prev.includes(table)
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const handleStart = () => {
    if (selectedTables.length > 0) {
      onStartGame(selectedTables, questionCount);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        <FoxMascot 
          message="איזה לוחות כפל תרצה לתרגל היום? 🎯"
          className="mb-8"
        />

        <div className="bg-card rounded-3xl p-8 shadow-card space-y-6">
          <h2 className="text-2xl font-bold text-foreground text-center">בחר עולמות לכיבוש</h2>
          
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((table) => {
              const isSelected = selectedTables.includes(table);
              const isConquered = conqueredTables.includes(table);
              
              return (
                <button
                  key={table}
                  onClick={() => toggleTable(table)}
                  className={`
                    relative flex flex-col items-center justify-center p-4 rounded-2xl border-4 transition-all duration-200
                    ${isSelected ? 'border-primary scale-105 shadow-glow' : 'border-transparent'}
                    ${WORLD_COLORS[table]} text-white font-bold
                    hover:scale-105 active:scale-95
                  `}
                >
                  <span className="text-3xl font-extrabold">{table}</span>
                  <span className="text-xs opacity-90 mt-1 line-clamp-1">{WORLD_NAMES[table]}</span>
                  
                  {isConquered && (
                    <div className="absolute -top-2 -left-2 bg-success rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1 animate-pop">
                      <span className="text-sm">⭐</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-card space-y-6">
          <h2 className="text-2xl font-bold text-foreground text-center">כמה שאלות?</h2>
          
          <div className="flex justify-center gap-4">
            {[5, 10, 15, 20].map((count) => (
              <Button
                key={count}
                variant={questionCount === count ? 'game' : 'outline'}
                size="lg"
                onClick={() => setQuestionCount(count)}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="game"
            size="game"
            onClick={handleStart}
            disabled={selectedTables.length === 0}
          >
            יוצאים להרפתקה! 🎮
          </Button>
        </div>
      </div>
    </div>
  );
}
