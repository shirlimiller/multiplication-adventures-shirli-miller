import { Smile, Frown } from 'lucide-react';

interface HappinessBarProps {
  happiness: number; // 0-100
  className?: string;
}

export function HappinessBar({ happiness, className = '' }: HappinessBarProps) {
  const isSad = happiness < 40;
  const isVerySad = happiness < 20;
  
  const getBarColor = () => {
    if (isVerySad) return 'bg-destructive';
    if (isSad) return 'bg-amber-400';
    return 'bg-gradient-to-r from-amber-400 to-orange-500';
  };

  const getEmoji = () => {
    if (isVerySad) return '😢';
    if (isSad) return '😕';
    if (happiness >= 70) return '😄';
    return '🙂';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${isSad ? 'animate-pulse' : ''}`}>
        <span className="text-xl">{getEmoji()}</span>
      </div>
      
      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden min-w-[80px]">
        <div 
          className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${happiness}%` }}
        />
      </div>
      
      {isSad && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {isVerySad ? 'עצוב מאוד!' : 'צריך טיול!'}
        </span>
      )}
    </div>
  );
}
