// Wearable SVG components that snap to character group coordinates
// Each returns an SVG <g> element positioned relative to its parent group

import { ClothingItem } from '@/lib/clothingTypes';

// ===== HATS — rendered inside #head group =====
export function WearableHat({ item }: { item: ClothingItem }) {
  switch (item.id) {
    case 'hat_crown':
      return (
        <g id="wearable_hat" transform="translate(0, -52)">
          <path d="M -28 10 L -22 -15 L -10 0 L 0 -22 L 10 0 L 22 -15 L 28 10 Z" fill={item.color} stroke={item.color2} strokeWidth="1.5" />
          <rect x="-28" y="10" width="56" height="8" rx="2" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <ellipse cx="-15" cy="4" rx="12" ry="8" fill="white" opacity="0.15" />
          <circle cx="-12" cy="14" r="3" fill="#FF2020" /><circle cx="0" cy="14" r="3" fill="#2060FF" /><circle cx="12" cy="14" r="3" fill="#20CC20" />
        </g>
      );
    case 'hat_wizard':
      return (
        <g id="wearable_hat" transform="translate(0, -48)">
          <path d="M 0 -55 Q 15 -20 32 10 L -32 10 Q -15 -20 0 -55 Z" fill={item.color} stroke={item.color2} strokeWidth="1.5" />
          <path d="M 0 -55 Q 5 -25 8 10 L -8 10 Q -5 -25 0 -55 Z" fill="white" opacity="0.1" />
          <ellipse cx="0" cy="10" rx="36" ry="6" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <circle cx="-5" cy="-18" r="3" fill="#FFD700" /><circle cx="4" cy="-34" r="2.5" fill="#FFD700" />
        </g>
      );
    case 'hat_party':
      return (
        <g id="wearable_hat" transform="translate(0, -48)">
          <path d="M 0 -50 L 25 12 L -25 12 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M 0 -50 L 6 12 L -6 12 Z" fill="white" opacity="0.12" />
          <line x1="-8" y1="-10" x2="8" y2="-10" stroke="#FFD700" strokeWidth="2.5" opacity="0.7" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#40E0D0" strokeWidth="2.5" opacity="0.7" />
          <circle cx="0" cy="-52" r="6" fill="#FFD700" />
          <circle cx="-1" cy="-54" r="2" fill="white" opacity="0.5" />
          <ellipse cx="0" cy="12" rx="28" ry="5" fill={item.color} opacity="0.6" />
        </g>
      );
    case 'hat_cap':
      return (
        <g id="wearable_hat" transform="translate(0, -42)">
          <ellipse cx="0" cy="5" rx="36" ry="10" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M -32 5 Q -32 -16 0 -20 Q 32 -16 32 5 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M -28 5 Q -28 -12 0 -16 Q 10 -12 10 5 Z" fill="white" opacity="0.12" />
          <ellipse cx="20" cy="8" rx="22" ry="6" fill={item.color2} />
        </g>
      );
    case 'hat_cowboy':
      return (
        <g id="wearable_hat" transform="translate(0, -42)">
          <ellipse cx="0" cy="8" rx="44" ry="8" fill={item.color} stroke={item.color2} strokeWidth="1.5" />
          <path d="M -24 8 Q -24 -18 0 -22 Q 24 -18 24 8 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M -18 8 Q -18 -12 0 -16 Q 8 -12 8 8 Z" fill="white" opacity="0.08" />
        </g>
      );
    case 'hat_beanie':
      return (
        <g id="wearable_hat" transform="translate(0, -44)">
          <path d="M -32 8 Q -34 -20 0 -26 Q 34 -20 32 8 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M -28 8 Q -28 -4 0 -6 Q 28 -4 28 8 Z" fill={item.color2} opacity="0.4" />
          <circle cx="0" cy="-28" r="5" fill={item.color} stroke={item.color2} strokeWidth="0.5" />
        </g>
      );
    default:
      return null;
  }
}

