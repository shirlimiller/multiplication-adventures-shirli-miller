import { useState } from 'react';
import foxMascot from '@/assets/fox-mascot.png';
import { getPetMood, HUNGER_THRESHOLD_HUNGRY } from '@/lib/petTypes';

interface FoxMascotProps {
  message?: string;
  className?: string;
  showSpeechBubble?: boolean;
  animate?: boolean;
  hunger?: number;
  size?: 'small' | 'medium' | 'large' | 'hero';
  onClick?: () => void;
  isEating?: boolean;
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
}: FoxMascotProps) {
  const [isJumping, setIsJumping] = useState(false);
  
  const mood = getPetMood(hunger);
  const isHungry = hunger < HUNGER_THRESHOLD_HUNGRY;

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
        {isHungry && (
          <div className="absolute -top-4 -right-2 text-2xl animate-bounce">
            💭
          </div>
        )}
        
        <img
          src={foxMascot}
          alt="שועלי הקסם"
          className={`${sizeClasses[size]} object-contain relative z-10 ${getAnimationClass()} drop-shadow-lg`}
        />
        
        {/* Click hint when interactive */}
        {onClick && !isJumping && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
            לחץ עלי! 👆
          </div>
        )}
      </div>
    </div>
  );
}
