// Cat character SVG body — procedural, with named group IDs matching the anchor system
import { ClothingItem } from '@/lib/clothingTypes';
import { WearableHat, WearableSunglasses, WearableShirt, WearablePantsLeg, WearableShoe } from '../WearableItems';

interface CatBodyProps {
  headRotation: { x: number; y: number };
  isBlink: boolean;
  walkBob: number;
  walkRot: number;
  tailSwing: number;
  walkCycle: number;
  idleAnimation: string;
  equippedHat: ClothingItem | null;
  equippedSunglasses: ClothingItem | null;
  equippedShirt: ClothingItem | null;
  equippedPants: ClothingItem | null;
  equippedShoes: ClothingItem | null;
  eatingPhase: string;
  uniqueId: string;
}

export function CatBody({
  headRotation, isBlink, walkBob, walkRot, tailSwing,
  walkCycle, idleAnimation,
  equippedHat, equippedSunglasses, equippedShirt,
  equippedPants, equippedShoes, eatingPhase, uniqueId,
}: CatBodyProps) {
  const legAnim = idleAnimation === 'walk';
  return (
    <>
      <defs>
        <radialGradient id={`${uniqueId}catBody`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFBD6B" />
          <stop offset="60%" stopColor="#F5A040" />
          <stop offset="100%" stopColor="#E08528" />
        </radialGradient>
        <radialGradient id={`${uniqueId}catBelly`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFF0D8" />
          <stop offset="100%" stopColor="#FFD8A8" />
        </radialGradient>
        <radialGradient id={`${uniqueId}catHead`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FFC878" />
          <stop offset="100%" stopColor="#E89038" />
        </radialGradient>
        <radialGradient id={`${uniqueId}earInner`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFB8D8" />
          <stop offset="100%" stopColor="#FF8CB8" />
        </radialGradient>
        <radialGradient id={`${uniqueId}eyeW`} cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}pupil`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#444" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
        <radialGradient id={`${uniqueId}nose`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#888" />
          <stop offset="100%" stopColor="#555" />
        </radialGradient>
        <radialGradient id={`${uniqueId}paw`} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFD8A0" />
          <stop offset="100%" stopColor="#FFBD6B" />
        </radialGradient>
        <linearGradient id={`${uniqueId}hl`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ===== TAIL — curled cat tail ===== */}
      <g id="tail" style={{ transform: `rotate(${tailSwing}deg)`, transformOrigin: '160px 190px', transition: 'transform 0.3s' }}>
        <path d="M 160 200 Q 200 180 210 150 Q 220 120 200 110 Q 185 105 180 120" 
              fill="none" stroke={`url(#${uniqueId}catBody)`} strokeWidth="14" strokeLinecap="round" />
        <path d="M 200 110 Q 185 105 180 120" fill="none" stroke="#FFD8A8" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* ===== TORSO — rounder, chubbier cat ===== */}
      <g id="torso" style={{ transform: `translateY(${walkBob}px)`, transition: 'transform 0.3s' }}>
        <ellipse cx="120" cy="185" rx="55" ry="60" fill={`url(#${uniqueId}catBody)`} />
        <ellipse cx="108" cy="170" rx="26" ry="24" fill={`url(#${uniqueId}hl)`} />
        <ellipse cx="120" cy="200" rx="40" ry="38" fill={`url(#${uniqueId}catBelly)`} />
        {equippedShirt && <g transform="translate(120, 185)"><WearableShirt item={equippedShirt} /></g>}
      </g>

      {/* ===== LEGS — shorter, stubbier ===== */}
      {/* Right back leg */}
      <g id="right_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -3 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="150" cy="235" rx="16" ry="26" fill={`url(#${uniqueId}catBody)`} />
        {equippedPants && <g transform="translate(150, 233)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(150, 255)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="150" cy="255" rx="13" ry="9" fill={`url(#${uniqueId}paw)`} />
            <circle cx="144" cy="260" r="3" fill={`url(#${uniqueId}paw)`} />
            <circle cx="150" cy="262" r="3" fill={`url(#${uniqueId}paw)`} />
            <circle cx="156" cy="260" r="3" fill={`url(#${uniqueId}paw)`} />
          </g>
        )}
      </g>

      {/* Left front leg */}
      <g id="left_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? 0 : -3) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="90" cy="235" rx="15" ry="26" fill={`url(#${uniqueId}catBody)`} />
        {equippedPants && <g transform="translate(90, 233)"><WearablePantsLeg item={equippedPants} side="left" /></g>}
        {equippedShoes ? (
          <g transform="translate(90, 255)"><WearableShoe item={equippedShoes} side="left" /></g>
        ) : (
          <g>
            <ellipse cx="90" cy="255" rx="13" ry="9" fill={`url(#${uniqueId}paw)`} />
            <circle cx="84" cy="260" r="3" fill={`url(#${uniqueId}paw)`} />
            <circle cx="90" cy="262" r="3" fill={`url(#${uniqueId}paw)`} />
            <circle cx="96" cy="260" r="3" fill={`url(#${uniqueId}paw)`} />
          </g>
        )}
      </g>

      {/* Second front leg */}
      <g style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -3 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="112" cy="238" rx="15" ry="26" fill={`url(#${uniqueId}catBody)`} />
        {equippedPants && <g transform="translate(112, 236)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(112, 258)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="112" cy="258" rx="13" ry="9" fill={`url(#${uniqueId}paw)`} />
            <circle cx="106" cy="263" r="3" fill={`url(#${uniqueId}paw)`} />
            <circle cx="112" cy="265" r="3" fill={`url(#${uniqueId}paw)`} />
            <circle cx="118" cy="263" r="3" fill={`url(#${uniqueId}paw)`} />
          </g>
        )}
      </g>

      {/* ===== HEAD — rounder cat face with pointy ears ===== */}
      <g id="head" style={{
        transform: `rotate(${headRotation.x + walkRot}deg) translateY(${walkBob + headRotation.y}px)`,
        transformOrigin: '120px 90px',
        transition: 'transform 0.1s ease-out',
      }}>
        {/* Head base — rounder than fox */}
        <ellipse cx="120" cy="90" rx="52" ry="55" fill={`url(#${uniqueId}catHead)`} />
        <ellipse cx="106" cy="72" rx="24" ry="22" fill={`url(#${uniqueId}hl)`} />

        {/* Pointy triangle ears */}
        <path d="M 78 60 L 65 15 L 95 45 Z" fill={`url(#${uniqueId}catHead)`} />
        <path d="M 80 55 L 70 22 L 92 45 Z" fill={`url(#${uniqueId}earInner)`} />
        <path d="M 162 60 L 175 15 L 145 45 Z" fill={`url(#${uniqueId}catHead)`} />
        <path d="M 160 55 L 170 22 L 148 45 Z" fill={`url(#${uniqueId}earInner)`} />

        {/* Face mask — lighter area */}
        <ellipse cx="120" cy="105" rx="32" ry="26" fill={`url(#${uniqueId}catBelly)`} opacity="0.75" />

        {/* ===== EYES — bigger, rounder cat eyes ===== */}
        <g id="eyes" style={{ transform: isBlink ? 'scaleY(0.08)' : 'none', transformOrigin: '120px 88px', transition: 'transform 0.15s' }}>
          <ellipse cx="100" cy="88" rx="13" ry="15" fill={`url(#${uniqueId}eyeW)`} />
          <ellipse cx="100" cy="88" rx="13" ry="15" stroke="#E0D0C0" strokeWidth="0.5" fill="none" />
          <circle cx={100 + headRotation.x * 0.3} cy={88 + headRotation.y * 0.2} r="8" fill={`url(#${uniqueId}pupil)`} />
          <circle cx={98 + headRotation.x * 0.2} cy={85 + headRotation.y * 0.1} r="3" fill="white" />

          <ellipse cx="140" cy="88" rx="13" ry="15" fill={`url(#${uniqueId}eyeW)`} />
          <ellipse cx="140" cy="88" rx="13" ry="15" stroke="#E0D0C0" strokeWidth="0.5" fill="none" />
          <circle cx={140 + headRotation.x * 0.3} cy={88 + headRotation.y * 0.2} r="8" fill={`url(#${uniqueId}pupil)`} />
          <circle cx={138 + headRotation.x * 0.2} cy={85 + headRotation.y * 0.1} r="3" fill="white" />

          {equippedSunglasses && (
            <g transform="translate(120, 89)">
              <WearableSunglasses item={equippedSunglasses} />
            </g>
          )}
        </g>

        {/* Triangle nose */}
        <path d="M 115 108 L 120 103 L 125 108 Z" fill={`url(#${uniqueId}nose)`} />

        {/* Mouth */}
        <path d="M 114 113 Q 120 118 126 113" stroke="#8B6040" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="70" y1="100" x2="95" y2="104" stroke="#D0A070" strokeWidth="1" opacity="0.6" />
        <line x1="70" y1="108" x2="95" y2="108" stroke="#D0A070" strokeWidth="1" opacity="0.6" />
        <line x1="70" y1="116" x2="95" y2="112" stroke="#D0A070" strokeWidth="1" opacity="0.6" />
        <line x1="170" y1="100" x2="145" y2="104" stroke="#D0A070" strokeWidth="1" opacity="0.6" />
        <line x1="170" y1="108" x2="145" y2="108" stroke="#D0A070" strokeWidth="1" opacity="0.6" />
        <line x1="170" y1="116" x2="145" y2="112" stroke="#D0A070" strokeWidth="1" opacity="0.6" />

        {/* Hat */}
        {equippedHat && (
          <g transform="translate(120, 84)">
            <WearableHat item={equippedHat} />
          </g>
        )}
      </g>
    </>
  );
}