// ===== SUNGLASSES — rendered inside #eyes group =====
export function WearableSunglasses({ item }: { item: ClothingItem }) {
  switch (item.id) {
    case 'sun_classic':
    case 'sun_nerd':
      return (
        <g id="wearable_sunglasses">
          <rect x="-42" y="-8" width="30" height="20" rx="8" fill={item.color} opacity="0.88" stroke={item.color2} strokeWidth="1.5" />
          <rect x="12" y="-8" width="30" height="20" rx="8" fill={item.color} opacity="0.88" stroke={item.color2} strokeWidth="1.5" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke={item.color2} strokeWidth="2" />
          <rect x="-40" y="-7" width="12" height="6" rx="3" fill="white" opacity="0.15" />
          <rect x="14" y="-7" width="12" height="6" rx="3" fill="white" opacity="0.15" />
        </g>
      );
    case 'sun_star':
      return (
        <g id="wearable_sunglasses">
          <polygon points="-22,-14 -18,-4 -8,-2 -15,5 -13,16 -22,10 -31,16 -29,5 -36,-2 -26,-4" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <polygon points="22,-14 26,-4 36,-2 29,5 31,16 22,10 13,16 15,5 8,-2 18,-4" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke={item.color2} strokeWidth="2" />
        </g>
      );
    case 'sun_heart':
      return (
        <g id="wearable_sunglasses">
          <path d="M -22 -4 C -32 -14, -42 -4, -22 12 C -2 -4, -12 -14, -22 -4 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M 22 -4 C 12 -14, 2 -4, 22 12 C 42 -4, 32 -14, 22 -4 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke={item.color2} strokeWidth="2" />
        </g>
      );
    case 'sun_round':
      return (
        <g id="wearable_sunglasses">
          <circle cx="-26" cy="0" r="14" fill="none" stroke={item.color} strokeWidth="2.5" />
          <circle cx="26" cy="0" r="14" fill="none" stroke={item.color} strokeWidth="2.5" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke={item.color} strokeWidth="2" />
          <circle cx="-30" cy="-4" r="4" fill="white" opacity="0.15" />
          <circle cx="22" cy="-4" r="4" fill="white" opacity="0.15" />
        </g>
      );
    default:
      return null;
  }
}

// ===== SHIRTS — rendered inside #torso group =====
export function WearableShirt({ item }: { item: ClothingItem }) {
  const style = item.style || 'tshirt';
  
  if (style === 'tank') {
    return (
      <g id="wearable_shirt">
        <ellipse cx="0" cy="0" rx="42" ry="40" fill={item.color} opacity="0.88" />
        <ellipse cx="-6" cy="-8" rx="20" ry="16" fill="white" opacity="0.08" />
        {/* Wide neckline */}
        <path d="M -20 -35 Q 0 -22 20 -35" fill={item.color2} opacity="0.5" />
        {/* No sleeves — exposed shoulders */}
      </g>
    );
  }
  
  if (style === 'hoodie') {
    return (
      <g id="wearable_shirt">
        <ellipse cx="0" cy="0" rx="54" ry="44" fill={item.color} opacity="0.9" />
        <ellipse cx="-8" cy="-8" rx="24" ry="18" fill="white" opacity="0.06" />
        {/* Hood behind head */}
        <path d="M -25 -38 Q 0 -48 25 -38 Q 28 -30 25 -25 L -25 -25 Q -28 -30 -25 -38 Z" fill={item.color2} opacity="0.6" />
        {/* Pocket */}
        <path d="M -16 8 L 16 8 Q 18 10 18 14 L -18 14 Q -18 10 -16 8 Z" fill={item.color2} opacity="0.3" />
        {/* Sleeves */}
        <ellipse cx="-50" cy="-5" rx="16" ry="14" fill={item.color} opacity="0.85" />
        <ellipse cx="50" cy="-5" rx="16" ry="14" fill={item.color} opacity="0.85" />
        {/* Drawstrings */}
        <line x1="-5" y1="-28" x2="-5" y2="-18" stroke={item.color2} strokeWidth="1" opacity="0.4" />
        <line x1="5" y1="-28" x2="5" y2="-18" stroke={item.color2} strokeWidth="1" opacity="0.4" />
      </g>
    );
  }
  
  if (style === 'polo') {
    return (
      <g id="wearable_shirt">
        <ellipse cx="0" cy="0" rx="52" ry="42" fill={item.color} opacity="0.88" />
        <ellipse cx="-8" cy="-8" rx="24" ry="18" fill="white" opacity="0.08" />
        {/* Collar */}
        <path d="M -18 -36 L -8 -28 L 0 -34 L 8 -28 L 18 -36" fill="none" stroke={item.color2} strokeWidth="2.5" strokeLinecap="round" />
        {/* Buttons */}
        <circle cx="0" cy="-24" r="2" fill={item.color2} opacity="0.5" />
        <circle cx="0" cy="-16" r="2" fill={item.color2} opacity="0.5" />
        {/* Sleeves */}
        <ellipse cx="-48" cy="-5" rx="15" ry="12" fill={item.color} opacity="0.82" />
        <ellipse cx="48" cy="-5" rx="15" ry="12" fill={item.color} opacity="0.82" />
      </g>
    );
  }

  // Default t-shirt style
  return (
    <g id="wearable_shirt">
      <ellipse cx="0" cy="0" rx="52" ry="42" fill={item.color} opacity="0.88" />
      <ellipse cx="-8" cy="-8" rx="24" ry="18" fill="white" opacity="0.08" />
      {/* Neckline */}
      <path d="M -15 -37 Q 0 -25 15 -37" fill={item.color2} opacity="0.5" />
      {/* Sleeves */}
      <ellipse cx="-48" cy="-5" rx="15" ry="12" fill={item.color} opacity="0.82" />
      <ellipse cx="48" cy="-5" rx="15" ry="12" fill={item.color} opacity="0.82" />
      {/* Special details */}
      {item.id === 'shirt_star' && (
        <polygon points="0,-17 4,-7 15,-5 7,2 9,13 0,7 -9,13 -7,2 -15,-5 -4,-7" fill="white" opacity="0.35" />
      )}
      {item.id === 'shirt_hero' && (
        <path d="M -45 -25 Q -60 25 -40 65 L 0 45 L 40 65 Q 60 25 45 -25 Z" fill={item.color} opacity="0.25" />
      )}
    </g>
  );
}

