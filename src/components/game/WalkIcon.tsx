import { cn } from '@/lib/utils';

interface WalkIconProps {
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  needsWalk?: boolean;
}

export function WalkIcon({ onClick, className, size = 'medium', needsWalk = false }: WalkIconProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative transition-all duration-300 hover:scale-110 active:scale-95 group',
        sizeClasses[size],
        needsWalk && 'animate-pulse',
        className
      )}
      aria-label="לטייל"
    >
      {/* Background circle with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg group-hover:shadow-xl transition-shadow" />
      
      {/* Path/trail decoration */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-300/30 to-green-500/30 overflow-hidden">
        {/* Walking path dots */}
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="absolute bottom-3 left-4 w-1 h-1 rounded-full bg-white/30" />
        <div className="absolute bottom-4 left-6 w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>
      
      {/* Main emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          'drop-shadow-sm',
          size === 'large' ? 'text-3xl' : size === 'medium' ? 'text-2xl' : 'text-xl'
        )}>
          🏃
        </span>
      </div>
      
      {/* Trees decoration */}
      <div className="absolute -top-1 -right-1 text-lg">🌲</div>
      
      {/* Alert indicator when needs walk */}
      {needsWalk && (
        <div className="absolute -top-2 -left-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center animate-bounce shadow-md">
          <span className="text-xs">!</span>
        </div>
      )}
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors" />
    </button>
  );
}
