// Clothing shop types and data

export interface ClothingItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  type: 'hat' | 'glasses' | 'scarf' | 'bow' | 'shirt';
  description: string;
}

export interface PlayerClothing {
  ownedItems: string[]; // item IDs
  equippedItems: {
    hat?: string;
    glasses?: string;
    scarf?: string;
    bow?: string;
    shirt?: string;
  };
}

export const DEFAULT_PLAYER_CLOTHING: PlayerClothing = {
  ownedItems: [],
  equippedItems: {},
};

export const CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: 'crown',
    name: 'כתר זהב',
    emoji: '👑',
    price: 50,
    type: 'hat',
    description: 'כתר מלכותי לאלוף!',
  },
  {
    id: 'wizard_hat',
    name: 'כובע קוסם',
    emoji: '🎩',
    price: 35,
    type: 'hat',
    description: 'קסם של חכמה!',
  },
  {
    id: 'party_hat',
    name: 'כובע מסיבה',
    emoji: '🥳',
    price: 25,
    type: 'hat',
    description: 'מסיבה!',
  },
  {
    id: 'cap',
    name: 'כובע מצחייה',
    emoji: '🧢',
    price: 20,
    type: 'hat',
    description: 'סטייל!',
  },
  {
    id: 'sunglasses',
    name: 'משקפי שמש',
    emoji: '🕶️',
    price: 30,
    type: 'glasses',
    description: 'מגניב במיוחד!',
  },
  {
    id: 'star_glasses',
    name: 'משקפי כוכב',
    emoji: '⭐',
    price: 40,
    type: 'glasses',
    description: 'כוכב על!',
  },
  {
    id: 'red_scarf',
    name: 'צעיף אדום',
    emoji: '🧣',
    price: 25,
    type: 'scarf',
    description: 'חמים ויפה!',
  },
  {
    id: 'bow_tie',
    name: 'עניבת פרפר',
    emoji: '🎀',
    price: 20,
    type: 'bow',
    description: 'אלגנטי!',
  },
  {
    id: 'superhero',
    name: 'גלימת גיבור',
    emoji: '🦸',
    price: 60,
    type: 'shirt',
    description: 'גיבור על של מתמטיקה!',
  },
  {
    id: 'tshirt_star',
    name: 'חולצת כוכבים',
    emoji: '⭐',
    price: 35,
    type: 'shirt',
    description: 'זורח כמו כוכב!',
  },
];

export function getItemsByType(type: ClothingItem['type']): ClothingItem[] {
  return CLOTHING_ITEMS.filter(item => item.type === type);
}
