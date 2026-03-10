import { useState, useEffect, useRef, useMemo } from 'react';
import { getPetMood, HUNGER_THRESHOLD_HUNGRY, ShopItem } from '@/lib/petTypes';
import { PlayerClothing, CLOTHING_ITEMS } from '@/lib/clothingTypes';
import { CharacterId } from '@/lib/characterTypes';
import { FoxBody } from './characters/FoxBody';
import { CatBody } from './characters/CatBody';
import { DogBody } from './characters/DogBody';
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
  characterId?: CharacterId;
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
  characterId = 'fox',
}: FoxMascotProps) {
  const [isJumping, setIsJumping] = useState(false);
  const [eatingPhase, setEatingPhase] = useState<'grab' | 'bite' | 'chew' | 'done'>('done');
  const [idleAnimation, setIdleAnimation] = useState<'none' | 'blink' | 'wiggle' | 'breathe' | 'walk'>('breathe');
  const [walkCycle, setWalkCycle] = useState(0);
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Unique ID prefix for SVG gradients to avoid conflicts when multiple mascots render
  const uniqueId = useMemo(() => `pet_${Math.random().toString(36).substr(2, 6)}_`, []);

  const mood = getPetMood(hunger);
  const isHungry = hunger < HUNGER_THRESHOLD_HUNGRY;

  // Head tracking — mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.35;
      const dx = (e.clientX - centerX) / window.innerWidth;
      const dy = (e.clientY - centerY) / window.innerHeight;
      setHeadRotation(prev => ({
        x: prev.x + (dx * 12 - prev.x) * 0.15,
        y: prev.y + (dy * 8 - prev.y) * 0.15,
      }));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Head tracking — touch
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.35;
      const dx = (touch.clientX - centerX) / window.innerWidth;
      const dy = (touch.clientY - centerY) / window.innerHeight;
      setHeadRotation(prev => ({
        x: prev.x + (dx * 12 - prev.x) * 0.15,
        y: prev.y + (dy * 8 - prev.y) * 0.15,
      }));
    };
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => window.removeEventListener('touchmove', handleTouch);
  }, []);

  // Eating animation
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

  // Idle animations
  useEffect(() => {
    if (isEating || isJumping) return;
    const interval = setInterval(() => {
      const animations: ('blink' | 'wiggle' | 'breathe' | 'walk')[] = ['blink', 'wiggle', 'breathe', 'walk'];
      const random = animations[Math.floor(Math.random() * animations.length)];
      setIdleAnimation(random);
      setTimeout(() => setIdleAnimation('breathe'), random === 'walk' ? 2000 : 800);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isEating, isJumping]);

  useEffect(() => {
    if (idleAnimation !== 'walk') { setWalkCycle(0); return; }
    const interval = setInterval(() => setWalkCycle(prev => (prev + 1) % 4), 200);
    return () => clearInterval(interval);
  }, [idleAnimation]);

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
    if (idleAnimation === 'walk') return 'animate-walk';
    if (animate) return 'animate-breathe';
    return '';
  };

  // Get equipped clothing items
  const getEquippedItem = (type: keyof NonNullable<typeof clothing>['equippedItems']) => {
    if (!clothing?.equippedItems[type]) return null;
    return CLOTHING_ITEMS.find(item => item.id === clothing.equippedItems[type]);
  };
  const equippedHat = getEquippedItem('hat');
  const equippedSunglasses = getEquippedItem('sunglasses');
  const equippedDress = getEquippedItem('dress');
  // When wearing a dress, hide shirt and pants
  const equippedShirt = equippedDress ? null : getEquippedItem('shirt');
  const equippedPants = equippedDress ? null : getEquippedItem('pants');
  const equippedShoes = getEquippedItem('shoes');

  const isBlink = idleAnimation === 'blink';
  const walkBob = idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -2 : 2) : 0;
  const walkRot = idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -2 : 2) : 0;
  const tailSwing = idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -12 : 12) : (idleAnimation === 'wiggle' ? -15 : -5);

  const bodyProps = {
    headRotation, isBlink, walkBob, walkRot, tailSwing,
    walkCycle, idleAnimation,
    equippedHat, equippedSunglasses, equippedShirt,
    equippedPants, equippedShoes, equippedDress, eatingPhase, isJumping, uniqueId,
  };

  const renderBody = () => {
    switch (characterId) {
      case 'cat': return <CatBody {...bodyProps} />;
      case 'dog': return <DogBody {...bodyProps} />;
      case 'fox':
      default: return <FoxBody {...bodyProps} />;
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`} ref={containerRef}>
      {showSpeechBubble && message && (
        <div className="relative bg-card rounded-4xl p-6 shadow-card max-w-md animate-pop border-2 border-primary/20">
          <p className="text-xl font-bold text-foreground leading-relaxed">{message}</p>
          <div className="absolute -bottom-3 right-10 w-6 h-6 bg-card rotate-45 shadow-card border-r-2 border-b-2 border-primary/20"></div>
        </div>
      )}

      <div
        className={cn('relative', onClick && 'cursor-pointer hover:scale-110 transition-transform')}
        onClick={handleClick}
      >
        {/* Ground shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 rounded-full blur-md transform scale-x-125" />

        {/* Glow */}
        {mood === 'happy' && (
          <div className="absolute inset-0 blur-2xl bg-accent/30 rounded-full scale-150 animate-pulse" />
        )}

        {/* Hungry indicator */}
        {isHungry && !isEating && (
          <div className="absolute -top-4 -right-2 text-2xl animate-bounce z-30">💭</div>
        )}

        {/* Eating overlay */}
        {isEating && eatingFood && eatingPhase !== 'done' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className={cn(
              'absolute transition-all duration-500 ease-out text-6xl',
              eatingPhase === 'grab' && 'top-0 right-0 scale-100 animate-bounce',
              eatingPhase === 'bite' && 'top-1/4 left-1/2 -translate-x-1/2 scale-75',
              eatingPhase === 'chew' && 'top-1/3 left-1/2 -translate-x-1/2 scale-0 opacity-0'
            )}>
              {eatingFood.emoji}
            </div>
            {eatingPhase === 'chew' && (
              <>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                  <span className="absolute text-2xl animate-ping" style={{ animationDuration: '0.3s' }}>✨</span>
                  <span className="absolute text-xl animate-ping -left-4" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }}>⭐</span>
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-success text-white px-4 py-2 rounded-full font-bold text-lg animate-bounce shadow-lg">
                  יאמי! 😋
                </div>
              </>
            )}
          </div>
        )}

        {/* Main Character SVG */}
        <div
          className={cn(sizeClasses[size], 'relative z-10', getAnimationClass())}
          style={{ transform: isBlink ? 'scaleY(0.98)' : 'none', transition: 'transform 0.2s ease' }}
        >
          <svg
            viewBox="0 0 240 280"
            className={cn('w-full h-full', eatingPhase === 'bite' || eatingPhase === 'chew' ? 'animate-munch' : '')}
            style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))' }}
          >
            {renderBody()}
          </svg>
        </div>

        {/* Click hint */}
        {onClick && !isJumping && !isEating && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
            לחץ עלי! 👆
          </div>
        )}
      </div>
    </div>
  );
}
