import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [idleAnimation, setIdleAnimation] = useState<'none' | 'blink' | 'wiggle' | 'breathe' | 'walk'>('breathe');
  const [walkCycle, setWalkCycle] = useState(0);
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mood = getPetMood(hunger);
  const isHungry = hunger < HUNGER_THRESHOLD_HUNGRY;

  // Head tracking - follow mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.35;
      const dx = (e.clientX - centerX) / window.innerWidth;
      const dy = (e.clientY - centerY) / window.innerHeight;
      // Damped rotation, max ±12deg
      setHeadRotation(prev => ({
        x: prev.x + (dx * 12 - prev.x) * 0.15,
        y: prev.y + (dy * 8 - prev.y) * 0.15,
      }));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Touch tracking for mobile
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
      const animations: ('blink' | 'wiggle' | 'breathe' | 'walk')[] = ['blink', 'wiggle', 'breathe', 'walk'];
      const random = animations[Math.floor(Math.random() * animations.length)];
      setIdleAnimation(random);
      setTimeout(() => setIdleAnimation('breathe'), random === 'walk' ? 2000 : 800);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isEating, isJumping]);

  // Walking animation cycle
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
  const equippedGlasses = getEquippedItem('glasses');
  const equippedScarf = getEquippedItem('scarf');
  const equippedBow = getEquippedItem('bow');
  const equippedShirt = getEquippedItem('shirt');
  const equippedPants = getEquippedItem('pants');
  const equippedShoes = getEquippedItem('shoes');

  // Blink transform
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
        className={cn(
          'relative',
          onClick && 'cursor-pointer hover:scale-110 transition-transform'
        )}
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

        {/* Eating Overlay */}
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
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                <span className="absolute text-2xl animate-ping" style={{ animationDuration: '0.3s' }}>✨</span>
                <span className="absolute text-xl animate-ping -left-4" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }}>⭐</span>
                <span className="absolute text-xl animate-ping left-4" style={{ animationDuration: '0.35s', animationDelay: '0.2s' }}>💫</span>
              </div>
            )}
            {eatingPhase === 'chew' && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-success text-white px-4 py-2 rounded-full font-bold text-lg animate-bounce shadow-lg">
                יאמי! 😋
              </div>
            )}
          </div>
        )}

        {/* Main Fox SVG - Procedural 2.5D */}
        <div 
          className={cn(sizeClasses[size], 'relative z-10', getAnimationClass())}
          style={{ transform: isBlink ? 'scaleY(0.98)' : 'none', transition: 'transform 0.2s ease' }}
        >
          <svg
            viewBox="0 0 240 280"
            className={cn(
              'w-full h-full object-contain',
              eatingPhase === 'bite' || eatingPhase === 'chew' ? 'animate-munch' : ''
            )}
            style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))' }}
          >
            <defs>
              {/* Body gradient */}
              <radialGradient id="foxBodyGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFB060" />
                <stop offset="60%" stopColor="#FF8C42" />
                <stop offset="100%" stopColor="#E5722E" />
              </radialGradient>
              {/* Belly gradient */}
              <radialGradient id="foxBellyGrad" cx="50%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FFE4C8" />
                <stop offset="70%" stopColor="#FFD4A8" />
                <stop offset="100%" stopColor="#FFC088" />
              </radialGradient>
              {/* Head gradient */}
              <radialGradient id="foxHeadGrad" cx="45%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#FFB868" />
                <stop offset="50%" stopColor="#FF9A4A" />
                <stop offset="100%" stopColor="#E57828" />
              </radialGradient>
              {/* Inner ear */}
              <radialGradient id="earInnerGrad" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFB8D8" />
                <stop offset="100%" stopColor="#FF8CB8" />
              </radialGradient>
              {/* Eye white */}
              <radialGradient id="eyeWhiteGrad" cx="45%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F0F0F0" />
              </radialGradient>
              {/* Pupil */}
              <radialGradient id="pupilGrad" cx="40%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#444" />
                <stop offset="100%" stopColor="#111" />
              </radialGradient>
              {/* Nose */}
              <radialGradient id="noseGrad" cx="45%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#FF80B0" />
                <stop offset="100%" stopColor="#E04888" />
              </radialGradient>
              {/* Tail gradient */}
              <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB060" />
                <stop offset="50%" stopColor="#FF8C42" />
                <stop offset="100%" stopColor="#E5722E" />
              </linearGradient>
              {/* Tail tip */}
              <radialGradient id="tailTipGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF8F0" />
                <stop offset="100%" stopColor="#FFD8B0" />
              </radialGradient>
              {/* Paw gradient */}
              <radialGradient id="pawGrad" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#FFD0A0" />
                <stop offset="100%" stopColor="#FFB060" />
              </radialGradient>
              {/* Specular highlight */}
              <linearGradient id="specHighlight" x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              {/* Hat gradients */}
              <linearGradient id="partyHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B8A" />
                <stop offset="30%" stopColor="#FF4570" />
                <stop offset="70%" stopColor="#E03060" />
                <stop offset="100%" stopColor="#C02050" />
              </linearGradient>
              <linearGradient id="hatHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              {/* Shadow filter */}
              <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="2" dy="3" result="offsetBlur" />
                <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
              </filter>
            </defs>

            {/* ===== TAIL (behind body) ===== */}
            <g style={{ transform: `rotate(${tailSwing}deg)`, transformOrigin: '155px 195px', transition: 'transform 0.3s' }}>
              <ellipse cx="192" cy="185" rx="32" ry="48" fill="url(#tailGrad)" />
              <ellipse cx="192" cy="185" rx="32" ry="48" fill="url(#specHighlight)" />
              {/* Tail tip - white */}
              <ellipse cx="198" cy="175" rx="18" ry="28" fill="url(#tailTipGrad)" />
            </g>

            {/* ===== BACK LEGS ===== */}
            <g style={{ transform: `translateY(${idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
              <ellipse cx="155" cy="230" rx="18" ry="30" fill="url(#foxBodyGrad)" />
              <ellipse cx="155" cy="255" rx="14" ry="10" fill="url(#pawGrad)" />
              {/* Paw toes */}
              <circle cx="148" cy="262" r="3.5" fill="url(#pawGrad)" />
              <circle cx="155" cy="264" r="3.5" fill="url(#pawGrad)" />
              <circle cx="162" cy="262" r="3.5" fill="url(#pawGrad)" />
            </g>

            {/* ===== BODY ===== */}
            <g style={{ transform: `translateY(${walkBob}px)`, transition: 'transform 0.3s' }}>
              {/* Main body */}
              <ellipse cx="120" cy="195" rx="58" ry="55" fill="url(#foxBodyGrad)" />
              {/* Body specular */}
              <ellipse cx="105" cy="178" rx="30" ry="28" fill="url(#specHighlight)" />
              {/* Belly */}
              <ellipse cx="120" cy="205" rx="38" ry="35" fill="url(#foxBellyGrad)" />
              {/* Belly highlight */}
              <ellipse cx="112" cy="195" rx="20" ry="18" fill="white" opacity="0.12" />
            </g>

            {/* ===== FRONT LEGS ===== */}
            <g style={{ transform: `translateY(${idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? 0 : -4) : 0}px)`, transition: 'transform 0.2s' }}>
              <ellipse cx="85" cy="235" rx="16" ry="28" fill="url(#foxBodyGrad)" />
              <ellipse cx="85" cy="258" rx="13" ry="9" fill="url(#pawGrad)" />
              <circle cx="78" cy="264" r="3.5" fill="url(#pawGrad)" />
              <circle cx="85" cy="266" r="3.5" fill="url(#pawGrad)" />
              <circle cx="92" cy="264" r="3.5" fill="url(#pawGrad)" />
            </g>
            <g style={{ transform: `translateY(${idleAnimation === 'walk' ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
              <ellipse cx="110" cy="238" rx="16" ry="28" fill="url(#foxBodyGrad)" />
              <ellipse cx="110" cy="261" rx="13" ry="9" fill="url(#pawGrad)" />
              <circle cx="103" cy="267" r="3.5" fill="url(#pawGrad)" />
              <circle cx="110" cy="269" r="3.5" fill="url(#pawGrad)" />
              <circle cx="117" cy="267" r="3.5" fill="url(#pawGrad)" />
            </g>

            {/* ===== HEAD GROUP (follows mouse) ===== */}
            <g style={{
              transform: `rotate(${headRotation.x + walkRot}deg) translateY(${walkBob + headRotation.y}px)`,
              transformOrigin: '120px 100px',
              transition: 'transform 0.1s ease-out',
            }}>
              {/* Head */}
              <ellipse cx="120" cy="100" rx="55" ry="60" fill="url(#foxHeadGrad)" />
              {/* Head specular highlight */}
              <ellipse cx="105" cy="80" rx="28" ry="25" fill="url(#specHighlight)" />

              {/* Ears */}
              <g>
                {/* Left ear */}
                <path d="M 78 70 Q 62 25 80 40 Q 72 18 92 50 Z" fill="url(#foxHeadGrad)" />
                <path d="M 80 62 Q 70 35 82 42 Q 75 28 88 52 Z" fill="url(#earInnerGrad)" />
                {/* Right ear */}
                <path d="M 162 70 Q 178 25 160 40 Q 168 18 148 50 Z" fill="url(#foxHeadGrad)" />
                <path d="M 160 62 Q 170 35 158 42 Q 165 28 152 52 Z" fill="url(#earInnerGrad)" />
              </g>

              {/* Face mask - white cheeks */}
              <ellipse cx="120" cy="115" rx="35" ry="28" fill="url(#foxBellyGrad)" opacity="0.8" />

              {/* Eyes */}
              <g style={{ transform: isBlink ? 'scaleY(0.08)' : 'none', transformOrigin: '120px 95px', transition: 'transform 0.15s' }}>
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

              {/* ===== HAT (SVG, attached to head) ===== */}
              {equippedHat && (
                <g>
                  {equippedHat.id === 'crown' && (
                    <g transform="translate(120, 42)">
                      {/* Crown base */}
                      <path d="M -28 10 L -22 -15 L -10 0 L 0 -22 L 10 0 L 22 -15 L 28 10 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
                      <path d="M -28 10 L -22 -15 L -10 0 L 0 -22 L 10 0 L 22 -15 L 28 10 Z" fill="url(#hatHighlight)" />
                      <rect x="-28" y="10" width="56" height="8" rx="2" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
                      <rect x="-28" y="10" width="56" height="8" rx="2" fill="url(#hatHighlight)" />
                      {/* Jewels */}
                      <circle cx="-12" cy="14" r="3" fill="#FF2020" />
                      <circle cx="0" cy="14" r="3" fill="#2060FF" />
                      <circle cx="12" cy="14" r="3" fill="#20CC20" />
                      <circle cx="-12" cy="14" r="1" fill="white" opacity="0.6" />
                      <circle cx="0" cy="14" r="1" fill="white" opacity="0.6" />
                      <circle cx="12" cy="14" r="1" fill="white" opacity="0.6" />
                    </g>
                  )}
                  {equippedHat.id === 'wizard_hat' && (
                    <g transform="translate(120, 45)">
                      <path d="M 0 -55 Q 15 -20 32 10 L -32 10 Q -15 -20 0 -55 Z" fill="#3B2080" stroke="#2A1060" strokeWidth="1.5" />
                      <path d="M 0 -55 Q 5 -25 10 10 L -10 10 Q -5 -25 0 -55 Z" fill="white" opacity="0.12" />
                      <ellipse cx="0" cy="10" rx="36" ry="6" fill="#3B2080" stroke="#2A1060" strokeWidth="1" />
                      <ellipse cx="0" cy="10" rx="36" ry="6" fill="url(#hatHighlight)" />
                      {/* Stars on hat */}
                      <text x="-8" y="-20" fontSize="10" fill="#FFD700">⭐</text>
                      <text x="5" y="-35" fontSize="8" fill="#FFD700">✨</text>
                    </g>
                  )}
                  {equippedHat.id === 'party_hat' && (
                    <g transform="translate(120, 45)">
                      <path d="M 0 -50 L 25 12 L -25 12 Z" fill="url(#partyHatGrad)" stroke="#C02050" strokeWidth="1" />
                      <path d="M 0 -50 L 8 12 L -8 12 Z" fill="url(#hatHighlight)" />
                      {/* Stripes */}
                      <line x1="-8" y1="-10" x2="8" y2="-10" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
                      <line x1="-15" y1="0" x2="15" y2="0" stroke="#40E0D0" strokeWidth="2" opacity="0.6" />
                      {/* Pom-pom */}
                      <circle cx="0" cy="-52" r="6" fill="#FFD700" />
                      <circle cx="-2" cy="-54" r="2" fill="white" opacity="0.5" />
                      <ellipse cx="0" cy="12" rx="28" ry="5" fill="url(#partyHatGrad)" opacity="0.7" />
                    </g>
                  )}
                  {equippedHat.id === 'cap' && (
                    <g transform="translate(120, 52)">
                      <ellipse cx="0" cy="5" rx="34" ry="10" fill="#2266CC" stroke="#1A4488" strokeWidth="1" />
                      <path d="M -30 5 Q -30 -15 0 -18 Q 30 -15 30 5 Z" fill="#2266CC" stroke="#1A4488" strokeWidth="1" />
                      <path d="M -30 5 Q -30 -15 0 -18 Q 10 -15 10 5 Z" fill="url(#hatHighlight)" />
                      {/* Visor */}
                      <ellipse cx="18" cy="8" rx="22" ry="6" fill="#1A4488" />
                      <ellipse cx="18" cy="7" rx="20" ry="4" fill="#2266CC" opacity="0.5" />
                    </g>
                  )}
                </g>
              )}

              {/* Glasses (SVG) */}
              {equippedGlasses && (
                <g>
                  {equippedGlasses.id === 'sunglasses' && (
                    <g>
                      <rect x="80" y="88" width="28" height="20" rx="8" fill="#333" opacity="0.85" stroke="#222" strokeWidth="1.5" />
                      <rect x="132" y="88" width="28" height="20" rx="8" fill="#333" opacity="0.85" stroke="#222" strokeWidth="1.5" />
                      <line x1="108" y1="96" x2="132" y2="96" stroke="#222" strokeWidth="2" />
                      <rect x="82" y="89" width="12" height="6" rx="3" fill="white" opacity="0.15" />
                      <rect x="134" y="89" width="12" height="6" rx="3" fill="white" opacity="0.15" />
                    </g>
                  )}
                  {equippedGlasses.id === 'star_glasses' && (
                    <g>
                      <polygon points="98,82 102,92 112,94 105,101 107,112 98,106 89,112 91,101 84,94 94,92" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
                      <polygon points="142,82 146,92 156,94 149,101 151,112 142,106 133,112 135,101 128,94 138,92" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
                      <line x1="108" y1="96" x2="132" y2="96" stroke="#DAA520" strokeWidth="2" />
                    </g>
                  )}
                </g>
              )}
            </g>

            {/* Scarf */}
            {equippedScarf && (
              <g>
                <path d="M 75 152 Q 120 165 165 152 Q 168 160 165 168 Q 120 180 75 168 Q 72 160 75 152 Z" fill="#CC2020" stroke="#AA1818" strokeWidth="1" />
                <path d="M 75 152 Q 100 162 120 158 Q 100 165 75 160 Z" fill="white" opacity="0.15" />
                <path d="M 130 168 Q 135 185 128 195 Q 132 195 136 185 Q 140 175 135 168 Z" fill="#CC2020" stroke="#AA1818" strokeWidth="0.5" />
              </g>
            )}

            {/* Bow */}
            {equippedBow && (
              <g transform="translate(160, 165)">
                <ellipse cx="-12" cy="0" rx="12" ry="8" fill="#FF69B4" stroke="#E05090" strokeWidth="1" />
                <ellipse cx="12" cy="0" rx="12" ry="8" fill="#FF69B4" stroke="#E05090" strokeWidth="1" />
                <circle cx="0" cy="0" r="4" fill="#E05090" />
                <ellipse cx="-8" cy="-3" rx="4" ry="2" fill="white" opacity="0.3" />
                <ellipse cx="8" cy="-3" rx="4" ry="2" fill="white" opacity="0.3" />
              </g>
            )}
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