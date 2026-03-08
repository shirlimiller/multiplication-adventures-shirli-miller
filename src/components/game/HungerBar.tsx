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

  // Plate icon that fills based on hunger level
  const getPlateIcon = () => {
    if (isVeryHungry) return '🍽️'; // empty plate
    if (isHungry) return '🥣';     // half-empty bowl
    if (hunger >= 70) return '🍲';  // full bowl
    return '🥗';                    // medium
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${isHungry ? 'animate-hungry' : ''}`}>
        <span className="text-2xl md:text-3xl">{getPlateIcon()}</span>
      </div>
      
      <div className="flex-1">
        <div className="text-[10px] md:text-xs font-bold text-muted-foreground mb-0.5">רעב</div>
        <div className="h-5 md:h-6 bg-muted rounded-full overflow-hidden min-w-[100px] border-2 border-border">
          <div 
            className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${hunger}%` }}
          />
        </div>
      </div>
      
      {isHungry && (
        <span className="text-xs font-bold text-destructive whitespace-nowrap">
          {isVeryHungry ? 'רעב מאוד!' : 'רעב'}
        </span>
      )}
    </div>
  );
}