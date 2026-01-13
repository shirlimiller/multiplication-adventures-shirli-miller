import { Button } from '@/components/ui/button';
import { FoxMascot } from './FoxMascot';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gradient leading-tight">
          הרפתקת לוח הכפל
        </h1>
        
        <FoxMascot 
          message="שלום! אני שועלי 🦊 בוא נצא יחד להרפתקה מדהימה בעולם הכפל!"
        />
        
        <div className="space-y-4">
          <p className="text-xl text-muted-foreground">
            יחד נכבוש עולמות, נאסוף כוכבים ונלמד את לוח הכפל!
          </p>
          
          <div className="flex justify-center gap-4 text-4xl">
            <span className="animate-float" style={{ animationDelay: '0s' }}>⭐</span>
            <span className="animate-float" style={{ animationDelay: '0.2s' }}>🏆</span>
            <span className="animate-float" style={{ animationDelay: '0.4s' }}>🎯</span>
            <span className="animate-float" style={{ animationDelay: '0.6s' }}>🌟</span>
          </div>
        </div>
        
        <Button 
          variant="game" 
          size="game"
          onClick={onStart}
          className="mt-8"
        >
          בוא נתחיל! 🚀
        </Button>
      </div>
    </div>
  );
}
