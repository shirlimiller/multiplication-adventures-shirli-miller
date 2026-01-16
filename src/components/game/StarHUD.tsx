import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface StarHUDProps {
  totalStars: number;
  sessionStars: number;
  onStarCounterRef?: (ref: HTMLDivElement | null) => void;
}

export function StarHUD({ totalStars, sessionStars, onStarCounterRef }: StarHUDProps) {
  const [displayStars, setDisplayStars] = useState(totalStars);
  const [isAnimating, setIsAnimating] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onStarCounterRef) {
      onStarCounterRef(counterRef.current);
    }
  }, [onStarCounterRef]);

  useEffect(() => {
    if (totalStars !== displayStars) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayStars(totalStars);
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [totalStars, displayStars]);

  return (
    <div 
      ref={counterRef}
      className={`
        flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 
        border border-accent/30 rounded-2xl px-4 py-2 shadow-lg backdrop-blur-sm
        ${isAnimating ? 'scale-110 ring-2 ring-accent/50' : 'scale-100'}
        transition-all duration-300
      `}
    >
      <div className="relative">
        <Star className="w-7 h-7 text-accent fill-accent drop-shadow-lg" />
        <div className="absolute inset-0 animate-ping">
          <Star className={`w-7 h-7 text-accent/30 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
      
      <div className="flex flex-col items-start">
        <span className="text-xl font-bold text-foreground">
          {displayStars + sessionStars}
        </span>
        {sessionStars > 0 && (
          <span className="text-xs text-accent font-medium">
            +{sessionStars} במשחק זה
          </span>
        )}
      </div>
    </div>
  );
}
