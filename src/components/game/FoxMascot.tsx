import { useState, useEffect } from 'react';
import foxMascot from '@/assets/fox-mascot.png';
import { getPetMood, HUNGER_THRESHOLD_HUNGRY, ShopItem } from '@/lib/petTypes';

interface FoxMascotProps {
  message?: string;
  className?: string;
  showSpeechBubble?: boolean;
  animate?: boolean;
  hunger?: number;
  size?: 'small' | 'medium' | 'large' | 'hero';
  onClick?: () => void;
  isEating?: boolean;
  eatingFood?: ShopItem | null;
}

export function FoxMascot({ 
  message, 
  className = '', 
  showSpeechBubble = true, 
  animate = true,
  hunger = 100,
  size = 'medium',
  onClick,
  isEating = false,
  eatingFood = null,
}: FoxMascotProps) {
  const [isJumping, setIsJumping] = useState(false);
  const [eatingPhase, setEatingPhase] = useState<'grab' | 'bite' | 'chew' | 'done'>('done');
  
  const mood = getPetMood(hunger);
  const isHungry = hunger < HUNGER_THRESHOLD_HUNGRY;

  // Eating animation phases
  useEffect(() => {
    if (isEating && eatingFood) {
      setEatingPhase('grab');
      setTimeout(() => setEatingPhase('bite'), 600);
      setTimeout(() => setEatingPhase('chew'), 1200);
      setTimeout(() => setEatingPhase('done'), 2200);
    } else {
      setEatingPhase('done');
    }
  }, [isEating, eatingFood]);

  const handleClick = () => {
    if (onClick) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
      onClick();
    }
  };

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    hero: 'w-64 h-64',
  };

  const getAnimationClass = () => {
    if (isEating) return 'animate-eat';
    if (isJumping) return 'animate-jump';
    if (isHungry) return 'animate-hungry';
    if (animate) return 'animate-bounce-soft';
    return '';
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showSpeechBubble && message && (
        <div className="relative bg-card rounded-4xl p-6 shadow-card max-w-md animate-pop border-2 border-primary/20">
          <p className="text-xl font-bold text-foreground leading-relaxed">{message}</p>
          <div className="absolute -bottom-3 right-10 w-6 h-6 bg-card rotate-45 shadow-card border-r-2 border-b-2 border-primary/20"></div>
        </div>
      )}
      
      <div 
        className={`relative ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={handleClick}
      >
        {/* Glow effect based on mood */}
        {mood === 'happy' && (
          <div className="absolute inset-0 blur-2xl bg-accent/30 rounded-full scale-150 animate-pulse" />
        )}
        
        {/* Hungry indicator */}
        {isHungry && !isEating && (
          <div className="absolute -top-4 -right-2 text-2xl animate-bounce">
            💭
          </div>
        )}

        {/* Eating Animation Overlay */}
        {isEating && eatingFood && eatingPhase !== 'done' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {/* Food item animation */}
            <div 
              className={`absolute transition-all duration-500 ease-out text-6xl ${
                eatingPhase === 'grab' 
                  ? 'top-0 right-0 scale-100 animate-bounce' 
                  : eatingPhase === 'bite' 
                    ? 'top-1/4 left-1/2 -translate-x-1/2 scale-75'
                    : 'top-1/3 left-1/2 -translate-x-1/2 scale-0 opacity-0'
              }`}
            >
              {eatingFood.emoji}
            </div>
            
            {/* Bite particles */}
            {eatingPhase === 'chew' && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                <span className="absolute text-2xl animate-ping" style={{ animationDuration: '0.3s' }}>✨</span>
                <span className="absolute text-xl animate-ping -left-4" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }}>⭐</span>
                <span className="absolute text-xl animate-ping left-4" style={{ animationDuration: '0.35s', animationDelay: '0.2s' }}>💫</span>
              </div>
            )}
            
            {/* "Yum" text bubble */}
            {eatingPhase === 'chew' && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-success text-white px-4 py-2 rounded-full font-bold text-lg animate-bounce shadow-lg">
                יאמי! 😋
              </div>
            )}
          </div>
        )}
        
        <img
          src={foxMascot}
          alt="שועלי הקסם"
          className={`${sizeClasses[size]} object-contain relative z-10 ${getAnimationClass()} drop-shadow-lg ${
            eatingPhase === 'bite' || eatingPhase === 'chew' ? 'animate-munch' : ''
          }`}
        />
        
        {/* Click hint when interactive */}
        {onClick && !isJumping && !isEating && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
            לחץ עלי! 👆
          </div>
        )}
      </div>
    </div>
  );
}
