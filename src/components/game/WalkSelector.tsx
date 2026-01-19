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
    happinessRestore: 25,
    duration: 3000,
  },
  {
    id: 'beach',
    name: 'חוף הים',
    emoji: '🏖️',
    description: 'חול, גלים ושמש!',
    happinessRestore: 35,
    duration: 4000,
  },
  {
    id: 'forest',
    name: 'יער',
    emoji: '🌲',
    description: 'עצים גבוהים וציפורים!',
    happinessRestore: 30,
    duration: 3500,
  },
  {
    id: 'playground',
    name: 'גן שעשועים',
    emoji: '🎢',
    description: 'מגלשות ונדנדות!',
    happinessRestore: 40,
    duration: 4500,
  },
  {
    id: 'mountain',
    name: 'הר',
    emoji: '⛰️',
    description: 'טיפוס ונוף מדהים!',
    happinessRestore: 45,
    duration: 5000,
  },
];

interface WalkSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWalk: (location: WalkLocation) => void;
  currentHappiness: number;
}

export function WalkSelector({ isOpen, onClose, onSelectWalk, currentHappiness }: WalkSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<WalkLocation | null>(null);

  if (!isOpen) return null;

  const handleSelectLocation = (location: WalkLocation) => {
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
        <div className="grid gap-3">
          {WALK_LOCATIONS.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelectLocation(location)}
              className="bg-muted/50 rounded-3xl p-4 text-right transition-all duration-200 hover:scale-[1.02] hover:shadow-card cursor-pointer flex items-center gap-4"
            >
              {/* Location emoji */}
              <span className="text-5xl">{location.emoji}</span>
              
              <div className="flex-1">
                {/* Location name */}
                <h3 className="font-bold text-foreground text-lg">{location.name}</h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground">{location.description}</p>
                
                {/* Happiness restore indicator */}
                <div className="mt-1 text-sm text-amber-600 font-bold">
                  +{location.happinessRestore}% שמחה 😊
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Info text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🌳 הטיולים בחינם! פשוט בחר לאן ללכת!
        </p>
      </div>
    </div>
  );
}
