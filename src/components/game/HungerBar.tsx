import { Apple, AlertTriangle } from 'lucide-react';

interface HungerBarProps {
  hunger: number; // 0-100
  className?: string;
}

export function HungerBar({ hunger, className = '' }: HungerBarProps) {
  const isHungry = hunger < 40;
  const isVeryHungry = hunger < 20;
  
  const getBarColor = () => {
    if (isVeryHungry) return 'bg-destructive';
    if (isHungry) return 'bg-accent';
    return 'bg-success';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${isHungry ? 'animate-hungry' : ''}`}>
        {isVeryHungry ? (
          <AlertTriangle className="w-6 h-6 text-destructive" />
        ) : (
          <Apple className={`w-6 h-6 ${isHungry ? 'text-accent' : 'text-success'}`} />
        )}
      </div>
      
      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden min-w-[80px]">
        <div 
          className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${hunger}%` }}
        />
      </div>
      
      {isHungry && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {isVeryHungry ? 'רעב מאוד!' : 'רעב'}
        </span>
      )}
    </div>
  );
}