// ===== PANTS — rendered on each leg group =====
export function WearablePantsLeg({ item, side }: { item: ClothingItem; side: 'left' | 'right' }) {
  const style = item.style || 'long';
  
  if (style === 'shorts') {
    return (
      <g id={`wearable_pants_${side}`}>
        <ellipse cx={0} cy="-6" rx="19" ry="16" fill={item.color} opacity="0.88" />
        <ellipse cx={-4} cy="-10" rx="8" ry="8" fill="white" opacity="0.06" />
      </g>
    );
  }
  
  if (style === 'overalls') {
    return (
      <g id={`wearable_pants_${side}`}>
        <ellipse cx={0} cy="-2" rx="19" ry="24" fill={item.color} opacity="0.88" />
        <ellipse cx={-4} cy="-8" rx="8" ry="10" fill="white" opacity="0.06" />
        {/* Strap */}
        <line x1={side === 'left' ? -8 : 8} y1="-24" x2={side === 'left' ? -4 : 4} y2="-40" stroke={item.color2} strokeWidth="3" strokeLinecap="round" />
        {/* Button on strap */}
        <circle cx={side === 'left' ? -4 : 4} cy="-40" r="2.5" fill={item.color2} />
      </g>
    );
  }
  
  // Default long pants
  return (
    <g id={`wearable_pants_${side}`}>
      <ellipse cx={0} cy="-2" rx="19" ry="24" fill={item.color} opacity="0.88" />
      <ellipse cx={-4} cy="-8" rx="8" ry="10" fill="white" opacity="0.06" />
    </g>
  );
}

