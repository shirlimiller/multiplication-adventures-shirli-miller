import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { HungerBar } from './HungerBar';
import { HappinessBar } from './HappinessBar';
import { CandyShop } from './CandyShop';
import { ClothingShop } from './ClothingShop';
import { WalkSelector } from './WalkSelector';
import { ShopIcon } from './ShopIcon';
import { ClothingShopIcon } from './ClothingShopIcon';
import { WalkIcon } from './WalkIcon';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { ShopItem, WalkLocation, getPetMessage, getPetMood, getWalkMessage } from '@/lib/petTypes';
import { ClothingItem } from '@/lib/clothingTypes';
import { useClothingState } from '@/hooks/useClothingState';
import { checkDivisionTableMastery, checkTableMastery, Operation } from '@/lib/gameUtils';
import { Star, Play, Award, Users, X, Divide, Check, Plus, Minus } from 'lucide-react';

interface PetCareHomeProps {
  player: Player;
  stats: PlayerStats;
  currentHunger: number;
  currentHappiness: number;
  isDoubleStarsActive: boolean;
  onStartGame: () => void;
  onStartBalloonGame: (config: { operation: Operation; selectedNumbers: number[] }) => void;
  onSwitchPlayer: () => void;
  onPurchase: (item: ShopItem) => boolean;
  onSpendStars: (amount: number) => void;
  onFeedPet: (item: ShopItem) => void;
  onWalkPet: (location: WalkLocation) => void;
  onPetInteract: () => void;
}

