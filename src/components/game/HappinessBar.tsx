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

  // Bottle/drink icon that fills based on happiness
  const getBottleIcon = () => {
    if (isVerySad) return '😢';
    if (isSad) return '😕';
    if (happiness >= 70) return '😄';
    return '🙂';
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${isSad ? 'animate-pulse' : ''}`}>
        <span className="text-2xl md:text-3xl">{getBottleIcon()}</span>
      </div>
      
      <div className="flex-1">
        <div className="text-[10px] md:text-xs font-bold text-muted-foreground mb-0.5">שמחה</div>
        <div className="h-5 md:h-6 bg-muted rounded-full overflow-hidden min-w-[100px] border-2 border-border">
          <div 
            className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${happiness}%` }}
          />
        </div>
      </div>
      
      {isSad && (
        <span className="text-xs font-bold text-destructive whitespace-nowrap">
          {isVerySad ? 'עצוב מאוד!' : 'צריך טיול!'}
        </span>
      )}
    </div>
  );
}