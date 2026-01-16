import { useEffect, useState } from 'react';
import { Star, Zap } from 'lucide-react';

interface StarReward {
  type: 'accuracy' | 'speed' | 'streak';
  label: string;
}

interface FlyingStarsProps {
  rewards: StarReward[];
  onAnimationComplete: () => void;
  targetPosition?: { x: number; y: number };
}

interface AnimatingStar {
  id: number;
  type: 'accuracy' | 'speed' | 'streak';
  label: string;
  startX: number;
  startY: number;
  phase: 'pop' | 'fly' | 'done';
}

export function FlyingStars({ rewards, onAnimationComplete, targetPosition }: FlyingStarsProps) {
  const [stars, setStars] = useState<AnimatingStar[]>([]);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (rewards.length === 0) return;

    // Create stars with staggered positions
    const newStars = rewards.map((reward, index) => ({
      id: Date.now() + index,
      type: reward.type,
      label: reward.label,
      startX: window.innerWidth / 2 + (index - (rewards.length - 1) / 2) * 80,
      startY: window.innerHeight / 2 - 50,
      phase: 'pop' as const,
    }));

    setStars(newStars);
    setShowLabels(true);

    // Phase 1: Pop animation (show labels)
    const popTimer = setTimeout(() => {
      setStars(prev => prev.map(s => ({ ...s, phase: 'fly' as const })));
      setShowLabels(false);
    }, 1200);

    // Phase 2: Fly to target
    const flyTimer = setTimeout(() => {
      setStars(prev => prev.map(s => ({ ...s, phase: 'done' as const })));
    }, 2000);

    // Phase 3: Complete
    const completeTimer = setTimeout(() => {
      setStars([]);
      onAnimationComplete();
    }, 2200);

    return () => {
      clearTimeout(popTimer);
      clearTimeout(flyTimer);
      clearTimeout(completeTimer);
    };
  }, [rewards, onAnimationComplete]);

  if (stars.length === 0) return null;

  const target = targetPosition || { x: 60, y: 40 };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {stars.map((star, index) => {
        const isPopping = star.phase === 'pop';
        const isFlying = star.phase === 'fly';
        const isDone = star.phase === 'done';

        const style: React.CSSProperties = isPopping
          ? {
              left: star.startX,
              top: star.startY,
              transform: 'translate(-50%, -50%) scale(1)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }
          : isFlying
          ? {
              left: target.x,
              top: target.y,
              transform: 'translate(-50%, -50%) scale(0.5)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }
          : {
              left: target.x,
              top: target.y,
              transform: 'translate(-50%, -50%) scale(0)',
              opacity: 0,
              transition: 'all 0.2s ease-out',
            };

        return (
          <div
            key={star.id}
            className="absolute flex flex-col items-center"
            style={{
              ...style,
              transitionDelay: isFlying ? `${index * 100}ms` : '0ms',
            }}
          >
            {/* Star icon with glow */}
            <div className={`relative ${isPopping ? 'animate-bounce' : ''}`}>
              <div className="absolute inset-0 blur-lg bg-accent/50 rounded-full scale-150" />
              <Star 
                className={`w-12 h-12 relative z-10 ${
                  star.type === 'speed' 
                    ? 'text-blue-400 fill-blue-400' 
                    : star.type === 'streak' 
                    ? 'text-purple-400 fill-purple-400' 
                    : 'text-accent fill-accent'
                }`} 
              />
              {star.type === 'speed' && (
                <Zap className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 fill-yellow-300" />
              )}
              {star.type === 'streak' && (
                <span className="absolute -top-1 -right-2 text-lg">🔥</span>
              )}
            </div>

            {/* Label */}
            {showLabels && isPopping && (
              <div 
                className={`mt-2 px-3 py-1 rounded-full text-sm font-bold text-white whitespace-nowrap
                  ${star.type === 'speed' ? 'bg-blue-500' : star.type === 'streak' ? 'bg-purple-500' : 'bg-accent'}
                  animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {star.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
