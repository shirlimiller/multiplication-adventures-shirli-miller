// Cat character SVG body — gray kitten, cute and distinct from fox
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
  isJumping: boolean;
  uniqueId: string;
}

export function CatBody({
  headRotation, isBlink, walkBob, walkRot, tailSwing,
  walkCycle, idleAnimation,
  equippedHat, equippedSunglasses, equippedShirt,
  equippedPants, equippedShoes, uniqueId,
}: CatBodyProps) {
  const legAnim = idleAnimation === 'walk';
  return (
    <>
      <defs>
        {/* Gray fur palette */}
        <radialGradient id={`${uniqueId}catBody`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#B8B8C8" />
          <stop offset="60%" stopColor="#9898A8" />
          <stop offset="100%" stopColor="#787890" />
        </radialGradient>
        <radialGradient id={`${uniqueId}catBelly`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#F0EEF5" />
          <stop offset="100%" stopColor="#D8D6E0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}catHead`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#C0BED0" />
          <stop offset="100%" stopColor="#908EA0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}earInner`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#F5C0D0" />
          <stop offset="100%" stopColor="#E898B0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}eyeW`} cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F5" />
        </radialGradient>
        <radialGradient id={`${uniqueId}pupil`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#40A060" />
          <stop offset="100%" stopColor="#1A5030" />
        </radialGradient>
        <radialGradient id={`${uniqueId}nose`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#F5A0B0" />
          <stop offset="100%" stopColor="#E07888" />
        </radialGradient>
        <radialGradient id={`${uniqueId}paw`} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#E0DEE8" />
          <stop offset="100%" stopColor="#C0BEC8" />
        </radialGradient>
        <linearGradient id={`${uniqueId}hl`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* Tabby stripe pattern */}
        <radialGradient id={`${uniqueId}stripe`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#686878" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#686878" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== TAIL — long curled gray tail ===== */}
      <g id="tail" style={{ transform: `rotate(${tailSwing}deg)`, transformOrigin: '160px 190px', transition: 'transform 0.3s' }}>
        <path d="M 160 200 Q 200 175 215 145 Q 225 115 205 105 Q 190 100 182 118"
              fill="none" stroke={`url(#${uniqueId}catBody)`} strokeWidth="12" strokeLinecap="round" />
        <path d="M 205 105 Q 190 100 182 118" fill="none" stroke={`url(#${uniqueId}catBelly)`} strokeWidth="8" strokeLinecap="round" />
      </g>

      {/* ===== TORSO — round kitten body ===== */}
      <g id="torso" style={{ transform: `translateY(${walkBob}px)`, transition: 'transform 0.3s' }}>
        <ellipse cx="120" cy="188" rx="52" ry="56" fill={`url(#${uniqueId}catBody)`} />
        <ellipse cx="108" cy="172" rx="24" ry="22" fill={`url(#${uniqueId}hl)`} />
        <ellipse cx="120" cy="200" rx="38" ry="36" fill={`url(#${uniqueId}catBelly)`} />
        {/* Tabby stripes on body */}
        <path d="M 95 168 Q 120 162 145 168" fill="none" stroke="#70708A" strokeWidth="2.5" opacity="0.25" strokeLinecap="round" />
        <path d="M 90 178 Q 120 172 150 178" fill="none" stroke="#70708A" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        <path d="M 92 188 Q 120 183 148 188" fill="none" stroke="#70708A" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        {equippedShirt && <g transform="translate(120, 188)"><WearableShirt item={equippedShirt} /></g>}
      </g>

      {/* ===== LEGS — short, stubby kitten legs ===== */}
      {/* Right back leg */}
      <g id="right_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -3 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="148" cy="232" rx="15" ry="24" fill={`url(#${uniqueId}catBody)`} />
        {equippedPants && <g transform="translate(148, 230)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(148, 252)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="148" cy="252" rx="12" ry="8" fill={`url(#${uniqueId}paw)`} />
            {/* Toe beans */}
            <circle cx="143" cy="256" r="2.5" fill="#E8B8C0" opacity="0.6" />
            <circle cx="148" cy="258" r="2.5" fill="#E8B8C0" opacity="0.6" />
            <circle cx="153" cy="256" r="2.5" fill="#E8B8C0" opacity="0.6" />
          </g>
        )}
      </g>

      {/* Left front leg */}
      <g id="left_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? 0 : -3) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="92" cy="234" rx="14" ry="24" fill={`url(#${uniqueId}catBody)`} />
        {equippedPants && <g transform="translate(92, 232)"><WearablePantsLeg item={equippedPants} side="left" /></g>}
        {equippedShoes ? (
          <g transform="translate(92, 254)"><WearableShoe item={equippedShoes} side="left" /></g>
        ) : (
          <g>
            <ellipse cx="92" cy="254" rx="12" ry="8" fill={`url(#${uniqueId}paw)`} />
            <circle cx="87" cy="258" r="2.5" fill="#E8B8C0" opacity="0.6" />
            <circle cx="92" cy="260" r="2.5" fill="#E8B8C0" opacity="0.6" />
            <circle cx="97" cy="258" r="2.5" fill="#E8B8C0" opacity="0.6" />
          </g>
        )}
      </g>

      {/* Second front leg */}
      <g style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -3 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="114" cy="236" rx="14" ry="24" fill={`url(#${uniqueId}catBody)`} />
        {equippedPants && <g transform="translate(114, 234)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(114, 256)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="114" cy="256" rx="12" ry="8" fill={`url(#${uniqueId}paw)`} />
            <circle cx="109" cy="260" r="2.5" fill="#E8B8C0" opacity="0.6" />
            <circle cx="114" cy="262" r="2.5" fill="#E8B8C0" opacity="0.6" />
            <circle cx="119" cy="260" r="2.5" fill="#E8B8C0" opacity="0.6" />
          </g>
        )}
      </g>

      {/* ===== HEAD — big round kitten face with huge eyes ===== */}
      <g id="head" style={{
        transform: `rotate(${headRotation.x + walkRot}deg) translateY(${walkBob + headRotation.y}px)`,
        transformOrigin: '120px 88px',
        transition: 'transform 0.1s ease-out',
      }}>
        {/* Head base — very round */}
        <ellipse cx="120" cy="88" rx="54" ry="56" fill={`url(#${uniqueId}catHead)`} />
        <ellipse cx="106" cy="70" rx="24" ry="22" fill={`url(#${uniqueId}hl)`} />

        {/* Tabby forehead "M" marking */}
        <path d="M 100 65 L 108 58 L 120 68 L 132 58 L 140 65" fill="none" stroke="#70708A" strokeWidth="2" opacity="0.35" strokeLinecap="round" />

        {/* Pointy triangle ears — tall & perky */}
        <path d="M 76 58 L 58 8 L 98 42 Z" fill={`url(#${uniqueId}catHead)`} />
        <path d="M 80 52 L 65 16 L 94 42 Z" fill={`url(#${uniqueId}earInner)`} />
        <path d="M 164 58 L 182 8 L 142 42 Z" fill={`url(#${uniqueId}catHead)`} />
        <path d="M 160 52 L 175 16 L 146 42 Z" fill={`url(#${uniqueId}earInner)`} />

        {/* Ear tufts */}
        <line x1="68" y1="20" x2="74" y2="32" stroke="#A0A0B0" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
        <line x1="172" y1="20" x2="166" y2="32" stroke="#A0A0B0" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />

        {/* Face lighter area */}
        <ellipse cx="120" cy="102" rx="30" ry="24" fill={`url(#${uniqueId}catBelly)`} opacity="0.75" />

        {/* ===== EYES — huge, green kitten eyes ===== */}
        <g id="eyes" style={{ transform: isBlink ? 'scaleY(0.08)' : 'none', transformOrigin: '120px 86px', transition: 'transform 0.15s' }}>
          {/* Left eye — big & round */}
          <ellipse cx="98" cy="86" rx="15" ry="17" fill={`url(#${uniqueId}eyeW)`} />
          <ellipse cx="98" cy="86" rx="15" ry="17" stroke="#B0A8C0" strokeWidth="0.8" fill="none" />
          {/* Green iris */}
          <circle cx={98 + headRotation.x * 0.3} cy={86 + headRotation.y * 0.2} r="10" fill={`url(#${uniqueId}pupil)`} />
          {/* Slit pupil */}
          <ellipse cx={98 + headRotation.x * 0.3} cy={86 + headRotation.y * 0.2} rx="3" ry="8" fill="#0A2018" />
          <circle cx={95 + headRotation.x * 0.2} cy={82 + headRotation.y * 0.1} r="3.5" fill="white" />
          <circle cx={100 + headRotation.x * 0.2} cy={89 + headRotation.y * 0.1} r="1.5" fill="white" opacity="0.5" />

          {/* Right eye */}
          <ellipse cx="142" cy="86" rx="15" ry="17" fill={`url(#${uniqueId}eyeW)`} />
          <ellipse cx="142" cy="86" rx="15" ry="17" stroke="#B0A8C0" strokeWidth="0.8" fill="none" />
          <circle cx={142 + headRotation.x * 0.3} cy={86 + headRotation.y * 0.2} r="10" fill={`url(#${uniqueId}pupil)`} />
          <ellipse cx={142 + headRotation.x * 0.3} cy={86 + headRotation.y * 0.2} rx="3" ry="8" fill="#0A2018" />
          <circle cx={139 + headRotation.x * 0.2} cy={82 + headRotation.y * 0.1} r="3.5" fill="white" />
          <circle cx={144 + headRotation.x * 0.2} cy={89 + headRotation.y * 0.1} r="1.5" fill="white" opacity="0.5" />

          {equippedSunglasses && (
            <g transform="translate(120, 87)">
              <WearableSunglasses item={equippedSunglasses} />
            </g>
          )}
        </g>

        {/* Tiny pink triangle nose */}
        <path d="M 116 106 L 120 101 L 124 106 Z" fill={`url(#${uniqueId}nose)`} />
        <ellipse cx="119" cy="103" rx="2" ry="1.2" fill="white" opacity="0.4" />

        {/* Mouth — "w" shaped cat mouth */}
        <path d="M 112 110 Q 116 114 120 110 Q 124 114 128 110" stroke="#808098" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Whiskers — long & expressive */}
        <line x1="62" y1="96" x2="92" y2="100" stroke="#C0C0D0" strokeWidth="1" opacity="0.5" />
        <line x1="60" y1="104" x2="92" y2="106" stroke="#C0C0D0" strokeWidth="1" opacity="0.5" />
        <line x1="62" y1="112" x2="92" y2="110" stroke="#C0C0D0" strokeWidth="1" opacity="0.5" />
        <line x1="178" y1="96" x2="148" y2="100" stroke="#C0C0D0" strokeWidth="1" opacity="0.5" />
        <line x1="180" y1="104" x2="148" y2="106" stroke="#C0C0D0" strokeWidth="1" opacity="0.5" />
        <line x1="178" y1="112" x2="148" y2="110" stroke="#C0C0D0" strokeWidth="1" opacity="0.5" />

        {/* Cheek blush */}
        <ellipse cx="82" cy="100" rx="8" ry="5" fill="#F0A0B0" opacity="0.2" />
        <ellipse cx="158" cy="100" rx="8" ry="5" fill="#F0A0B0" opacity="0.2" />

        {/* Hat */}
        {equippedHat && (
          <g transform="translate(120, 82)">
            <WearableHat item={equippedHat} />
          </g>
        )}
      </g>
    </>
  );
}
