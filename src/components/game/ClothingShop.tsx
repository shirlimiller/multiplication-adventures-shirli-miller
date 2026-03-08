import { useState } from 'react';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem, ClothingCategory, CLOTHING_CATEGORIES, getItemsByType, PlayerClothing } from '@/lib/clothingTypes';
import { ShopPreviewSVG } from './WearableItems';
import { cn } from '@/lib/utils';

interface ClothingShopProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  clothing: PlayerClothing;
  onPurchase: (item: ClothingItem) => boolean;
  onEquip: (item: ClothingItem) => void;
  onUnequip: (type: ClothingCategory) => void;
  onSpendStars: (amount: number) => void;
  ownsItem: (id: string) => boolean;
  isEquipped: (id: string) => boolean;
}

export function ClothingShop({
  isOpen,
  onClose,
  totalStars,
  onPurchase,
  onEquip,
  onUnequip,
  onSpendStars,
  ownsItem,
  isEquipped,
}: ClothingShopProps) {
  const [activeTab, setActiveTab] = useState<ClothingCategory>('shirt');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handlePurchaseOrEquip = (item: ClothingItem) => {
    if (ownsItem(item.id)) {
      if (isEquipped(item.id)) {
        onUnequip(item.type);
        setMessage(`הורדת את ה${item.name}`);
      } else {
        onEquip(item);
        setMessage(`לבשת את ה${item.name}! 🎉`);
      }
    } else {
      if (totalStars >= item.price) {
        onSpendStars(item.price);
        onPurchase(item);
        onEquip(item);
        setMessage(`קנית את ה${item.name}! ✨`);
      } else {
        setMessage(`צריך עוד ${item.price - totalStars} כוכבים! 🌟`);
      }
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const currentItems = getItemsByType(activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in" dir="rtl">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-violet-100 via-pink-50 to-amber-50 rounded-[28px] shadow-2xl overflow-hidden border-4 border-violet-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 p-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 drop-shadow-lg">
              <Sparkles className="w-6 h-6" />
              חנות הבגדים
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-white/25 hover:bg-white/50 text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 bg-white/25 rounded-full px-4 py-1.5 w-fit backdrop-blur-sm">
            <span className="text-xl">⭐</span>
            <span className="font-extrabold text-white text-lg drop-shadow">{totalStars}</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-1.5 px-2 py-3 bg-white/30 overflow-x-auto no-scrollbar">
          {CLOTHING_CATEGORIES.map((cat) => (
            <button
              key={cat.type}
              onClick={() => setActiveTab(cat.type)}
              className={cn(
                'flex flex-col items-center px-3 py-2 rounded-2xl font-bold text-[11px] transition-all whitespace-nowrap min-w-[56px]',
                activeTab === cat.type
                  ? 'bg-gradient-to-b from-violet-500 to-pink-500 text-white shadow-lg scale-110 ring-2 ring-white/50'
                  : 'bg-white/80 text-violet-700 hover:bg-white shadow-sm hover:scale-105'
              )}
            >
              <span className="text-lg leading-none mb-0.5">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Floating Message */}
        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-violet-500 to-pink-500 text-white px-6 py-3 rounded-full font-extrabold text-lg shadow-xl animate-bounce border-2 border-white/30">
            {message}
          </div>
        )}

        {/* Items Grid */}
        <div className="p-4 min-h-[260px] max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {currentItems.map((item) => {
              const owned = ownsItem(item.id);
              const equipped = isEquipped(item.id);
              const canAfford = totalStars >= item.price;

              return (
                <button
                  key={item.id}
                  onClick={() => handlePurchaseOrEquip(item)}
                  className={cn(
                    'relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all',
                    'border-[3px] shadow-md hover:shadow-lg active:scale-95',
                    equipped
                      ? 'bg-gradient-to-b from-emerald-100 to-emerald-200 border-emerald-400 ring-2 ring-emerald-400 shadow-emerald-200'
                      : owned
                        ? 'bg-gradient-to-b from-violet-50 to-violet-100 border-violet-300 hover:border-violet-500'
                        : canAfford
                          ? 'bg-white border-violet-200 hover:border-pink-400 hover:bg-pink-50/50'
                          : 'bg-gray-100 border-gray-200 opacity-50'
                  )}
                >
                  {/* SVG Preview */}
                  <div className="w-11 h-11 flex items-center justify-center mb-1">
                    <ShopPreviewSVG item={item} size={44} />
                  </div>
                  
                  {/* Name */}
                  <span className="text-[10px] font-bold text-gray-700 leading-tight text-center line-clamp-2 min-h-[24px]">
                    {item.name}
                  </span>

                  {/* Status / Price */}
                  {equipped ? (
                    <div className="mt-1 flex items-center gap-1 bg-emerald-500 text-white rounded-full px-2 py-0.5">
                      <Check className="w-3 h-3" />
                      <span className="text-[9px] font-extrabold">לבוש</span>
                    </div>
                  ) : owned ? (
                    <span className="mt-1 text-[9px] font-bold text-violet-500 bg-violet-100 rounded-full px-2 py-0.5">לחץ ללבוש</span>
                  ) : !canAfford ? (
                    <div className="mt-1 flex items-center gap-0.5 text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span className="text-[9px]">⭐{item.price}</span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-0.5 bg-amber-100 rounded-full px-2 py-0.5">
                      <span className="text-[9px] font-bold text-amber-700">⭐{item.price}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
