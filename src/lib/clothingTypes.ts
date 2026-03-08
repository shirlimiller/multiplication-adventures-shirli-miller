// Clothing shop types and data

export interface ClothingItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  type: 'hat' | 'glasses' | 'scarf' | 'bow' | 'shirt' | 'pants' | 'shoes';
  description: string;
  color?: string; // Primary color for SVG rendering
  color2?: string; // Secondary color
}

export interface PlayerClothing {
  ownedItems: string[];
  equippedItems: {
    hat?: string;
    glasses?: string;
    scarf?: string;
    bow?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
  };
}

export const DEFAULT_PLAYER_CLOTHING: PlayerClothing = {
  ownedItems: [],
  equippedItems: {},
};

export const CLOTHING_ITEMS: ClothingItem[] = [
  // ===== HATS (5) =====
  {
    id: 'crown',
    name: 'כתר זהב',
    emoji: '👑',
    price: 50,
    type: 'hat',
    description: 'כתר מלכותי לאלוף!',
    color: '#FFD700',
    color2: '#DAA520',
  },
  {
    id: 'wizard_hat',
    name: 'כובע קוסם',
    emoji: '🎩',
    price: 35,
    type: 'hat',
    description: 'קסם של חכמה!',
    color: '#3B2080',
    color2: '#2A1060',
  },
  {
    id: 'party_hat',
    name: 'כובע מסיבה',
    emoji: '🥳',
    price: 25,
    type: 'hat',
    description: 'מסיבה!',
    color: '#FF4570',
    color2: '#E03060',
  },
  {
    id: 'cap',
    name: 'כובע מצחייה',
    emoji: '🧢',
    price: 20,
    type: 'hat',
    description: 'סטייל!',
    color: '#2266CC',
    color2: '#1A4488',
  },
  {
    id: 'cowboy_hat',
    name: 'כובע קאובוי',
    emoji: '🤠',
    price: 40,
    type: 'hat',
    description: 'יי-האא!',
    color: '#8B6914',
    color2: '#6B4E0A',
  },
  {
    id: 'beanie',
    name: 'כובע צמר',
    emoji: '🧶',
    price: 22,
    type: 'hat',
    description: 'חמים ונעים!',
    color: '#CC3333',
    color2: '#992222',
  },

  // ===== GLASSES (5) =====
  {
    id: 'sunglasses',
    name: 'משקפי שמש',
    emoji: '🕶️',
    price: 30,
    type: 'glasses',
    description: 'מגניב במיוחד!',
    color: '#333333',
    color2: '#111111',
  },
  {
    id: 'star_glasses',
    name: 'משקפי כוכב',
    emoji: '⭐',
    price: 40,
    type: 'glasses',
    description: 'כוכב על!',
    color: '#FFD700',
    color2: '#DAA520',
  },
  {
    id: 'heart_glasses',
    name: 'משקפי לב',
    emoji: '❤️',
    price: 35,
    type: 'glasses',
    description: 'אהבה!',
    color: '#FF4488',
    color2: '#CC2266',
  },
  {
    id: 'round_glasses',
    name: 'משקפיים עגולים',
    emoji: '👓',
    price: 25,
    type: 'glasses',
    description: 'חכם וחמוד!',
    color: '#8B7355',
    color2: '#6B5335',
  },
  {
    id: 'nerd_glasses',
    name: 'משקפי נרד',
    emoji: '🤓',
    price: 28,
    type: 'glasses',
    description: 'גאון מתמטיקה!',
    color: '#222222',
    color2: '#000000',
  },

  // ===== SHIRTS (5) =====
  {
    id: 'superhero',
    name: 'גלימת גיבור',
    emoji: '🦸',
    price: 60,
    type: 'shirt',
    description: 'גיבור על של מתמטיקה!',
    color: '#CC2020',
    color2: '#991010',
  },
  {
    id: 'tshirt_star',
    name: 'חולצת כוכבים',
    emoji: '⭐',
    price: 35,
    type: 'shirt',
    description: 'זורח כמו כוכב!',
    color: '#FFD700',
    color2: '#E8B800',
  },
  {
    id: 'tshirt_blue',
    name: 'חולצה כחולה',
    emoji: '👕',
    price: 20,
    type: 'shirt',
    description: 'קלאסית ויפה!',
    color: '#4488CC',
    color2: '#2266AA',
  },
  {
    id: 'tshirt_pink',
    name: 'חולצה ורודה',
    emoji: '👚',
    price: 22,
    type: 'shirt',
    description: 'ורוד מתוק!',
    color: '#FF88AA',
    color2: '#DD6688',
  },
  {
    id: 'tshirt_green',
    name: 'חולצה ירוקה',
    emoji: '🥒',
    price: 20,
    type: 'shirt',
    description: 'ירוק טבע!',
    color: '#44AA44',
    color2: '#228822',
  },
  {
    id: 'tshirt_stripe',
    name: 'חולצת פסים',
    emoji: '🏴',
    price: 28,
    type: 'shirt',
    description: 'פסים מגניבים!',
    color: '#2244AA',
    color2: '#FFFFFF',
  },

  // ===== PANTS (5) =====
  {
    id: 'jeans',
    name: 'ג\'ינס כחול',
    emoji: '👖',
    price: 30,
    type: 'pants',
    description: 'ג\'ינס קלאסי!',
    color: '#3366AA',
    color2: '#224488',
  },
  {
    id: 'shorts_red',
    name: 'מכנסיים קצרים',
    emoji: '🩳',
    price: 18,
    type: 'pants',
    description: 'נוח וקליל!',
    color: '#DD4444',
    color2: '#BB2222',
  },
  {
    id: 'pants_green',
    name: 'מכנסיים ירוקים',
    emoji: '🌿',
    price: 25,
    type: 'pants',
    description: 'סטייל צבאי!',
    color: '#4A7A3A',
    color2: '#3A5A2A',
  },
  {
    id: 'pants_purple',
    name: 'מכנסיים סגולים',
    emoji: '💜',
    price: 28,
    type: 'pants',
    description: 'צבע מיוחד!',
    color: '#8844CC',
    color2: '#6622AA',
  },
  {
    id: 'pants_yellow',
    name: 'מכנסיים צהובים',
    emoji: '🌟',
    price: 22,
    type: 'pants',
    description: 'שמש ושמחה!',
    color: '#DDBB22',
    color2: '#BB9900',
  },

  // ===== SHOES (5) =====
  {
    id: 'sneakers_red',
    name: 'נעלי ספורט אדומות',
    emoji: '👟',
    price: 35,
    type: 'shoes',
    description: 'מהירות!',
    color: '#DD3333',
    color2: '#BB1111',
  },
  {
    id: 'sneakers_blue',
    name: 'נעלי ספורט כחולות',
    emoji: '👟',
    price: 35,
    type: 'shoes',
    description: 'ריצה!',
    color: '#3366DD',
    color2: '#2244BB',
  },
  {
    id: 'boots',
    name: 'מגפיים',
    emoji: '🥾',
    price: 40,
    type: 'shoes',
    description: 'להרפתקאות!',
    color: '#8B6914',
    color2: '#6B4E0A',
  },
  {
    id: 'sandals',
    name: 'סנדלים',
    emoji: '🩴',
    price: 15,
    type: 'shoes',
    description: 'נוח לקיץ!',
    color: '#FF8844',
    color2: '#DD6622',
  },
  {
    id: 'fancy_shoes',
    name: 'נעליים אלגנטיות',
    emoji: '👞',
    price: 45,
    type: 'shoes',
    description: 'לאירועים מיוחדים!',
    color: '#222222',
    color2: '#111111',
  },

  // ===== SCARVES (3) =====
  {
    id: 'red_scarf',
    name: 'צעיף אדום',
    emoji: '🧣',
    price: 25,
    type: 'scarf',
    description: 'חמים ויפה!',
    color: '#CC2020',
    color2: '#AA1818',
  },
  {
    id: 'blue_scarf',
    name: 'צעיף כחול',
    emoji: '🧣',
    price: 25,
    type: 'scarf',
    description: 'ים של צבע!',
    color: '#2255BB',
    color2: '#1A3388',
  },
  {
    id: 'rainbow_scarf',
    name: 'צעיף קשת',
    emoji: '🌈',
    price: 35,
    type: 'scarf',
    description: 'כל הצבעים!',
    color: '#FF4444',
    color2: '#4444FF',
  },

  // ===== BOWS (3) =====
  {
    id: 'bow_tie',
    name: 'עניבת פרפר',
    emoji: '🎀',
    price: 20,
    type: 'bow',
    description: 'אלגנטי!',
    color: '#FF69B4',
    color2: '#E05090',
  },
  {
    id: 'bow_blue',
    name: 'פפיון כחול',
    emoji: '🎀',
    price: 22,
    type: 'bow',
    description: 'מלכותי!',
    color: '#4488DD',
    color2: '#2266BB',
  },
  {
    id: 'bow_gold',
    name: 'פפיון זהב',
    emoji: '🎀',
    price: 30,
    type: 'bow',
    description: 'זהב נוצץ!',
    color: '#FFD700',
    color2: '#DAA520',
  },
];

export function getItemsByType(type: ClothingItem['type']): ClothingItem[] {
  return CLOTHING_ITEMS.filter(item => item.type === type);
}