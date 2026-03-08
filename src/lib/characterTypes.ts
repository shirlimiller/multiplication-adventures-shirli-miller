// Character system — shared anchor-based architecture for multi-character support

export type CharacterId = 'fox' | 'cat' | 'dog';

/** Anchor points that every character SVG must define */
export interface CharacterAnchors {
  head_top: { x: number; y: number };
  eyes_center: { x: number; y: number };
  torso_center: { x: number; y: number };
  feet_base_left: { x: number; y: number };
  feet_base_right: { x: number; y: number };
  /** Scale factors for clothing on this character relative to the fox baseline */
  clothingScale: {
    hat: number;
    sunglasses: number;
    shirt: number;
    pants: number;
    shoes: number;
  };
}

export interface CharacterDef {
  id: CharacterId;
  name: string;       // Hebrew display name
  emoji: string;
  description: string; // Hebrew
  anchors: CharacterAnchors;
  /** SVG viewBox dimensions */
  viewBox: { width: number; height: number };
}

// ===== Fox anchors (baseline character) =====
const FOX_ANCHORS: CharacterAnchors = {
  head_top: { x: 120, y: 40 },
  eyes_center: { x: 120, y: 95 },
  torso_center: { x: 120, y: 195 },
  feet_base_left: { x: 85, y: 258 },
  feet_base_right: { x: 155, y: 255 },
  clothingScale: { hat: 1, sunglasses: 1, shirt: 1, pants: 1, shoes: 1 },
};

// ===== Cat anchors =====
const CAT_ANCHORS: CharacterAnchors = {
  head_top: { x: 120, y: 35 },
  eyes_center: { x: 120, y: 90 },
  torso_center: { x: 120, y: 185 },
  feet_base_left: { x: 90, y: 255 },
  feet_base_right: { x: 150, y: 255 },
  clothingScale: { hat: 0.95, sunglasses: 0.95, shirt: 1.05, pants: 1, shoes: 0.95 },
};

// ===== Dog anchors =====
const DOG_ANCHORS: CharacterAnchors = {
  head_top: { x: 120, y: 30 },
  eyes_center: { x: 120, y: 88 },
  torso_center: { x: 120, y: 190 },
  feet_base_left: { x: 88, y: 262 },
  feet_base_right: { x: 152, y: 262 },
  clothingScale: { hat: 1.05, sunglasses: 1, shirt: 1.1, pants: 1.05, shoes: 1.05 },
};

export const CHARACTER_REGISTRY: CharacterDef[] = [
  {
    id: 'fox',
    name: 'שועל',
    emoji: '🦊',
    description: 'שועל חמוד וחכם!',
    anchors: FOX_ANCHORS,
    viewBox: { width: 240, height: 280 },
  },
  {
    id: 'cat',
    name: 'חתול',
    emoji: '🐱',
    description: 'חתול מתוק ושובב!',
    anchors: CAT_ANCHORS,
    viewBox: { width: 240, height: 280 },
  },
  {
    id: 'dog',
    name: 'כלב',
    emoji: '🐶',
    description: 'כלב נאמן ושמח!',
    anchors: DOG_ANCHORS,
    viewBox: { width: 240, height: 280 },
  },
];

export function getCharacterDef(id: CharacterId): CharacterDef {
  return CHARACTER_REGISTRY.find(c => c.id === id) || CHARACTER_REGISTRY[0];
}

// Persistence key for character selection per player
const CHARACTER_SELECTION_KEY = 'multiplication_game_character_selection';

export function getPlayerCharacter(playerId: string): CharacterId {
  try {
    const saved = localStorage.getItem(CHARACTER_SELECTION_KEY);
    if (saved) {
      const map = JSON.parse(saved) as Record<string, CharacterId>;
      return map[playerId] || 'fox';
    }
  } catch {}
  return 'fox';
}

export function setPlayerCharacter(playerId: string, characterId: CharacterId) {
  try {
    const saved = localStorage.getItem(CHARACTER_SELECTION_KEY);
    const map = saved ? JSON.parse(saved) : {};
    map[playerId] = characterId;
    localStorage.setItem(CHARACTER_SELECTION_KEY, JSON.stringify(map));
  } catch {}
}