export function PetCareHome({
  player,
  stats,
  currentHunger,
  currentHappiness,
  isDoubleStarsActive,
  onStartGame,
  onStartBalloonGame,
  onSwitchPlayer,
  onPurchase,
  onSpendStars,
  onFeedPet,
  onWalkPet,
  onPetInteract,
}: PetCareHomeProps) {
  const mulCertCount = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => checkTableMastery(stats, t).isMastered).length;
  const divCertCount = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => checkDivisionTableMastery(stats, t).isMastered).length;
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isClothingShopOpen, setIsClothingShopOpen] = useState(false);
  const [isWalkSelectorOpen, setIsWalkSelectorOpen] = useState(false);
  const [foxMessage, setFoxMessage] = useState(getPetMessage(getPetMood(currentHunger), player.name));
  const [isEating, setIsEating] = useState(false);
  const [eatingFood, setEatingFood] = useState<ShopItem | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [showBalloonConfig, setShowBalloonConfig] = useState(false);
  const [balloonOps, setBalloonOps] = useState<Set<string>>(new Set(['multiply']));
  const [balloonNumbers, setBalloonNumbers] = useState<number[]>([]);
  const [balloonAllNumbers, setBalloonAllNumbers] = useState(true);

  const toggleBalloonOp = (op: string) => {
    setBalloonOps(prev => {
      const next = new Set(prev);
      if (next.has(op)) {
        if (next.size > 1) next.delete(op); // must keep at least one
      } else {
        next.add(op);
      }
      return next;
    });
  };

  const getResolvedOperation = (): Operation => {
    const ops = Array.from(balloonOps);
    if (ops.length === 1) return ops[0] as Operation;
    if (ops.includes('multiply') && ops.includes('divide') && ops.length === 2) return 'multiply_divide';
    // For mixed including add/subtract, we'll use the first one for now
    // The balloon game handles mixed via the operation prop
    return ops[0] as Operation;
  };
  
  const {
    clothing,
    purchaseItem,
    equipItem,
    unequipItem,
    ownsItem,
    isEquipped,
  } = useClothingState(player.id);

  const handlePetClick = () => {
    onPetInteract();
    const mood = getPetMood(currentHunger);
    if (mood === 'hungry' || mood === 'very_hungry') {
      setFoxMessage('אני רעב! בוא נתרגל כדי להרוויח כוכבים לאוכל! 🍕');
    } else if (currentHappiness < 40) {
      setFoxMessage('אני צריך טיול! בוא ניקח הפסקה! 🌳');
    } else {
      setFoxMessage('היי! זה כייף שבאת! בוא נשחק! 🎉');
    }
  };

  const handleWalk = useCallback((location: WalkLocation) => {
    // Deduct stars
    onSpendStars(location.price);
    
    setIsWalking(true);
    setFoxMessage(`יצאנו לטיול ל${location.name}! ${location.emoji}`);
    
    // Walk animation duration
    setTimeout(() => {
      onWalkPet(location);
      setIsWalking(false);
      setFoxMessage(getWalkMessage());
    }, location.duration);
  }, [onWalkPet, onSpendStars]);

  const handleNotEnoughStarsForWalk = useCallback(() => {
    setFoxMessage('אני רוצה לצאת לטיול! בוא נשחק ונרוויח עוד כוכבים! 🌟');
  }, []);

  const handlePurchase = useCallback((item: ShopItem): boolean => {
    if (stats.totalStars < item.price) {
      return false;
    }
    
    onSpendStars(item.price);
    onFeedPet(item);
    setEatingFood(item);
    setIsEating(true);
    setIsShopOpen(false);
    
    // Extended eating animation
    setTimeout(() => {
      setIsEating(false);
      setEatingFood(null);
    }, 2500);
    
    return true;
  }, [stats.totalStars, onSpendStars, onFeedPet]);

  const handleShowMessage = (message: string) => {
    setFoxMessage(message);
  };

  const handleClothingPurchase = useCallback((item: ClothingItem): boolean => {
    if (ownsItem(item.id)) {
      return true; // Already owned
    }
    if (stats.totalStars < item.price) {
      return false;
    }
    
    onSpendStars(item.price);
    return purchaseItem(item);
  }, [stats.totalStars, onSpendStars, purchaseItem, ownsItem]);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-village-map overflow-hidden relative" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float">☁️</div>
        <div className="absolute top-20 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute top-5 left-1/3 text-4xl opacity-25 animate-float" style={{ animationDelay: '2s' }}>☁️</div>
        <div className="absolute bottom-0 left-0 text-6xl">🌳</div>
        <div className="absolute bottom-0 right-0 text-6xl">🌳</div>
        <div className="absolute bottom-10 left-20 text-4xl">🌷</div>
        <div className="absolute bottom-10 right-20 text-4xl">🌻</div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-3 md:p-4">
        <Button
          variant="ghost"
          onClick={onSwitchPlayer}
          className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-soft hover:shadow-card transition-all text-sm"
        >
          <Users className="w-4 h-4" />
          <span className="font-bold" dir="auto">{player.name}</span>
          <span className="text-xl">{player.avatar}</span>
        </Button>
        
        <div className="flex items-center gap-1.5 bg-gradient-gold rounded-full px-4 py-1.5 shadow-gold" dir="ltr">
          <Star className="w-5 h-5 text-white fill-white drop-shadow" />
          <span className="text-lg font-extrabold text-white drop-shadow">{stats.totalStars}</span>
          {isDoubleStarsActive && (
            <span className="bg-candy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              x2
            </span>
          )}
        </div>
      </header>

      {/* Main Content - Pet Area with side icons */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-3 py-4 md:py-8 min-h-0">
        <div className="flex items-center gap-2 md:gap-4 w-full max-w-lg justify-center">
          
          {/* Right side - Action icons (vertically stacked) */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsShopOpen(true)}
              className="flex flex-col items-center gap-0.5 bg-card/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-soft hover:scale-110 transition-all border-2 border-border"
            >
              <span className="text-2xl md:text-3xl">🍕</span>
              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground">אוכל</span>
            </button>
            <button
              onClick={() => setIsClothingShopOpen(true)}
              className="flex flex-col items-center gap-0.5 bg-card/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-soft hover:scale-110 transition-all border-2 border-border"
            >
              <span className="text-2xl md:text-3xl">👕</span>
              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground">בגדים</span>
            </button>
            <button
              onClick={() => setIsWalkSelectorOpen(true)}
              className={`flex flex-col items-center gap-0.5 bg-card/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-soft hover:scale-110 transition-all border-2 ${
                currentHappiness < 40 ? 'border-accent animate-pulse' : 'border-border'
              }`}
            >
              <span className="text-2xl md:text-3xl">🌳</span>
              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground">טיול</span>
            </button>
          </div>

          {/* Center - Fox (smaller) + bars + play button below */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="relative w-full scale-[0.8] md:scale-90 origin-bottom">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 md:w-56 h-8 md:h-12 bg-primary/20 rounded-full blur-lg" />
              <FoxMascot
                message={foxMessage}
                size="hero"
                hunger={currentHunger}
                onClick={handlePetClick}
                isEating={isEating}
                eatingFood={eatingFood}
                clothing={clothing}
                animate
              />
            </div>

            {/* Hunger and Happiness Bars */}
            <div className="mt-2 md:mt-4 w-full max-w-xs space-y-2">
              <HungerBar hunger={currentHunger} />
              <HappinessBar happiness={currentHappiness} />
            </div>

            {/* Play button below fox */}
            <div className="mt-3 md:mt-5">
              <Button
                onClick={onStartGame}
                className="h-14 md:h-16 px-6 md:px-8 rounded-full bg-gradient-success shadow-lg text-white font-extrabold text-base md:text-lg hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 md:w-6 md:h-6 ml-2 fill-white" />
                בוא נשחק!
              </Button>
            </div>
          </div>

          {/* Left side - Balloon Game */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowBalloonConfig(true)}
              className="relative bg-gradient-to-br from-candy to-secondary rounded-2xl p-3 shadow-candy text-center hover:scale-105 transition-all group overflow-visible"
            >
              {/* Colorful balloons SVG */}
              <svg width="48" height="56" viewBox="0 0 100 120" className="mx-auto mb-1 drop-shadow-md md:w-[56px] md:h-[64px]">
                {/* Red balloon */}
                <ellipse cx="30" cy="35" rx="16" ry="20" fill="hsl(340 80% 60%)" />
                <ellipse cx="24" cy="28" rx="4" ry="7" fill="white" opacity="0.3" transform="rotate(-15 24 28)" />
                <line x1="30" y1="55" x2="50" y2="100" stroke="hsl(340 80% 50%)" strokeWidth="1" />
                {/* Green balloon */}
                <ellipse cx="50" cy="28" rx="16" ry="20" fill="hsl(145 60% 55%)" />
                <ellipse cx="44" cy="21" rx="4" ry="7" fill="white" opacity="0.3" transform="rotate(-15 44 21)" />
                <line x1="50" y1="48" x2="50" y2="100" stroke="hsl(145 60% 45%)" strokeWidth="1" />
                {/* Blue balloon */}
                <ellipse cx="70" cy="35" rx="16" ry="20" fill="hsl(200 80% 60%)" />
                <ellipse cx="64" cy="28" rx="4" ry="7" fill="white" opacity="0.3" transform="rotate(-15 64 28)" />
                <line x1="70" y1="55" x2="50" y2="100" stroke="hsl(200 80% 50%)" strokeWidth="1" />
                {/* Yellow balloon */}
                <ellipse cx="50" cy="45" rx="14" ry="18" fill="hsl(45 90% 60%)" />
                <ellipse cx="45" cy="39" rx="3" ry="6" fill="white" opacity="0.3" transform="rotate(-15 45 39)" />
                <line x1="50" y1="63" x2="50" y2="100" stroke="hsl(45 90% 50%)" strokeWidth="1" />
                {/* Purple balloon */}
                <ellipse cx="38" cy="50" rx="13" ry="17" fill="hsl(280 60% 65%)" />
                <ellipse cx="33" cy="44" rx="3" ry="6" fill="white" opacity="0.3" transform="rotate(-15 33 44)" />
                <line x1="38" y1="67" x2="50" y2="100" stroke="hsl(280 60% 55%)" strokeWidth="1" />
                {/* Orange balloon */}
                <ellipse cx="62" cy="50" rx="13" ry="17" fill="hsl(20 85% 60%)" />
                <ellipse cx="57" cy="44" rx="3" ry="6" fill="white" opacity="0.3" transform="rotate(-15 57 44)" />
                <line x1="62" y1="67" x2="50" y2="100" stroke="hsl(20 85% 50%)" strokeWidth="1" />
                {/* Knot */}
                <circle cx="50" cy="100" r="3" fill="hsl(var(--muted-foreground))" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-extrabold text-white drop-shadow block leading-tight">משחק<br/>בלונים</span>
            </button>
          </div>
        </div>

        {/* Balloon Config Modal */}
        {showBalloonConfig && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" dir="rtl" onClick={() => setShowBalloonConfig(false)}>
            <div className="bg-card rounded-3xl p-5 shadow-card max-w-sm w-full space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-extrabold text-center">🎈 משחק בלונים</h2>
              
              {/* Operation selection */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-center">סמן פעולות:</p>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    { op: 'multiply', label: 'כפל', emoji: '✖️', color: 'hsl(145 60% 55%)' },
                    { op: 'divide', label: 'חילוק', emoji: '➗', color: 'hsl(200 80% 60%)' },
                    { op: 'add', label: 'חיבור', emoji: '➕', color: 'hsl(45 90% 60%)' },
                    { op: 'subtract', label: 'חיסור', emoji: '➖', color: 'hsl(340 80% 65%)' },
                  ]).map(({ op, label, emoji, color }) => {
                    const selected = balloonOps.has(op);
                    return (
                      <button
                        key={op}
                        onClick={() => toggleBalloonOp(op)}
                        style={{ borderColor: selected ? color : undefined, backgroundColor: selected ? `${color.replace(')', ' / 0.15)')}` : undefined }}
                        className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all relative ${
                          selected ? 'scale-105 shadow-md' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {selected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <span className="text-xl">{emoji}</span>
                        <span className="text-[11px] font-bold">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number selection */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-center">מספרים:</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => { setBalloonAllNumbers(true); setBalloonNumbers([]); }}
                    className={`px-4 py-2 rounded-full border-2 font-bold text-sm transition-all ${
                      balloonAllNumbers ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    כל המספרים 🎲
                  </button>
                  <button
                    onClick={() => setBalloonAllNumbers(false)}
                    className={`px-4 py-2 rounded-full border-2 font-bold text-sm transition-all ${
                      !balloonAllNumbers ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    בחירה ידנית ✏️
                  </button>
                </div>

                {!balloonAllNumbers && (
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
                      const selected = balloonNumbers.includes(n);
                      const iceColors = [
                        'hsl(340 80% 75%)', 'hsl(30 90% 70%)', 'hsl(50 90% 70%)',
                        'hsl(145 60% 65%)', 'hsl(200 80% 70%)', 'hsl(280 60% 75%)',
                        'hsl(10 80% 72%)', 'hsl(170 60% 65%)', 'hsl(320 70% 75%)',
                        'hsl(45 85% 72%)', 'hsl(220 70% 72%)', 'hsl(0 75% 72%)',
                      ];
                      return (
                        <button
                          key={n}
                          onClick={() => setBalloonNumbers(prev => 
                            prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
                          )}
                          style={{ backgroundColor: selected ? iceColors[n - 1] : undefined }}
                          className={`w-9 h-9 rounded-full border-2 font-extrabold text-base transition-all ${
                            selected ? 'text-white border-transparent scale-110 shadow-lg' : 'border-border'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const nums = balloonAllNumbers 
                    ? Array.from({ length: 10 }, (_, i) => i + 1) 
                    : balloonNumbers;
                  if (nums.length === 0) return;
                  setShowBalloonConfig(false);
                  onStartBalloonGame({ operation: getResolvedOperation(), selectedNumbers: nums });
                }}
                disabled={!balloonAllNumbers && balloonNumbers.length === 0}
                className="w-full bg-gradient-to-r from-candy to-secondary text-white font-extrabold text-lg py-3 rounded-full shadow-candy hover:scale-105 transition-all disabled:opacity-50"
              >
                🎈 יאללה, בואו נשחק!
              </button>
            </div>
          </div>
        )}
      </main>

      <CandyShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        totalStars={stats.totalStars}
        onPurchase={handlePurchase}
        onShowMessage={handleShowMessage}
      />

      {/* Clothing Shop Modal */}
      <ClothingShop
        isOpen={isClothingShopOpen}
        onClose={() => setIsClothingShopOpen(false)}
        totalStars={stats.totalStars}
        clothing={clothing}
        onPurchase={handleClothingPurchase}
        onEquip={equipItem}
        onUnequip={unequipItem}
        onSpendStars={onSpendStars}
        ownsItem={ownsItem}
        isEquipped={isEquipped}
      />

      {/* Walk Selector Modal */}
      <WalkSelector
        isOpen={isWalkSelectorOpen}
        onClose={() => setIsWalkSelectorOpen(false)}
        onSelectWalk={handleWalk}
        currentHappiness={currentHappiness}
        totalStars={stats.totalStars}
        onNotEnoughStars={handleNotEnoughStarsForWalk}
      />
    </div>
  );
}
