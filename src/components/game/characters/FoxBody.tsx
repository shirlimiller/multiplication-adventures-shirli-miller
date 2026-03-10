// Fox character SVG body — extracted from FoxMascot for multi-character architecture
import { ClothingItem } from '@/lib/clothingTypes';
import { WearableHat, WearableSunglasses, WearableShirt, WearablePantsLeg, WearableShoe, WearableDress } from '../WearableItems';

interface FoxBodyProps {
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
  equippedDress: ClothingItem | null;
  eatingPhase: string;
  isJumping: boolean;
  uniqueId: string;
}

export function FoxBody({
  headRotation, isBlink, walkBob, walkRot, tailSwing,
  walkCycle, idleAnimation,
  equippedHat, equippedSunglasses, equippedShirt,
  equippedPants, equippedShoes, equippedDress, isJumping, uniqueId,
}: FoxBodyProps) {
  const legAnim = idleAnimation === 'walk';
  return (
    <>
      <defs>
        <radialGradient id={`${uniqueId}foxBodyGrad`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFB060" />
          <stop offset="60%" stopColor="#FF8C42" />
          <stop offset="100%" stopColor="#E5722E" />
        </radialGradient>
        <radialGradient id={`${uniqueId}foxBellyGrad`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE4C8" />
          <stop offset="70%" stopColor="#FFD4A8" />
          <stop offset="100%" stopColor="#FFC088" />
        </radialGradient>
        <radialGradient id={`${uniqueId}foxHeadGrad`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FFB868" />
          <stop offset="50%" stopColor="#FF9A4A" />
          <stop offset="100%" stopColor="#E57828" />
        </radialGradient>
        <radialGradient id={`${uniqueId}earInnerGrad`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFB8D8" />
          <stop offset="100%" stopColor="#FF8CB8" />
        </radialGradient>
        <radialGradient id={`${uniqueId}eyeWhiteGrad`} cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}pupilGrad`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#444" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
        <radialGradient id={`${uniqueId}noseGrad`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FF80B0" />
          <stop offset="100%" stopColor="#E04888" />
        </radialGradient>
        <linearGradient id={`${uniqueId}tailGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB060" />
          <stop offset="50%" stopColor="#FF8C42" />
          <stop offset="100%" stopColor="#E5722E" />
        </linearGradient>
        <radialGradient id={`${uniqueId}tailTipGrad`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#FFD8B0" />
        </radialGradient>
        <radialGradient id={`${uniqueId}pawGrad`} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFD0A0" />
          <stop offset="100%" stopColor="#FFB060" />
        </radialGradient>
        <linearGradient id={`${uniqueId}specHighlight`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* TAIL */}
      <g id="tail" style={{ transform: `rotate(${tailSwing}deg)`, transformOrigin: '155px 195px', transition: 'transform 0.3s' }}>
        <ellipse cx="192" cy="185" rx="32" ry="48" fill={`url(#${uniqueId}tailGrad)`} />
        <ellipse cx="192" cy="185" rx="32" ry="48" fill={`url(#${uniqueId}specHighlight)`} />
        <ellipse cx="198" cy="175" rx="18" ry="28" fill={`url(#${uniqueId}tailTipGrad)`} />
      </g>

      {/* TORSO */}
      <g id="torso" style={{ transform: `translateY(${walkBob}px)`, transition: 'transform 0.3s' }}>
        <ellipse cx="120" cy="195" rx="58" ry="55" fill={`url(#${uniqueId}foxBodyGrad)`} />
        <ellipse cx="105" cy="178" rx="30" ry="28" fill={`url(#${uniqueId}specHighlight)`} />
        <ellipse cx="120" cy="205" rx="38" ry="35" fill={`url(#${uniqueId}foxBellyGrad)`} />
        <ellipse cx="112" cy="195" rx="20" ry="18" fill="white" opacity="0.12" />
        {equippedShirt && <g transform="translate(120, 195)"><WearableShirt item={equippedShirt} /></g>}
      </g>

      {/* RIGHT LEG */}
      <g id="right_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="155" cy="230" rx="18" ry="30" fill={`url(#${uniqueId}foxBodyGrad)`} />
        {equippedPants && <g transform="translate(155, 230)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(155, 255)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="155" cy="255" rx="14" ry="10" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="148" cy="262" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="155" cy="264" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="162" cy="262" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
          </g>
        )}
      </g>

      {/* LEFT LEG */}
      <g id="left_leg" style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? 0 : -4) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="85" cy="235" rx="16" ry="28" fill={`url(#${uniqueId}foxBodyGrad)`} />
        {equippedPants && <g transform="translate(85, 233)"><WearablePantsLeg item={equippedPants} side="left" /></g>}
        {equippedShoes ? (
          <g transform="translate(85, 258)"><WearableShoe item={equippedShoes} side="left" /></g>
        ) : (
          <g>
            <ellipse cx="85" cy="258" rx="13" ry="9" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="78" cy="264" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="85" cy="266" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="92" cy="264" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
          </g>
        )}
      </g>

      {/* SECOND FRONT LEG */}
      <g style={{ transform: `translateY(${legAnim ? (walkCycle % 2 === 0 ? -4 : 0) : 0}px)`, transition: 'transform 0.2s' }}>
        <ellipse cx="110" cy="238" rx="16" ry="28" fill={`url(#${uniqueId}foxBodyGrad)`} />
        {equippedPants && <g transform="translate(110, 236)"><WearablePantsLeg item={equippedPants} side="right" /></g>}
        {equippedShoes ? (
          <g transform="translate(110, 261)"><WearableShoe item={equippedShoes} side="right" /></g>
        ) : (
          <g>
            <ellipse cx="110" cy="261" rx="13" ry="9" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="103" cy="267" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="110" cy="269" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
            <circle cx="117" cy="267" r="3.5" fill={`url(#${uniqueId}pawGrad)`} />
          </g>
        )}
      </g>

      {/* HEAD */}
      <g id="head" style={{
        transform: `rotate(${headRotation.x + walkRot}deg) translateY(${walkBob + headRotation.y}px)`,
        transformOrigin: '120px 100px',
        transition: 'transform 0.1s ease-out',
      }}>
        <ellipse cx="120" cy="100" rx="55" ry="60" fill={`url(#${uniqueId}foxHeadGrad)`} />
        <ellipse cx="105" cy="80" rx="28" ry="25" fill={`url(#${uniqueId}specHighlight)`} />

        {/* Ears */}
        <path d="M 78 70 Q 62 25 80 40 Q 72 18 92 50 Z" fill={`url(#${uniqueId}foxHeadGrad)`} />
        <path d="M 80 62 Q 70 35 82 42 Q 75 28 88 52 Z" fill={`url(#${uniqueId}earInnerGrad)`} />
        <path d="M 162 70 Q 178 25 160 40 Q 168 18 148 50 Z" fill={`url(#${uniqueId}foxHeadGrad)`} />
        <path d="M 160 62 Q 170 35 158 42 Q 165 28 152 52 Z" fill={`url(#${uniqueId}earInnerGrad)`} />

        {/* Face mask */}
        <ellipse cx="120" cy="115" rx="35" ry="28" fill={`url(#${uniqueId}foxBellyGrad)`} opacity="0.8" />

        {/* EYES */}
        <g id="eyes" style={{ transform: isBlink ? 'scaleY(0.08)' : 'none', transformOrigin: '120px 95px', transition: 'transform 0.15s' }}>
          <ellipse cx="98" cy="95" rx="14" ry="16" fill={`url(#${uniqueId}eyeWhiteGrad)`} />
          <ellipse cx="98" cy="95" rx="14" ry="16" stroke="#E0D0C0" strokeWidth="0.5" fill="none" />
          <circle cx={98 + headRotation.x * 0.3} cy={95 + headRotation.y * 0.2} r="9" fill={`url(#${uniqueId}pupilGrad)`} />
          <circle cx={96 + headRotation.x * 0.2} cy={92 + headRotation.y * 0.1} r="3.5" fill="white" />
          <circle cx={101 + headRotation.x * 0.2} cy={98 + headRotation.y * 0.1} r="1.5" fill="white" opacity="0.6" />

          <ellipse cx="142" cy="95" rx="14" ry="16" fill={`url(#${uniqueId}eyeWhiteGrad)`} />
          <ellipse cx="142" cy="95" rx="14" ry="16" stroke="#E0D0C0" strokeWidth="0.5" fill="none" />
          <circle cx={142 + headRotation.x * 0.3} cy={95 + headRotation.y * 0.2} r="9" fill={`url(#${uniqueId}pupilGrad)`} />
          <circle cx={140 + headRotation.x * 0.2} cy={92 + headRotation.y * 0.1} r="3.5" fill="white" />
          <circle cx={145 + headRotation.x * 0.2} cy={98 + headRotation.y * 0.1} r="1.5" fill="white" opacity="0.6" />

          {equippedSunglasses && (
            <g transform="translate(120, 96)">
              <WearableSunglasses item={equippedSunglasses} />
            </g>
          )}
        </g>

        {/* Nose */}
        <ellipse cx="120" cy="118" rx="8" ry="6" fill={`url(#${uniqueId}noseGrad)`} />
        <ellipse cx="118" cy="116" rx="3" ry="2" fill="white" opacity="0.5" />

        {/* Mouth */}
        <path
          d={isJumping || idleAnimation === 'walk'
            ? "M 112 126 Q 120 134 128 126"
            : "M 114 125 Q 120 130 126 125"}
          stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round"
          style={{ transition: 'all 0.3s' }}
        />

        {/* Whiskers */}
        <line x1="75" y1="108" x2="95" y2="112" stroke="#D0A070" strokeWidth="1" opacity="0.5" />
        <line x1="75" y1="118" x2="95" y2="116" stroke="#D0A070" strokeWidth="1" opacity="0.5" />
        <line x1="165" y1="108" x2="145" y2="112" stroke="#D0A070" strokeWidth="1" opacity="0.5" />
        <line x1="165" y1="118" x2="145" y2="116" stroke="#D0A070" strokeWidth="1" opacity="0.5" />

        {/* Hat */}
        {equippedHat && (
          <g transform="translate(120, 94)">
            <WearableHat item={equippedHat} />
          </g>
        )}
      </g>
    </>
  );
}
