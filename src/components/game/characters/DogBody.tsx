// Dog character SVG body — procedural, golden retriever style
import { ClothingItem } from '@/lib/clothingTypes';
import { WearableHat, WearableSunglasses, WearableShirt, WearablePantsLeg, WearableShoe } from '../WearableItems';

interface DogBodyProps {
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

export function DogBody({
  headRotation, isBlink, walkBob, walkRot, tailSwing,
  walkCycle, idleAnimation,
  equippedHat, equippedSunglasses, equippedShirt,
  equippedPants, equippedShoes, eatingPhase, uniqueId,
}: DogBodyProps) {
  const legAnim = idleAnimation === 'walk';
  return (
    <>
      <defs>
        <radialGradient id={`${uniqueId}dogBody`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E8C070" />
          <stop offset="60%" stopColor="#D4A848" />
          <stop offset="100%" stopColor="#C09030" />
        </radialGradient>
        <radialGradient id={`${uniqueId}dogBelly`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFF0D0" />
          <stop offset="100%" stopColor="#FFE0B0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}dogHead`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#E8C878" />
          <stop offset="100%" stopColor="#D0A040" />
        </radialGradient>
        <radialGradient id={`${uniqueId}earDog`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#D4A040" />
          <stop offset="100%" stopColor="#B88028" />
        </radialGradient>
        <radialGradient id={`${uniqueId}eyeW`} cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}pupil`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#553322" />
          <stop offset="100%" stopColor="#221100" />
        </radialGradient>
        <radialGradient id={`${uniqueId}nose`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#222" />
        </radialGradient>
        <radialGradient id={`${uniqueId}paw`} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#F0D898" />
          <stop offset="100%" stopColor="#E8C070" />
        </radialGradient>
        <linearGradient id={`${uniqueId}hl`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ===== TAIL — wagging dog tail ===== */}
      <g id="tail" style={{ transform: `rotate(${tailSwing * 1.5}deg)`, transformOrigin: '160px 180px', transition: 'transform 0.25s' }}>
        <path d="M 155 195 Q 185 170 195 140 Q 200 125 190 120"
              fill="none" stroke={`url(#${uniqueId}dogBody)`} strokeWidth="16" strokeLinecap="round" />
        <path d="M 195 140 Q 200 125 190 120" fill="none" stroke="#FFE8C0" strokeWidth="12" strokeLinecap="round" />
      </g>

      {/* ===== TORSO — taller, standing dog ===== */}
      <g id="torso" style={{ transform: `translateY(${walkBob}px)`, transition: 'transform 0.3s' }}>
        <ellipse cx="120" cy="190" rx="52" ry="58" fill={`url(#${uniqueId}dogBody)`} />
        <ellipse cx="106" cy="172" rx="24" ry="24" fill={`url(#${uniqueId}hl)`} />
        <ellipse cx="120" cy="200" rx="35" ry="36" fill={`url(#${uniqueId}dogBelly)`} />

        {/* Chest tuft */}
        <ellipse cx="120" cy="165" rx="18" ry="12" fill="#FFE8C0" opacity="0.6" />

        {equippedShirt && <g transform="translate(120, 190)"><WearableShirt item={equippedShirt} /></g>}
      </g>

      {/* ===== LEGS ===== */}
      {/* Right back */}
      <g id="right_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="152" cy="235" rx="17" ry="30" fill={`url(#${uniqueId}dogBody)`} />
        {equippedPants && <g transform="translate(152, 233)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(152, 260)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="152" cy="260" rx="14" ry="10" fill={`url(#${uniqueId}paw)`} />
            <circle cx="146" cy="266" r="3.5" fill={`url(#${uniqueId}paw)`} />
            <circle cx="152" cy="268" r="3.5" fill={`url(#${uniqueId}paw)`} />
            <circle cx="158" cy="266" r="3.5" fill={`url(#${uniqueId}paw)`} />
          </g>
        )}
      </g>

      {/* Left front */}
      <g id="left_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? 0 : -4) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="88" cy="238" rx="16" ry="28" fill={`url(#${uniqueId}dogBody)`} />
        {equippedPants && <g transform="translate(88, 236)"><WearablePantsLeg item={equippedPants} side="left" /></g>}
        {equippedShoes ? (
          <g transform="translate(88, 262)"><WearableShoe item={equippedShoes} side="left" /></g>
        ) : (
          <g>
            <ellipse cx="88" cy="262" rx="13" ry="9" fill={`url(#${uniqueId}paw)`} />
            <circle cx="82" cy="267" r="3.5" fill={`url(#${uniqueId}paw)`} />
            <circle cx="88" cy="269" r="3.5" fill={`url(#${uniqueId}paw)`} />
            <circle cx="94" cy="267" r="3.5" fill={`url(#${uniqueId}paw)`} />
          </g>
        )}
      </g>

      {/* Second front */}
      <g style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="112" cy="240" rx="16" ry="28" fill={`url(#${uniqueId}dogBody)`} />
        {equippedPants && <g transform="translate(112, 238)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(112, 264)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="112" cy="264" rx="13" ry="9" fill={`url(#${uniqueId}paw)`} />
            <circle cx="106" cy="269" r="3.5" fill={`url(#${uniqueId}paw)`} />
            <circle cx="112" cy="271" r="3.5" fill={`url(#${uniqueId}paw)`} />
            <circle cx="118" cy="269" r="3.5" fill={`url(#${uniqueId}paw)`} />
          </g>
        )}
      </g>

      {/* ===== HEAD — rounder with floppy ears ===== */}
      <g id="head" style={{
        transform: `rotate(${headRotation.x + walkRot}deg) translateY(${walkBob + headRotation.y}px)`,
        transformOrigin: '120px 88px',
        transition: 'transform 0.1s ease-out',
      }}>
        {/* Head base */}
        <ellipse cx="120" cy="88" rx="50" ry="52" fill={`url(#${uniqueId}dogHead)`} />
        <ellipse cx="106" cy="70" rx="24" ry="22" fill={`url(#${uniqueId}hl)`} />

        {/* Floppy ears */}
        <ellipse cx="72" cy="75" rx="18" ry="35" fill={`url(#${uniqueId}earDog)`} transform="rotate(15, 72, 75)" />
        <ellipse cx="72" cy="80" rx="12" ry="25" fill={`url(#${uniqueId}dogBelly)`} opacity="0.3" transform="rotate(15, 72, 80)" />
        <ellipse cx="168" cy="75" rx="18" ry="35" fill={`url(#${uniqueId}earDog)`} transform="rotate(-15, 168, 75)" />
        <ellipse cx="168" cy="80" rx="12" ry="25" fill={`url(#${uniqueId}dogBelly)`} opacity="0.3" transform="rotate(-15, 168, 80)" />

        {/* Muzzle */}
        <ellipse cx="120" cy="108" rx="28" ry="22" fill={`url(#${uniqueId}dogBelly)`} opacity="0.8" />

        {/* ===== EYES — warm brown ===== */}
        <g id="eyes" style={{ transform: isBlink ? 'scaleY(0.08)' : 'none', transformOrigin: '120px 85px', transition: 'transform 0.15s' }}>
          <ellipse cx="100" cy="85" rx="12" ry="14" fill={`url(#${uniqueId}eyeW)`} />
          <ellipse cx="100" cy="85" rx="12" ry="14" stroke="#D0C0A0" strokeWidth="0.5" fill="none" />
          <circle cx={100 + headRotation.x * 0.3} cy={85 + headRotation.y * 0.2} r="8" fill={`url(#${uniqueId}pupil)`} />
          <circle cx={98 + headRotation.x * 0.2} cy={82 + headRotation.y * 0.1} r="3" fill="white" />

          <ellipse cx="140" cy="85" rx="12" ry="14" fill={`url(#${uniqueId}eyeW)`} />
          <ellipse cx="140" cy="85" rx="12" ry="14" stroke="#D0C0A0" strokeWidth="0.5" fill="none" />
          <circle cx={140 + headRotation.x * 0.3} cy={85 + headRotation.y * 0.2} r="8" fill={`url(#${uniqueId}pupil)`} />
          <circle cx={138 + headRotation.x * 0.2} cy={82 + headRotation.y * 0.1} r="3" fill="white" />

          {equippedSunglasses && (
            <g transform="translate(120, 86)">
              <WearableSunglasses item={equippedSunglasses} />
            </g>
          )}
        </g>

        {/* Nose — bigger oval */}
        <ellipse cx="120" cy="103" rx="10" ry="7" fill={`url(#${uniqueId}nose)`} />
        <ellipse cx="118" cy="101" rx="3.5" ry="2.5" fill="white" opacity="0.35" />

        {/* Mouth */}
        <path d="M 112 112 Q 120 118 128 112" stroke="#8B6040" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Freckles */}
        <circle cx="108" cy="108" r="1.5" fill="#C09050" opacity="0.5" />
        <circle cx="112" cy="111" r="1.5" fill="#C09050" opacity="0.5" />
        <circle cx="128" cy="108" r="1.5" fill="#C09050" opacity="0.5" />
        <circle cx="132" cy="111" r="1.5" fill="#C09050" opacity="0.5" />

        {/* Tongue (happy) */}
        <ellipse cx="120" cy="119" rx="5" ry="4" fill="#FF8888" opacity="0.7" />

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
