import foxMascot from '@/assets/fox-mascot.png';

interface FoxMascotProps {
  message?: string;
  className?: string;
  showSpeechBubble?: boolean;
  animate?: boolean;
}

export function FoxMascot({ message, className = '', showSpeechBubble = true, animate = true }: FoxMascotProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showSpeechBubble && message && (
        <div className="relative bg-card rounded-3xl p-6 shadow-card max-w-md animate-pop">
          <p className="text-xl font-medium text-foreground leading-relaxed">{message}</p>
          <div className="absolute -bottom-3 right-10 w-6 h-6 bg-card rotate-45 shadow-card"></div>
        </div>
      )}
      <img
        src={foxMascot}
        alt="שועלי הקסם"
        className={`w-40 h-40 object-contain ${animate ? 'animate-bounce-soft' : ''}`}
      />
    </div>
  );
}
