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

          {/* Center - Fox + bars + buttons below */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="relative w-full">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 md:w-64 h-10 md:h-14 bg-primary/20 rounded-full blur-lg" />
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
            <div className="mt-3 md:mt-6 w-full max-w-xs space-y-2">
              <HungerBar hunger={currentHunger} />
              <HappinessBar happiness={currentHappiness} />
            </div>

            {/* Play button + Balloon game below fox */}
            <div className="mt-3 md:mt-5 flex items-center gap-3">
              <Button
                onClick={onStartGame}
                className="h-14 md:h-16 px-6 md:px-8 rounded-full bg-gradient-success shadow-lg text-white font-extrabold text-base md:text-lg hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 md:w-6 md:h-6 ml-2 fill-white" />
                בוא נשחק!
              </Button>

              <button
                onClick={() => setShowBalloonConfig(true)}
                className="relative bg-gradient-to-br from-candy to-secondary rounded-2xl px-4 py-2.5 shadow-candy text-center hover:scale-105 transition-all group overflow-visible"
              >
                <span className="absolute -top-2 -right-1 text-sm animate-float">🎈</span>
                <span className="absolute -top-1 -left-2 text-xs animate-float" style={{ animationDelay: '0.5s' }}>🎈</span>
                <div className="text-xl mb-0.5">🎈</div>
                <span className="text-[10px] font-extrabold text-white drop-shadow">בלונים!</span>
              </button>
            </div>
          </div>
        </div>

      {/* Candy Shop Modal */}
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
