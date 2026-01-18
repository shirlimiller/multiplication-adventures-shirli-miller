import { cn } from '@/lib/utils';
import { Shirt } from 'lucide-react';

interface ClothingShopIconProps {
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function ClothingShopIcon({ onClick, className, size = 'medium' }: ClothingShopIconProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group transition-all hover:scale-110 active:scale-95',
        sizeClasses[size],
        className
      )}
    >
      {/* Wardrobe */}
      <div className="absolute inset-0 flex flex-col bg-amber-700 rounded-lg shadow-lg overflow-hidden border-2 border-amber-900">
        {/* Top trim */}
        <div className="h-2 bg-amber-800" />
        
        {/* Doors */}
        <div className="flex-1 flex gap-0.5 p-1">
          <div className="flex-1 bg-amber-600 rounded-sm flex items-center justify-center border border-amber-800">
            <div className="w-1 h-3 bg-yellow-400 rounded-full" />
          </div>
          <div className="flex-1 bg-amber-600 rounded-sm flex items-center justify-center border border-amber-800">
            <div className="w-1 h-3 bg-yellow-400 rounded-full" />
          </div>
        </div>
        
        {/* Bottom trim */}
        <div className="h-2 bg-amber-800 flex justify-around items-center">
          <div className="w-2 h-1 bg-amber-900 rounded" />
          <div className="w-2 h-1 bg-amber-900 rounded" />
        </div>
      </div>
      
      {/* Clothes icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Shirt className="w-6 h-6 text-candy drop-shadow-lg" />
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute -inset-2 bg-candy/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      {/* Sparkle */}
      <div className="absolute -top-1 -right-1 text-lg animate-pulse">
        ✨
      </div>
    </button>
  );
}
