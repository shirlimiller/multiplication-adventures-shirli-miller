import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, MapPin } from 'lucide-react';
import { WalkLocation } from '@/lib/petTypes';

export const WALK_LOCATIONS: WalkLocation[] = [
  {
    id: 'park',
    name: 'פארק',
    emoji: '🏞️',
    description: 'מרחבים ירוקים ואוויר צח!',
    price: 15,
    happinessRestore: 25,
    duration: 3000,
  },
  {
    id: 'beach',
    name: 'חוף הים',
    emoji: '🏖️',
    description: 'חול, גלים ושמש!',
    price: 25,
    happinessRestore: 35,
    duration: 4000,
  },
  {
    id: 'forest',
    name: 'יער',
    emoji: '🌲',
    description: 'עצים גבוהים וציפורים!',
    price: 20,
    happinessRestore: 30,
    duration: 3500,
  },
  {
    id: 'playground',
    name: 'גן שעשועים',
    emoji: '🎢',
    description: 'מגלשות ונדנדות!',
    price: 30,
    happinessRestore: 40,
    duration: 4500,
  },
  {
    id: 'mountain',
    name: 'הר',
    emoji: '⛰️',
    description: 'טיפוס ונוף מדהים!',
    price: 40,
    happinessRestore: 45,
    duration: 5000,
  },
];

interface WalkSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWalk: (location: WalkLocation) => void;
  currentHappiness: number;
  totalStars: number;
  onNotEnoughStars: () => void;
}

export function WalkSelector({ isOpen, onClose, onSelectWalk, currentHappiness, totalStars, onNotEnoughStars }: WalkSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<WalkLocation | null>(null);

  if (!isOpen) return null;

  const handleSelectLocation = (location: WalkLocation) => {
    if (totalStars < location.price) {
      onNotEnoughStars();
      return;
    }
    setSelectedLocation(location);
    onSelectWalk(location);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 bg-card rounded-4xl p-6 shadow-candy max-w-md w-full max-h-[80vh] overflow-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">לאן נטייל?</h2>
              <p className="text-sm text-muted-foreground">בחר מקום לטיול!</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Stars indicator */}
        <div className="mb-4 bg-gradient-gold/20 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-2xl">⭐</span>
          <div className="flex-1">
            <div className="text-sm font-bold">הכוכבים שלך: {totalStars}</div>
          </div>
        </div>
        
        {/* Happiness indicator */}
        <div className="mb-4 bg-muted/50 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-2xl">😊</span>
          <div className="flex-1">
            <div className="text-sm font-bold mb-1">מד שמחה: {Math.round(currentHappiness)}%</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                style={{ width: `${currentHappiness}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Locations Grid */}
        <div className="grid grid-cols-2 gap-3">
          {WALK_LOCATIONS.map((location) => {
            const canAfford = totalStars >= location.price;
            return (
              <button
                key={location.id}
                onClick={() => handleSelectLocation(location)}
                className={`bg-muted/50 rounded-3xl p-4 text-center transition-all duration-200 hover:scale-105 hover:shadow-card cursor-pointer flex flex-col items-center gap-2 ${!canAfford ? 'opacity-60' : ''}`}
              >
                {/* Location emoji - large */}
                <span className="text-7xl md:text-8xl">{location.emoji}</span>
                
                {/* Location name */}
                <h3 className="font-extrabold text-foreground text-base">{location.name}</h3>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground leading-tight">{location.description}</p>
                
                {/* Price and happiness info */}
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  <span className={`text-sm font-bold ${canAfford ? 'text-accent' : 'text-red-500'}`}>
                    ⭐ {location.price}
                  </span>
                  <span className="text-xs text-amber-600 font-bold">
                    +{location.happinessRestore}% 😊
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Info text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🌳 בחר מקום לטיול! עולה כוכבים!
        </p>
      </div>
    </div>
  );
}
