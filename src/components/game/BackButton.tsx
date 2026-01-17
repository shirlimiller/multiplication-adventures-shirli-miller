import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
        w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm shadow-soft
        hover:bg-card hover:scale-110 transition-all duration-200
        ${className}
      `}
    >
      <ArrowRight className="w-6 h-6 text-foreground" />
    </Button>
  );
}