// ===== DRESS — covers torso and legs =====
export function WearableDress({ item }: { item: ClothingItem }) {
  const style = item.style || 'aline';
  
  if (style === 'ballgown') {
    return (
      <g id="wearable_dress">
        {/* Bodice */}
        <path d="M -35 -30 Q -40 0 -30 10 L 30 10 Q 40 0 35 -30 Q 20 -38 0 -40 Q -20 -38 -35 -30 Z" fill={item.color} opacity="0.9" />
        <ellipse cx="-10" cy="-20" rx="14" ry="10" fill="white" opacity="0.1" />
        {/* Neckline */}
        <path d="M -18 -32 Q 0 -22 18 -32" fill={item.color2} opacity="0.4" />
        {/* Sleeves */}
        <ellipse cx="-38" cy="-18" rx="12" ry="10" fill={item.color} opacity="0.82" />
        <ellipse cx="38" cy="-18" rx="12" ry="10" fill={item.color} opacity="0.82" />
        {/* Wide skirt */}
        <path d="M -30 10 Q -55 40 -60 70 Q -40 78 0 80 Q 40 78 60 70 Q 55 40 30 10 Z" fill={item.color} opacity="0.85" />
        <path d="M -20 10 Q -30 40 -35 70 Q -10 75 0 76 Q 10 75 35 70 Q 30 40 20 10 Z" fill={item.color2} opacity="0.12" />
        {/* Sparkles for princess/party */}
        <circle cx="-15" cy="35" r="2" fill="white" opacity="0.4" />
        <circle cx="10" cy="50" r="1.5" fill="white" opacity="0.3" />
        <circle cx="-8" cy="60" r="2" fill="white" opacity="0.35" />
        <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.25" />
      </g>
    );
  }
  
  if (style === 'tutu') {
    return (
      <g id="wearable_dress">
        {/* Bodice */}
        <path d="M -32 -28 Q -36 0 -26 8 L 26 8 Q 36 0 32 -28 Q 18 -36 0 -38 Q -18 -36 -32 -28 Z" fill={item.color} opacity="0.9" />
        <path d="M -16 -30 Q 0 -20 16 -30" fill={item.color2} opacity="0.4" />
        {/* Sleeves */}
        <ellipse cx="-36" cy="-16" rx="10" ry="8" fill={item.color} opacity="0.82" />
        <ellipse cx="36" cy="-16" rx="10" ry="8" fill={item.color} opacity="0.82" />
        {/* Puffy tutu layers */}
        <path d="M -28 8 Q -50 20 -52 35 Q -30 40 0 42 Q 30 40 52 35 Q 50 20 28 8 Z" fill={item.color} opacity="0.7" />
        <path d="M -30 12 Q -48 25 -48 38 Q -25 44 0 46 Q 25 44 48 38 Q 48 25 30 12 Z" fill={item.color2} opacity="0.25" />
        <path d="M -26 16 Q -44 28 -44 40 Q -20 47 0 48 Q 20 47 44 40 Q 44 28 26 16 Z" fill={item.color} opacity="0.5" />
      </g>
    );
  }

  // Default A-line dress
  return (
    <g id="wearable_dress">
      {/* Bodice */}
      <path d="M -34 -30 Q -38 0 -28 10 L 28 10 Q 38 0 34 -30 Q 18 -38 0 -40 Q -18 -38 -34 -30 Z" fill={item.color} opacity="0.9" />
      <ellipse cx="-8" cy="-18" rx="14" ry="10" fill="white" opacity="0.08" />
      {/* Neckline */}
      <path d="M -16 -32 Q 0 -22 16 -32" fill={item.color2} opacity="0.4" />
      {/* Sleeves */}
      <ellipse cx="-36" cy="-18" rx="12" ry="10" fill={item.color} opacity="0.82" />
      <ellipse cx="36" cy="-18" rx="12" ry="10" fill={item.color} opacity="0.82" />
      {/* A-line skirt */}
      <path d="M -28 10 Q -42 40 -45 68 Q -20 74 0 75 Q 20 74 45 68 Q 42 40 28 10 Z" fill={item.color} opacity="0.85" />
      <path d="M -18 10 Q -25 40 -28 65 Q -5 70 0 70 Q 5 70 28 65 Q 25 40 18 10 Z" fill="white" opacity="0.06" />
      {/* Flower pattern for flower dress */}
      {item.id === 'dress_flower' && (
        <>
          <circle cx="-12" cy="30" r="3" fill="white" opacity="0.3" />
          <circle cx="8" cy="45" r="2.5" fill="white" opacity="0.25" />
          <circle cx="-5" cy="55" r="3" fill="white" opacity="0.2" />
          <circle cx="15" cy="35" r="2" fill="white" opacity="0.2" />
        </>
      )}
    </g>
  );
}

