import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SHOP_ITEMS, ShopItem, getYumMessage, getNotEnoughStarsMessage } from '@/lib/petTypes';
import { Star, X, Sparkles, ShoppingBag } from 'lucide-react';

interface CandyShopProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  onPurchase: (item: ShopItem) => boolean; // Returns true if purchase successful
  onShowMessage: (message: string) => void;
}

export function CandyShop({ 
  isOpen, 
  onClose, 
  totalStars, 
  onPurchase,
  onShowMessage 
}: CandyShopProps) {
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);
  const [flyingItem, setFlyingItem] = useState<ShopItem | null>(null);

  const handlePurchase = (item: ShopItem) => {
    if (totalStars < item.price) {
      onShowMessage(getNotEnoughStarsMessage());
      return;
    }

    setPurchasingItem(item.id);
    
    // Animate item flying to fox with extended eating animation
    setFlyingItem(item);
    
    setTimeout(() => {
      const success = onPurchase(item);
      if (success) {
        onShowMessage(getYumMessage());
      }
      setPurchasingItem(null);
      // Keep food visible longer for eating animation
      setTimeout(() => setFlyingItem(null), 1500);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Flying item animation */}
      {flyingItem && (
        <div className="fixed z-[60] animate-coin-splash" style={{ top: '50%', left: '50%' }}>
          <span className="text-6xl">{flyingItem.emoji}</span>
        </div>
      )}
      
      {/* Shop Modal */}
      <div className="relative z-50 bg-card rounded-4xl p-6 shadow-candy max-w-md w-full max-h-[80vh] overflow-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-candy flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">חנות הממתקים</h2>
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-accent" />
                <span className="font-bold">{totalStars} כוכבים</span>
              </div>
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
        
        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SHOP_ITEMS.map((item) => {
            const canAfford = totalStars >= item.price;
            const isPurchasing = purchasingItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handlePurchase(item)}
                disabled={isPurchasing}
                className={`
                  relative bg-muted/50 rounded-3xl p-4 text-center transition-all duration-200
                  ${canAfford ? 'hover:scale-105 hover:shadow-card cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                  ${isPurchasing ? 'scale-95 opacity-50' : ''}
                `}
              >
                {/* Special effect badge */}
                {item.effect === 'double_stars' && (
                  <div className="absolute -top-2 -right-2 bg-gradient-candy rounded-full px-2 py-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-bold">x2</span>
                  </div>
                )}
                
                {/* Item emoji */}
                <span className="text-5xl block mb-2">{item.emoji}</span>
                
                {/* Item name */}
                <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                
                {/* Price */}
                <div className={`
                  flex items-center justify-center gap-1 rounded-full px-3 py-1
                  ${canAfford ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}
                `}>
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{item.price}</span>
                </div>
                
                {/* Hunger restore indicator */}
                <div className="mt-2 text-xs text-success">
                  +{item.hungerRestore}% שובע
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Info text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🍭 קנה אוכל כדי להאכיל את שועלי!
        </p>
      </div>
    </div>
  );
}
