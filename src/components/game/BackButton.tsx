interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-14 h-14 md:w-16 md:h-16 rounded-2xl
        bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600
        shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)]
        hover:scale-110 active:scale-95 transition-all duration-200
        flex items-center justify-center
        border border-emerald-300/50
        ${className}
      `}
    >
      {/* 3D filled arrow like reference image */}
      <svg width="32" height="32" viewBox="0 0 48 48" className="md:w-[40px] md:h-[40px]">
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="40%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="arrowHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="arrowShadow">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>
        {/* Arrow shape - filled, pointing right (RTL back) */}
        <path
          d="M14 24 L30 12 L30 19 L36 19 L36 29 L30 29 L30 36 Z"
          fill="url(#arrowGrad)"
          stroke="#15803d"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#arrowShadow)"
        />
        {/* Highlight overlay for 3D shine */}
        <path
          d="M14 24 L30 12 L30 19 L36 19 L36 24 L30 24 L30 18 Z"
          fill="url(#arrowHighlight)"
          strokeLinejoin="round"
        />
        {/* Edge highlight */}
        <path
          d="M15 24 L30 13"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