// ===== SHOES — rendered at the bottom of each leg =====
export function WearableShoe({ item, side }: { item: ClothingItem; side: 'left' | 'right' }) {
  switch (item.id) {
    case 'shoes_red':
    case 'shoes_blue':
      // Sneaker shape
      return (
        <g id={`wearable_shoe_${side}`} transform="translate(0, 22)">
          <path d="M -16 -4 Q -18 6 -12 10 L 14 10 Q 20 8 18 -2 Q 10 -8 -8 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M -10 -6 Q -4 -8 4 -6 Q 2 -2 -8 -2 Z" fill="white" opacity="0.2" />
          <ellipse cx="0" cy="8" rx="14" ry="3" fill={item.color2} opacity="0.4" />
          <line x1="-6" y1="2" x2="6" y2="2" stroke="white" strokeWidth="0.8" opacity="0.4" />
          <line x1="-4" y1="5" x2="8" y2="5" stroke="white" strokeWidth="0.8" opacity="0.3" />
        </g>
      );
    case 'shoes_boots':
      return (
        <g id={`wearable_shoe_${side}`} transform="translate(0, 18)">
          <path d="M -14 -12 L -14 8 Q -14 14 -4 14 L 12 14 Q 18 12 16 4 L 14 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" />
          <path d="M -12 -10 L -10 -4 Q -4 -6 6 -6 L 12 -8 Z" fill="white" opacity="0.1" />
          <line x1="-12" y1="0" x2="14" y2="0" stroke={item.color2} strokeWidth="1" opacity="0.3" />
        </g>
      );
    case 'shoes_sandals':
      return (
        <g id={`wearable_shoe_${side}`} transform="translate(0, 24)">
          <ellipse cx="0" cy="4" rx="14" ry="6" fill={item.color} stroke={item.color2} strokeWidth="1" />
          <path d="M -8 -2 Q 0 -6 8 -2" fill="none" stroke={item.color2} strokeWidth="2" strokeLinecap="round" />
          <path d="M -4 0 Q 0 -4 4 0" fill="none" stroke={item.color2} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 'shoes_fancy':
      return (
        <g id={`wearable_shoe_${side}`} transform="translate(0, 22)">
          <path d="M -12 -4 Q -14 6 -8 10 L 16 10 Q 20 6 16 -2 Q 8 -8 -6 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" />
          <ellipse cx="-2" cy="2" rx="6" ry="4" fill="white" opacity="0.08" />
        </g>
      );
    default:
      return null;
  }
}

// ===== SHOP PREVIEW SVGs — descriptive item shapes =====
export function ShopPreviewSVG({ item, size = 40 }: { item: ClothingItem; size?: number }) {
  const s = size;
  switch (item.type) {
    case 'hat':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48">
          {item.id === 'hat_crown' && (
            <g transform="translate(24, 28)">
              <path d="M -18 6 L -14 -12 L -6 0 L 0 -16 L 6 0 L 14 -12 L 18 6 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" />
              <rect x="-18" y="6" width="36" height="5" rx="1.5" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
              <circle cx="-8" cy="8" r="2" fill="#FF2020" /><circle cx="0" cy="8" r="2" fill="#2060FF" /><circle cx="8" cy="8" r="2" fill="#20CC20" />
            </g>
          )}
          {item.id === 'hat_wizard' && (
            <g transform="translate(24, 30)">
              <path d="M 0 -32 Q 10 -12 20 8 L -20 8 Q -10 -12 0 -32 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
              <ellipse cx="0" cy="8" rx="22" ry="4" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
              <circle cx="-3" cy="-12" r="2" fill="#FFD700" /><circle cx="3" cy="-22" r="1.5" fill="#FFD700" />
            </g>
          )}
          {item.id === 'hat_party' && (
            <g transform="translate(24, 30)">
              <path d="M 0 -28 L 16 8 L -16 8 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
              <circle cx="0" cy="-30" r="4" fill="#FFD700" />
              <line x1="-5" y1="-6" x2="5" y2="-6" stroke="#FFD700" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}
          {item.id === 'hat_cap' && (
            <g transform="translate(24, 28)">
              <path d="M -18 4 Q -18 -12 0 -16 Q 18 -12 18 4 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
              <ellipse cx="12" cy="6" rx="14" ry="4" fill={item.color2} />
            </g>
          )}
          {item.id === 'hat_cowboy' && (
            <g transform="translate(24, 28)">
              <ellipse cx="0" cy="6" rx="22" ry="5" fill={item.color} stroke={item.color2} strokeWidth="1" />
              <path d="M -14 6 Q -14 -10 0 -14 Q 14 -10 14 6 Z" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
            </g>
          )}
          {item.id === 'hat_beanie' && (
            <g transform="translate(24, 28)">
              <path d="M -18 6 Q -20 -14 0 -18 Q 20 -14 18 6 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
              <circle cx="0" cy="-20" r="3.5" fill={item.color} stroke={item.color2} strokeWidth="0.5" />
            </g>
          )}
        </svg>
      );
    case 'sunglasses':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48">
          <g transform="translate(24, 24)">
            {(item.id === 'sun_classic' || item.id === 'sun_nerd') && (
              <>
                <rect x="-20" y="-6" width="16" height="12" rx="5" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <rect x="4" y="-6" width="16" height="12" rx="5" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke={item.color2} strokeWidth="1.5" />
              </>
            )}
            {item.id === 'sun_star' && (
              <>
                <polygon points="-12,-10 -10,-4 -4,-2 -8,2 -7,9 -12,5 -17,9 -16,2 -20,-2 -14,-4" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
                <polygon points="12,-10 14,-4 20,-2 16,2 17,9 12,5 7,9 8,2 4,-2 10,-4" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke={item.color2} strokeWidth="1.5" />
              </>
            )}
            {item.id === 'sun_heart' && (
              <>
                <path d="M -12 -2 C -17 -8, -22 -2, -12 8 C -2 -2, -7 -8, -12 -2 Z" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
                <path d="M 12 -2 C 7 -8, 2 -2, 12 8 C 22 -2, 17 -8, 12 -2 Z" fill={item.color} stroke={item.color2} strokeWidth="0.8" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke={item.color2} strokeWidth="1.5" />
              </>
            )}
            {item.id === 'sun_round' && (
              <>
                <circle cx="-12" cy="0" r="8" fill="none" stroke={item.color} strokeWidth="1.8" />
                <circle cx="12" cy="0" r="8" fill="none" stroke={item.color} strokeWidth="1.8" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke={item.color} strokeWidth="1.5" />
              </>
            )}
          </g>
        </svg>
      );
    case 'shirt':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48">
          <g transform="translate(24, 24)">
            {(item.style === 'tank') ? (
              <>
                <path d="M -10 -14 L -10 14 L 10 14 L 10 -14 L 6 -10 Q 0 -6 -6 -10 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M -6 -10 Q 0 -6 6 -10" fill="none" stroke={item.color2} strokeWidth="0.8" />
              </>
            ) : (item.style === 'hoodie') ? (
              <>
                <path d="M -12 -16 L -18 -10 L -12 -2 L -12 14 L 12 14 L 12 -2 L 18 -10 L 12 -16 L 6 -12 Q 0 -8 -6 -12 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M -8 -16 Q 0 -20 8 -16" fill={item.color2} opacity="0.4" stroke={item.color2} strokeWidth="0.5" />
                <rect x="-6" y="4" width="12" height="4" rx="1" fill={item.color2} opacity="0.3" />
              </>
            ) : (item.style === 'polo') ? (
              <>
                <path d="M -10 -14 L -18 -8 L -10 -2 L -10 14 L 10 14 L 10 -2 L 18 -8 L 10 -14 L 6 -10 Q 0 -6 -6 -10 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M -6 -10 L -3 -6 L 0 -9 L 3 -6 L 6 -10" fill="none" stroke={item.color2} strokeWidth="1" />
                <circle cx="0" cy="-4" r="1" fill={item.color2} />
              </>
            ) : (
              <>
                <path d="M -10 -14 L -18 -8 L -10 -2 L -10 14 L 10 14 L 10 -2 L 18 -8 L 10 -14 L 6 -10 Q 0 -6 -6 -10 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M -6 -10 Q 0 -6 6 -10" fill="none" stroke={item.color2} strokeWidth="0.8" />
                {item.id === 'shirt_star' && <polygon points="0,-4 2,1 7,2 3,5 4,10 0,7 -4,10 -3,5 -7,2 -2,1" fill="white" opacity="0.35" />}
              </>
            )}
          </g>
        </svg>
      );
    case 'pants':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48">
          <g transform="translate(24, 22)">
            {(item.style === 'shorts') ? (
              <>
                <path d="M -14 -8 L -14 8 Q -14 12 -8 12 L -2 12 L -2 -2 L 2 -2 L 2 12 L 8 12 Q 14 12 14 8 L 14 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <rect x="-14" y="-8" width="28" height="5" rx="1" fill={item.color2} opacity="0.3" />
              </>
            ) : (item.style === 'overalls') ? (
              <>
                <path d="M -14 -8 L -14 16 Q -14 20 -8 20 L -2 20 L -2 -2 L 2 -2 L 2 20 L 8 20 Q 14 20 14 16 L 14 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <line x1="-8" y1="-8" x2="-6" y2="-16" stroke={item.color2} strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="-8" x2="6" y2="-16" stroke={item.color2} strokeWidth="2" strokeLinecap="round" />
                <circle cx="-6" cy="-16" r="1.5" fill={item.color2} />
                <circle cx="6" cy="-16" r="1.5" fill={item.color2} />
              </>
            ) : (
              <>
                <path d="M -14 -8 L -14 16 Q -14 20 -8 20 L -2 20 L -2 -2 L 2 -2 L 2 20 L 8 20 Q 14 20 14 16 L 14 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" strokeLinejoin="round" />
                <rect x="-14" y="-8" width="28" height="5" rx="1" fill={item.color2} opacity="0.3" />
              </>
            )}
          </g>
        </svg>
      );
    case 'dress':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48">
          <g transform="translate(24, 24)">
            {(item.style === 'ballgown') ? (
              <>
                <path d="M -6 -14 Q -10 -6 -8 0 L 8 0 Q 10 -6 6 -14 Q 0 -16 -6 -14 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <path d="M -8 0 Q -18 10 -20 18 Q 0 22 20 18 Q 18 10 8 0 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <circle cx="-4" cy="10" r="1" fill="white" opacity="0.4" />
                <circle cx="5" cy="14" r="0.8" fill="white" opacity="0.3" />
              </>
            ) : (item.style === 'tutu') ? (
              <>
                <path d="M -6 -14 Q -10 -6 -8 0 L 8 0 Q 10 -6 6 -14 Q 0 -16 -6 -14 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <path d="M -8 0 Q -16 6 -18 12 Q 0 16 18 12 Q 16 6 8 0 Z" fill={item.color} opacity="0.7" stroke={item.color2} strokeWidth="0.8" />
                <path d="M -6 2 Q -14 8 -15 14 Q 0 18 15 14 Q 14 8 6 2 Z" fill={item.color2} opacity="0.25" />
              </>
            ) : (
              <>
                <path d="M -6 -14 Q -10 -6 -8 0 L 8 0 Q 10 -6 6 -14 Q 0 -16 -6 -14 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <path d="M -8 0 Q -14 10 -16 18 Q 0 22 16 18 Q 14 10 8 0 Z" fill={item.color} stroke={item.color2} strokeWidth="1" />
              </>
            )}
          </g>
        </svg>
      );
    case 'shoes':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48">
          <g transform="translate(24, 26)">
            {(item.id === 'shoes_red' || item.id === 'shoes_blue') && (
              <path d="M -16 -6 Q -18 4 -12 8 L 12 8 Q 18 6 16 -2 Q 8 -10 -8 -10 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" />
            )}
            {item.id === 'shoes_boots' && (
              <path d="M -10 -14 L -10 6 Q -10 10 -2 10 L 10 10 Q 14 8 12 2 L 10 -10 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" />
            )}
            {item.id === 'shoes_sandals' && (
              <>
                <ellipse cx="0" cy="4" rx="12" ry="5" fill={item.color} stroke={item.color2} strokeWidth="1" />
                <path d="M -6 -2 Q 0 -6 6 -2" fill="none" stroke={item.color2} strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            {item.id === 'shoes_fancy' && (
              <path d="M -12 -4 Q -14 4 -8 8 L 14 8 Q 18 4 14 -2 Q 6 -8 -6 -8 Z" fill={item.color} stroke={item.color2} strokeWidth="1.2" />
            )}
          </g>
        </svg>
      );
    default:
      return null;
  }
}
