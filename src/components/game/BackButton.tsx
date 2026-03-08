import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`
        w-16 h-16 md:w-20 md:h-20 rounded-full 
        bg-gradient-to-br from-card to-muted
        shadow-card hover:shadow-gold
        hover:scale-110 active:scale-95 transition-all duration-200
        border-2 border-border
        ${className}
      `}
    >
      {/* 3D Arrow SVG */}
      <svg width="36" height="36" viewBox="0 0 48 48" className="md:w-[44px] md:h-[44px] drop-shadow-md">
        {/* Shadow layer */}
        <path
          d="M18 8 L34 24 L18 40"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          transform="translate(1, 2)"
        />
        {/* Main arrow body */}
        <path
          d="M18 8 L34 24 L18 40"
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Highlight layer for 3D effect */}
        <path
          d="M18 8 L34 24 L18 40"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
          transform="translate(-1, -1)"
        />
      </svg>
    </Button>
  );
}
