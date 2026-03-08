import { useState, useEffect, useRef } from 'react';
import { getPetMood, HUNGER_THRESHOLD_HUNGRY, ShopItem } from '@/lib/petTypes';
import { PlayerClothing, CLOTHING_ITEMS } from '@/lib/clothingTypes';
import { WearableHat, WearableSunglasses, WearableShirt, WearablePantsLeg, WearableShoe } from './WearableItems';
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
  const [idleAnimation, setIdleAnimation] = useState<'none' | 'blink' | 'wiggle' | 'breathe' | 'walk'>('breathe');
  const [walkCycle, setWalkCycle] = useState(0);
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mood = getPetMood(hunger);
  const isHungry = hunger < HUNGER_THRESHOLD_HUNGRY;

  // Head tracking
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
  const equippedShirt = getEquippedItem('shirt');
  const equippedPants = getEquippedItem('pants');
  const equippedShoes = getEquippedItem('shoes');

  const isBlink = idleAnimation === 'blink';
  const walkBob = idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -2 : 2) : 0;
  const walkRot = idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -2 : 2) : 0;
  const tailSwing = idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -12 : 12) : (idleAnimation === 'wiggle' ? -15 : -5);

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

        {/* Main Fox SVG */}
        <div
          className={cn(sizeClasses[size], 'relative z-10', getAnimationClass())}
          style={{ transform: isBlink ? 'scaleY(0.98)' : 'none', transition: 'transform 0.2s ease' }}
        >
          <svg
            viewBox="0 0 240 280"
            className={cn('w-full h-full', eatingPhase === 'bite' || eatingPhase === 'chew' ? 'animate-munch' : '')}
            style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))' }}
          >
            <defs>
              <radialGradient id="foxBodyGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFB060" />
                <stop offset="60%" stopColor="#FF8C42" />
                <stop offset="100%" stopColor="#E5722E" />
              </radialGradient>
              <radialGradient id="foxBellyGrad" cx="50%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FFE4C8" />
                <stop offset="70%" stopColor="#FFD4A8" />
                <stop offset="100%" stopColor="#FFC088" />
              </radialGradient>
              <radialGradient id="foxHeadGrad" cx="45%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#FFB868" />
                <stop offset="50%" stopColor="#FF9A4A" />
                <stop offset="100%" stopColor="#E57828" />
              </radialGradient>
              <radialGradient id="earInnerGrad" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFB8D8" />
                <stop offset="100%" stopColor="#FF8CB8" />
              </radialGradient>
              <radialGradient id="eyeWhiteGrad" cx="45%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F0F0F0" />
              </radialGradient>
              <radialGradient id="pupilGrad" cx="40%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#444" />
                <stop offset="100%" stopColor="#111" />
              </radialGradient>
              <radialGradient id="noseGrad" cx="45%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#FF80B0" />
                <stop offset="100%" stopColor="#E04888" />
              </radialGradient>
              <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB060" />
                <stop offset="50%" stopColor="#FF8C42" />
                <stop offset="100%" stopColor="#E5722E" />
              </linearGradient>
              <radialGradient id="tailTipGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF8F0" />
                <stop offset="100%" stopColor="#FFD8B0" />
              </radialGradient>
              <radialGradient id="pawGrad" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#FFD0A0" />
                <stop offset="100%" stopColor="#FFB060" />
              </radialGradient>
              <linearGradient id="specHighlight" x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* ===== TAIL ===== */}
            <g id="tail" style={{ transform: `rotate(${tailSwing}deg)`, transformOrigin: '155px 195px', transition: 'transform 0.3s' }}>
              <ellipse cx="192" cy="185" rx="32" ry="48" fill="url(#tailGrad)" />
              <ellipse cx="192" cy="185" rx="32" ry="48" fill="url(#specHighlight)" />
              <ellipse cx="198" cy="175" rx="18" ry="28" fill="url(#tailTipGrad)" />
            </g>

            {/* ===== TORSO ===== */}
            <g id="torso" style={{ transform: `translateY(${walkBob}px)`, transition: 'transform 0.3s' }}>
              <ellipse cx="120" cy="195" rx="58" ry="55" fill="url(#foxBodyGrad)" />
              <ellipse cx="105" cy="178" rx="30" ry="28" fill="url(#specHighlight)" />
              <ellipse cx="120" cy="205" rx="38" ry="35" fill="url(#foxBellyGrad)" />
              <ellipse cx="112" cy="195" rx="20" ry="18" fill="white" opacity="0.12" />

              {/* Shirt wearable — snapped to torso center */}
              {equippedShirt && (
                <g transform="translate(120, 195)">
                  <WearableShirt item={equippedShirt} />
                </g>
              )}
            </g>

            {/* ===== RIGHT LEG (back) ===== */}
            <g id="right_leg" style={{ transform: `translateY(${idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
              <ellipse cx="155" cy="230" rx="18" ry="30" fill="url(#foxBodyGrad)" />
              {equippedPants && <g transform="translate(155, 230)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
              {equippedShoes ? (
                <g transform="translate(155, 255)"><WearableShoe item={equippedShoes} side="right" /></g>
              ) : (
                <g>
                  <ellipse cx="155" cy="255" rx="14" ry="10" fill="url(#pawGrad)" />
                  <circle cx="148" cy="262" r="3.5" fill="url(#pawGrad)" />
                  <circle cx="155" cy="264" r="3.5" fill="url(#pawGrad)" />
                  <circle cx="162" cy="262" r="3.5" fill="url(#pawGrad)" />
                </g>
              )}
            </g>

            {/* ===== LEFT LEG (front-left) ===== */}
            <g id="left_leg" style={{ transform: `translateY(${idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? 0 : -4) : 0}px)`, transition: 'transform 0.2s' }}>
              <ellipse cx="85" cy="235" rx="16" ry="28" fill="url(#foxBodyGrad)" />
              {equippedPants && <g transform="translate(85, 233)"><WearablePantsLeg item={equippedPants} side="left" /></g>}
              {equippedShoes ? (
                <g transform="translate(85, 258)"><WearableShoe item={equippedShoes} side="left" /></g>
              ) : (
                <g>
                  <ellipse cx="85" cy="258" rx="13" ry="9" fill="url(#pawGrad)" />
                  <circle cx="78" cy="264" r="3.5" fill="url(#pawGrad)" />
                  <circle cx="85" cy="266" r="3.5" fill="url(#pawGrad)" />
                  <circle cx="92" cy="264" r="3.5" fill="url(#pawGrad)" />
                </g>
              )}
            </g>

            {/* ===== SECOND FRONT LEG ===== */}
            <g style={{ transform: `translateY(${idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
              <ellipse cx="110" cy="238" rx="16" ry="28" fill="url(#foxBodyGrad)" />
              {equippedPants && <g transform="translate(110, 236)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
              {equippedShoes ? (
                <g transform="translate(110, 261)"><WearableShoe item={equippedShoes} side="right" /></g>
              ) : (
                <g>
                  <ellipse cx="110" cy="261" rx="13" ry="9" fill="url(#pawGrad)" />
                  <circle cx="103" cy="267" r="3.5" fill="url(#pawGrad)" />
                  <circle cx="110" cy="269" r="3.5" fill="url(#pawGrad)" />
                  <circle cx="117" cy="267" r="3.5" fill="url(#pawGrad)" />
                </g>
              )}
            </g>

            {/* ===== HEAD GROUP (follows mouse) ===== */}
            <g id="head" style={{
              transform: `rotate(${headRotation.x + walkRot}deg) translateY(${walkBob + headRotation.y}px)`,
              transformOrigin: '120px 100px',
              transition: 'transform 0.1s ease-out',
            }}>
              {/* Head shape */}
              <ellipse cx="120" cy="100" rx="55" ry="60" fill="url(#foxHeadGrad)" />
              <ellipse cx="105" cy="80" rx="28" ry="25" fill="url(#specHighlight)" />

              {/* Ears */}
              <path d="M 78 70 Q 62 25 80 40 Q 72 18 92 50 Z" fill="url(#foxHeadGrad)" />
              <path d="M 80 62 Q 70 35 82 42 Q 75 28 88 52 Z" fill="url(#earInnerGrad)" />
              <path d="M 162 70 Q 178 25 160 40 Q 168 18 148 50 Z" fill="url(#foxHeadGrad)" />
              <path d="M 160 62 Q 170 35 158 42 Q 165 28 152 52 Z" fill="url(#earInnerGrad)" />

              {/* Face mask */}
              <ellipse cx="120" cy="115" rx="35" ry="28" fill="url(#foxBellyGrad)" opacity="0.8" />

              {/* ===== EYES GROUP ===== */}
              <g id="eyes" style={{ transform: isBlink ? 'scaleY(0.08)' : 'none', transformOrigin: '120px 95px', transition: 'transform 0.15s' }}>
                {/* Left eye */}
                <ellipse cx="98" cy="95" rx="14" ry="16" fill="url(#eyeWhiteGrad)" />
                <ellipse cx="98" cy="95" rx="14" ry="16" stroke="#E0D0C0" strokeWidth="0.5" fill="none" />
                <circle cx={98 + headRotation.x * 0.3} cy={95 + headRotation.y * 0.2} r="9" fill="url(#pupilGrad)" />
                <circle cx={96 + headRotation.x * 0.2} cy={92 + headRotation.y * 0.1} r="3.5" fill="white" />
                <circle cx={101 + headRotation.x * 0.2} cy={98 + headRotation.y * 0.1} r="1.5" fill="white" opacity="0.6" />

                {/* Right eye */}
                <ellipse cx="142" cy="95" rx="14" ry="16" fill="url(#eyeWhiteGrad)" />
                <ellipse cx="142" cy="95" rx="14" ry="16" stroke="#E0D0C0" strokeWidth="0.5" fill="none" />
                <circle cx={142 + headRotation.x * 0.3} cy={95 + headRotation.y * 0.2} r="9" fill="url(#pupilGrad)" />
                <circle cx={140 + headRotation.x * 0.2} cy={92 + headRotation.y * 0.1} r="3.5" fill="white" />
                <circle cx={145 + headRotation.x * 0.2} cy={98 + headRotation.y * 0.1} r="1.5" fill="white" opacity="0.6" />

                {/* Sunglasses — snapped to eyes center */}
                {equippedSunglasses && (
                  <g transform="translate(120, 96)">
                    <WearableSunglasses item={equippedSunglasses} />
                  </g>
                )}
              </g>

              {/* Nose */}
              <ellipse cx="120" cy="118" rx="8" ry="6" fill="url(#noseGrad)" />
              <ellipse cx="118" cy="116" rx="3" ry="2" fill="white" opacity="0.5" />

              {/* Mouth */}
              <path
                d={isJumping || idleAnimation === 'walk'
                  ? "M 112 126 Q 120 134 128 126"
                  : "M 114 125 Q 120 130 126 125"}
                stroke="#8B4513"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                style={{ transition: 'all 0.3s' }}
              />

              {/* Whiskers */}
              <line x1="75" y1="108" x2="95" y2="112" stroke="#D0A070" strokeWidth="1" opacity="0.5" />
              <line x1="75" y1="118" x2="95" y2="116" stroke="#D0A070" strokeWidth="1" opacity="0.5" />
              <line x1="165" y1="108" x2="145" y2="112" stroke="#D0A070" strokeWidth="1" opacity="0.5" />
              <line x1="165" y1="118" x2="145" y2="116" stroke="#D0A070" strokeWidth="1" opacity="0.5" />

              {/* Hat — child of head, moves with it */}
              {equippedHat && (
                <g transform="translate(120, 94)">
                  <WearableHat item={equippedHat} />
                </g>
              )}
            </g>
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
