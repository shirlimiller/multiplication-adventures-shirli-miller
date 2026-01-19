import { useState, useEffect } from 'react';
import foxMascot from '@/assets/fox-mascot.png';
import { getPetMood, HUNGER_THRESHOLD_HUNGRY, ShopItem } from '@/lib/petTypes';
import { PlayerClothing, CLOTHING_ITEMS } from '@/lib/clothingTypes';
import { cn } from '@/lib/utils';

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
  clothing?: PlayerClothing;
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
  clothing,
}: FoxMascotProps) {
  const [isJumping, setIsJumping] = useState(false);
  const [eatingPhase, setEatingPhase] = useState<'grab' | 'bite' | 'chew' | 'done'>('done');
  const [idleAnimation, setIdleAnimation] = useState<'none' | 'blink' | 'wiggle' | 'breathe'>('breathe');
  
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

  // Random idle animations
  useEffect(() => {
    if (isEating || isJumping) return;
    
    const interval = setInterval(() => {
      const animations: ('blink' | 'wiggle' | 'breathe')[] = ['blink', 'wiggle', 'breathe'];
      const random = animations[Math.floor(Math.random() * animations.length)];
      setIdleAnimation(random);
      
      // Reset after animation
      setTimeout(() => setIdleAnimation('breathe'), 800);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isEating, isJumping]);

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
    if (idleAnimation === 'wiggle') return 'animate-wiggle';
    if (animate) return 'animate-breathe';
    return '';
  };

  // Get equipped clothing items
  const getEquippedItem = (type: keyof NonNullable<typeof clothing>['equippedItems']) => {
    if (!clothing?.equippedItems[type]) return null;
    return CLOTHING_ITEMS.find(item => item.id === clothing.equippedItems[type]);
  };

  const equippedHat = getEquippedItem('hat');
  const equippedGlasses = getEquippedItem('glasses');
  const equippedScarf = getEquippedItem('scarf');
  const equippedBow = getEquippedItem('bow');

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showSpeechBubble && message && (
        <div className="relative bg-card rounded-4xl p-6 shadow-card max-w-md animate-pop border-2 border-primary/20">
          <p className="text-xl font-bold text-foreground leading-relaxed">{message}</p>
          <div className="absolute -bottom-3 right-10 w-6 h-6 bg-card rotate-45 shadow-card border-r-2 border-b-2 border-primary/20"></div>
        </div>
      )}
      
      <div 
        className={cn(
          'relative',
          onClick && 'cursor-pointer hover:scale-110 transition-transform'
        )}
        onClick={handleClick}
      >
        {/* 3D Shadow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 rounded-full blur-md transform scale-x-125" />
        
        {/* Glow effect based on mood */}
        {mood === 'happy' && (
          <div className="absolute inset-0 blur-2xl bg-accent/30 rounded-full scale-150 animate-pulse" />
        )}
        
        {/* Hungry indicator */}
        {isHungry && !isEating && (
          <div className="absolute -top-4 -right-2 text-2xl animate-bounce z-30">
            💭
          </div>
        )}

        {/* 3D Container with perspective */}
        <div 
          className="relative"
          style={{ 
            perspective: '500px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Equipped Clothing - Hat - positioned above fox's head */}
          {equippedHat && (
            <div 
              className={cn(
                'absolute z-30 transition-transform',
                getAnimationClass(),
                size === 'hero' ? '-top-8 text-5xl' : size === 'large' ? '-top-6 text-4xl' : '-top-4 text-3xl'
              )}
              style={{ 
                left: '50%',
                transform: 'translateX(-50%) translateZ(20px)',
              }}
            >
              {equippedHat.emoji}
            </div>
          )}

          {/* Equipped Clothing - Glasses - positioned on fox's face */}
          {equippedGlasses && (
            <div 
              className={cn(
                'absolute z-30 transition-transform',
                getAnimationClass(),
                size === 'hero' ? 'top-[30%] text-4xl' : size === 'large' ? 'top-[28%] text-3xl' : 'top-[25%] text-2xl'
              )}
              style={{ 
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {equippedGlasses.emoji}
            </div>
          )}

          {/* Eating Animation Overlay */}
          {isEating && eatingFood && eatingPhase !== 'done' && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              {/* Food item animation */}
              <div 
                className={cn(
                  'absolute transition-all duration-500 ease-out text-6xl',
                  eatingPhase === 'grab' && 'top-0 right-0 scale-100 animate-bounce',
                  eatingPhase === 'bite' && 'top-1/4 left-1/2 -translate-x-1/2 scale-75',
                  eatingPhase === 'chew' && 'top-1/3 left-1/2 -translate-x-1/2 scale-0 opacity-0'
                )}
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
          
          {/* Main Fox Image with 3D effect */}
          <div 
            className={cn(
              sizeClasses[size],
              'relative z-10',
              getAnimationClass()
            )}
            style={{
              transform: idleAnimation === 'blink' ? 'scaleY(0.98)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* 3D depth layers */}
            <div 
              className="absolute inset-0 bg-orange-300/30 rounded-full blur-sm -z-10"
              style={{ transform: 'translateZ(-10px) scale(1.1)' }}
            />
            
            <img
              src={foxMascot}
              alt="שועלי הקסם"
              className={cn(
                'w-full h-full object-contain drop-shadow-lg',
                eatingPhase === 'bite' || eatingPhase === 'chew' ? 'animate-munch' : ''
              )}
              style={{
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2)) drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
              }}
            />
          </div>

          {/* Equipped Clothing - Scarf - positioned on fox's neck */}
          {equippedScarf && (
            <div 
              className={cn(
                'absolute z-20 transition-transform',
                getAnimationClass(),
                size === 'hero' ? 'bottom-[20%] text-5xl' : size === 'large' ? 'bottom-[22%] text-4xl' : 'bottom-[25%] text-3xl'
              )}
              style={{ 
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {equippedScarf.emoji}
            </div>
          )}

          {/* Equipped Clothing - Bow - positioned on fox's side/chest */}
          {equippedBow && (
            <div 
              className={cn(
                'absolute z-20 transition-transform',
                getAnimationClass(),
                size === 'hero' ? 'bottom-[35%] -right-2 text-4xl' : size === 'large' ? 'bottom-[33%] -right-1 text-3xl' : 'bottom-[30%] right-0 text-2xl'
              )}
            >
              {equippedBow.emoji}
            </div>
          )}
        </div>
        
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
