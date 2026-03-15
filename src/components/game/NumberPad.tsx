import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Delete, Check } from 'lucide-react';

interface NumberPadProps {
  onSubmit: (answer: number) => void;
  onContinue?: () => void;
  disabled?: boolean;
  correctAnswer?: number;
  showResult?: boolean;
  isCorrect?: boolean | null;
  gameMode?: 'training' | 'test';
}

export function NumberPad({ onSubmit, onContinue, disabled = false, correctAnswer, showResult, isCorrect, gameMode }: NumberPadProps) {
  const [input, setInput] = useState('');
  
  // Reset input when question changes
  useEffect(() => {
    if (!showResult) {
      setInput('');
    }
  }, [correctAnswer, showResult]);

  const handleDigit = useCallback((digit: number) => {
    if (disabled || input.length >= 3) return;
    setInput(prev => prev + digit.toString());
  }, [disabled, input]);

  const handleDelete = useCallback(() => {
    if (disabled) return;
    setInput(prev => prev.slice(0, -1));
  }, [disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled || !input) return;
    onSubmit(parseInt(input, 10));
  }, [disabled, input, onSubmit]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If showing result and correct, Enter continues to next question
      if (showResult && isCorrect && e.key === 'Enter') {
        e.preventDefault();
        onContinue?.();
        return;
      }
      
      if (disabled) return;
      
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter' && input) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleDigit, handleDelete, handleSubmit, input, showResult, isCorrect, onContinue]);

  const getInputStyle = () => {
    if (!showResult) return 'border-primary/30 bg-white';
    if (isCorrect) return 'border-green-500 bg-green-50 text-green-700';
    return 'border-red-500 bg-red-50 text-red-700';
  };

  const isTestMode = gameMode === 'test';
  const actionButtons = (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={disabled || !input}
        className="h-12 w-12 rounded-xl p-0 hover:scale-105 transition-transform shadow-soft text-red-500 hover:text-red-600 hover:bg-red-50"
        aria-label="מחיקה"
      >
        <Delete className="w-5 h-5" />
      </Button>
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={disabled || !input}
        className={`h-12 w-12 rounded-xl p-0 hover:scale-105 transition-transform shadow-soft ${
          isTestMode && showResult && isCorrect
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gradient-gold text-white'
        }`}
        aria-label="בדיקה"
      >
        <Check className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {/* Answer line + Delete & Check to the right (same row in test mode) */}
      <div className={`w-full flex items-stretch gap-2 ${isTestMode ? 'flex-row' : 'flex-col'}`} dir="ltr">
        <div 
          className={`flex-1 min-w-0 h-20 rounded-2xl border-4 flex items-center justify-center text-5xl font-bold transition-all ${getInputStyle()}`}
        >
          {input || <span className="text-muted-foreground/40">?</span>}
        </div>
        {isTestMode && actionButtons}
      </div>
      
      {/* Number grid: 1-9 and 0 only (Delete & Check moved up in test mode) */}
      <div className="grid grid-cols-3 gap-3 w-full" dir="ltr">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="secondary"
            size="lg"
            onClick={() => handleDigit(num)}
            disabled={disabled}
            className="text-3xl font-bold h-16 rounded-2xl hover:scale-105 transition-transform shadow-soft active:scale-95"
          >
            {num}
          </Button>
        ))}
        
        {!isTestMode && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDelete}
              disabled={disabled || !input}
              className="h-16 rounded-2xl hover:scale-105 transition-transform shadow-soft text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Delete className="w-8 h-8" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleDigit(0)}
              disabled={disabled}
              className="text-3xl font-bold h-16 rounded-2xl hover:scale-105 transition-transform shadow-soft active:scale-95"
            >
              0
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={disabled || !input}
              className="h-16 rounded-2xl hover:scale-105 transition-transform shadow-soft bg-gradient-gold text-white"
            >
              <Check className="w-8 h-8" />
            </Button>
          </>
        )}
        
        {isTestMode && (
          <>
            <div className="h-16 rounded-2xl" />
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleDigit(0)}
              disabled={disabled}
              className="text-3xl font-bold h-16 rounded-2xl hover:scale-105 transition-transform shadow-soft active:scale-95"
            >
              0
            </Button>
            <div className="h-16 rounded-2xl" />
          </>
        )}
      </div>
    </div>
  );
}
