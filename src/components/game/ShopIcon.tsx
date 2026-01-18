import { cn } from '@/lib/utils';

interface ShopIconProps {
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function ShopIcon({ onClick, className, size = 'medium' }: ShopIconProps) {
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
      {/* Shop building */}
      <div className="absolute inset-0 flex flex-col">
        {/* Awning/Roof */}
        <div className="h-1/3 relative overflow-hidden">
          {/* Stripes */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-destructive" />
            <div className="flex-1 bg-card" />
            <div className="flex-1 bg-destructive" />
            <div className="flex-1 bg-card" />
            <div className="flex-1 bg-destructive" />
          </div>
          {/* Scalloped edge */}
          <div className="absolute -bottom-1 left-0 right-0 flex justify-around">
            <div className="w-3 h-3 bg-destructive rounded-full transform translate-y-1/2" />
            <div className="w-3 h-3 bg-card rounded-full transform translate-y-1/2 border border-muted" />
            <div className="w-3 h-3 bg-destructive rounded-full transform translate-y-1/2" />
            <div className="w-3 h-3 bg-card rounded-full transform translate-y-1/2 border border-muted" />
            <div className="w-3 h-3 bg-destructive rounded-full transform translate-y-1/2" />
          </div>
        </div>
        
        {/* Store body */}
        <div className="flex-1 bg-primary/80 rounded-b-lg flex items-stretch overflow-hidden shadow-lg">
          {/* Window */}
          <div className="flex-1 m-1 bg-sky-200/80 border-2 border-primary-foreground/30 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">🍬</span>
          </div>
          {/* Door */}
          <div className="w-2/5 m-1 bg-amber-800/80 border-2 border-amber-900/50 rounded-t flex items-center justify-center">
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute -inset-2 bg-accent/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      {/* Bounce animation hint */}
      <div className="absolute -top-1 -right-1 text-lg animate-bounce">
        🍭
      </div>
    </button>
  );
}
