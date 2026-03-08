import { useState } from 'react';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem, CLOTHING_ITEMS, getItemsByType } from '@/lib/clothingTypes';
import { PlayerClothing } from '@/lib/clothingTypes';
import { cn } from '@/lib/utils';

interface ClothingShopProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  clothing: PlayerClothing;
  onPurchase: (item: ClothingItem) => boolean;
  onEquip: (item: ClothingItem) => void;
  onUnequip: (type: ClothingItem['type']) => void;
  onSpendStars: (amount: number) => void;
  ownsItem: (id: string) => boolean;
  isEquipped: (id: string) => boolean;
}

type TabType = 'hat' | 'glasses' | 'shirt' | 'pants' | 'shoes' | 'scarf' | 'bow';

const TABS: { type: TabType; label: string; emoji: string }[] = [
  { type: 'hat', label: 'כובעים', emoji: '🎩' },
  { type: 'glasses', label: 'משקפיים', emoji: '🕶️' },
  { type: 'shirt', label: 'חולצות', emoji: '👕' },
  { type: 'pants', label: 'מכנסיים', emoji: '👖' },
  { type: 'shoes', label: 'נעליים', emoji: '👟' },
  { type: 'scarf', label: 'צעיפים', emoji: '🧣' },
  { type: 'bow', label: 'פפיונים', emoji: '🎀' },
];

export function ClothingShop({
  isOpen,
  onClose,
  totalStars,
  clothing,
  onPurchase,
  onEquip,
  onUnequip,
  onSpendStars,
  ownsItem,
  isEquipped,
}: ClothingShopProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hat');
  const [hoveredItem, setHoveredItem] = useState<ClothingItem | null>(null);
  const [message, setMessage] = useState<string>('');

  if (!isOpen) return null;

  const handlePurchaseOrEquip = (item: ClothingItem) => {
    if (ownsItem(item.id)) {
      // Toggle equip/unequip
      if (isEquipped(item.id)) {
        onUnequip(item.type);
        setMessage(`הורדת את ה${item.name}`);
      } else {
        onEquip(item);
        setMessage(`לבשת את ה${item.name}! 🎉`);
      }
    } else {
      // Try to purchase
      if (totalStars >= item.price) {
        onSpendStars(item.price);
        onPurchase(item);
        onEquip(item);
        setMessage(`קנית את ה${item.name}! יופי! ✨`);
      } else {
        setMessage(`צריך ${item.price - totalStars} כוכבים נוספים! 🌟`);
      }
    }
    
    setTimeout(() => setMessage(''), 2000);
  };

  const currentItems = getItemsByType(activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-700">
        {/* Room Header */}
        <div className="relative bg-gradient-to-r from-pink-200 to-pink-300 p-4">
          {/* Hanging lights */}
          <div className="absolute top-0 left-1/4 w-6 h-12 flex flex-col items-center">
            <div className="w-0.5 h-4 bg-gray-600" />
            <div className="w-5 h-5 bg-yellow-300 rounded-full shadow-lg animate-pulse" />
          </div>
          <div className="absolute top-0 left-1/2 w-6 h-14 flex flex-col items-center -translate-x-1/2">
            <div className="w-0.5 h-6 bg-gray-600" />
            <div className="w-6 h-6 bg-yellow-200 rounded-full shadow-lg animate-pulse" />
          </div>
          <div className="absolute top-0 right-1/4 w-6 h-10 flex flex-col items-center">
            <div className="w-0.5 h-3 bg-gray-600" />
            <div className="w-4 h-4 bg-yellow-300 rounded-full shadow-lg animate-pulse" />
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              חנות הבגדים
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-white/50 hover:bg-white/80"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Stars display */}
          <div className="flex items-center gap-2 mt-2 bg-white/50 rounded-full px-4 py-1 w-fit">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-amber-900">{totalStars}</span>
          </div>
        </div>

        {/* Window decoration */}
        <div className="absolute top-20 left-4 w-16 h-20 bg-sky-300 rounded border-4 border-amber-800 hidden md:block">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
            <div className="bg-sky-200" />
            <div className="bg-sky-200" />
            <div className="bg-sky-200" />
            <div className="bg-sky-200" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 p-3 bg-amber-100/50">
          {TABS.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={cn(
                'px-3 py-2 rounded-xl font-bold text-sm transition-all',
                activeTab === tab.type
                  ? 'bg-candy text-white shadow-lg scale-105'
                  : 'bg-white/70 text-amber-800 hover:bg-white'
              )}
            >
              <span className="text-lg mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-bounce">
            {message}
          </div>
        )}

        {/* Clothing Rack / Display */}
        <div className="p-4 min-h-[300px]">
          {/* Clothes rack bar */}
          <div className="relative mb-4">
            <div className="absolute left-0 right-0 top-6 h-2 bg-amber-700 rounded-full shadow" />
            <div className="absolute left-4 top-0 w-2 h-8 bg-amber-800 rounded" />
            <div className="absolute right-4 top-0 w-2 h-8 bg-amber-800 rounded" />
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-12">
            {currentItems.map((item) => {
              const owned = ownsItem(item.id);
              const equipped = isEquipped(item.id);
              const canAfford = totalStars >= item.price;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button
                    onClick={() => handlePurchaseOrEquip(item)}
                    className={cn(
                      'w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all',
                      'border-3 shadow-md hover:shadow-lg',
                      equipped
                        ? 'bg-success/20 border-success ring-2 ring-success'
                        : owned
                          ? 'bg-primary/10 border-primary/50 hover:border-primary'
                          : canAfford
                            ? 'bg-white/80 border-amber-300 hover:border-candy hover:bg-candy/10'
                            : 'bg-muted/50 border-muted opacity-60'
                    )}
                  >
                    {/* Item emoji */}
                    <span className={cn(
                      'text-4xl transition-transform',
                      equipped && 'animate-bounce'
                    )}>
                      {item.emoji}
                    </span>
                    
                    {/* Status indicator */}
                    {equipped ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : owned ? (
                      <span className="text-xs text-primary font-bold">יש לי!</span>
                    ) : !canAfford ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : null}
                  </button>

                  {/* Price tooltip on hover */}
                  {hoveredItem?.id === item.id && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg shadow-lg text-sm whitespace-nowrap z-10 animate-in fade-in slide-in-from-bottom-2">
                      <p className="font-bold">{item.name}</p>
                      {!owned && (
                        <p className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{item.price}</span>
                          {!canAfford && (
                            <span className="text-destructive text-xs">(חסר {item.price - totalStars})</span>
                          )}
                        </p>
                      )}
                      {owned && !equipped && <p className="text-success">לחץ ללבוש!</p>}
                      {equipped && <p className="text-success">לחץ להוריד</p>}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shelves decoration */}
        <div className="absolute bottom-20 right-4 hidden md:flex flex-col gap-2">
          <div className="w-16 h-3 bg-amber-700 rounded shadow" />
          <div className="w-16 h-3 bg-amber-700 rounded shadow" />
        </div>
      </div>
    </div>
  );
}
