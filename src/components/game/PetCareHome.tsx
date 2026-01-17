import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';
import { HungerBar } from './HungerBar';
import { CandyShop } from './CandyShop';
import { BackButton } from './BackButton';
import { Player, PlayerStats } from '@/lib/playerTypes';
import { ShopItem, getPetMessage, getPetMood } from '@/lib/petTypes';
import { Star, ShoppingBag, Play, Trophy, Users } from 'lucide-react';

interface PetCareHomeProps {
  player: Player;
  stats: PlayerStats;
  currentHunger: number;
  isDoubleStarsActive: boolean;
  onStartGame: () => void;
  onSwitchPlayer: () => void;
  onPurchase: (item: ShopItem) => boolean;
  onSpendStars: (amount: number) => void;
  onFeedPet: (item: ShopItem) => void;
  onPetInteract: () => void;
}

export function PetCareHome({
  player,
  stats,
  currentHunger,
  isDoubleStarsActive,
  onStartGame,
  onSwitchPlayer,
  onPurchase,
  onSpendStars,
  onFeedPet,
  onPetInteract,
}: PetCareHomeProps) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [foxMessage, setFoxMessage] = useState(getPetMessage(getPetMood(currentHunger), player.name));
  const [isEating, setIsEating] = useState(false);
  const [eatingFood, setEatingFood] = useState<ShopItem | null>(null);

  const handlePetClick = () => {
    onPetInteract();
    const mood = getPetMood(currentHunger);
    if (mood === 'hungry' || mood === 'very_hungry') {
      setFoxMessage('אני רעב! בוא נתרגל כדי להרוויח כוכבים לאוכל! 🍕');
    } else {
      setFoxMessage('היי! זה כייף שבאת! בוא נשחק! 🎉');
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-garden overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Clouds */}
        <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float">☁️</div>
        <div className="absolute top-20 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute top-5 left-1/3 text-4xl opacity-25 animate-float" style={{ animationDelay: '2s' }}>☁️</div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 text-6xl">🌳</div>
        <div className="absolute bottom-0 right-0 text-6xl">🌳</div>
        <div className="absolute bottom-10 left-20 text-4xl">🌷</div>
        <div className="absolute bottom-10 right-20 text-4xl">🌻</div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        {/* Switch Player Button */}
        <Button
          variant="ghost"
          onClick={onSwitchPlayer}
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft hover:shadow-card transition-all"
        >
          <Users className="w-5 h-5" />
          <span className="font-bold">{player.name}</span>
          <span className="text-2xl">{player.avatar}</span>
        </Button>
        
        {/* Star Counter */}
        <div className="flex items-center gap-2 bg-gradient-gold rounded-full px-5 py-2 shadow-gold">
          <Star className="w-7 h-7 text-white fill-white drop-shadow" />
          <span className="text-2xl font-extrabold text-white drop-shadow">{stats.totalStars}</span>
          {isDoubleStarsActive && (
            <span className="bg-candy text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              x2
            </span>
          )}
        </div>
      </header>

      {/* Main Content - Pet Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        {/* Living Room / Garden Setting */}
        <div className="relative w-full max-w-lg">
          {/* Ground/Platform */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-16 bg-primary/20 rounded-full blur-lg" />
          
          {/* Fox with message */}
          <FoxMascot
            message={foxMessage}
            size="hero"
            hunger={currentHunger}
            onClick={handlePetClick}
            isEating={isEating}
            eatingFood={eatingFood}
            animate
          />
        </div>

        {/* Hunger Bar */}
        <div className="mt-8 w-full max-w-xs">
          <HungerBar hunger={currentHunger} />
        </div>

        {/* Quick Stats */}
        <div className="mt-6 flex gap-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-soft text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto" />
            <span className="text-sm font-bold">{stats.conqueredTables.length}/10</span>
            <p className="text-xs text-muted-foreground">עולמות</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-soft text-center">
            <span className="text-2xl">🎮</span>
            <span className="text-sm font-bold block">{stats.totalGames}</span>
            <p className="text-xs text-muted-foreground">משחקים</p>
          </div>
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <footer className="relative z-10 p-6 flex justify-center gap-4">
        {/* Shop Button */}
        <Button
          onClick={() => setIsShopOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-candy shadow-candy hover:scale-110 transition-all"
        >
          <ShoppingBag className="w-8 h-8 text-white" />
        </Button>

        {/* Play Button - Large and prominent */}
        <Button
          onClick={onStartGame}
          className="h-20 px-10 rounded-full bg-gradient-success shadow-lg text-white font-extrabold text-xl hover:scale-105 transition-all"
        >
          <Play className="w-8 h-8 ml-2 fill-white" />
          בוא נשחק!
        </Button>
      </footer>

      {/* Candy Shop Modal */}
      <CandyShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        totalStars={stats.totalStars}
        onPurchase={handlePurchase}
        onShowMessage={handleShowMessage}
      />
    </div>
  );
}
