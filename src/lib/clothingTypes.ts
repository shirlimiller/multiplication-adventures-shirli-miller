// Clothing shop types and data — 5 categories, 5+ items each

export type ClothingCategory = 'shirt' | 'pants' | 'shoes' | 'hat' | 'sunglasses';

export interface ClothingItem {
  id: string;
  name: string;
  price: number;
  type: ClothingCategory;
  description: string;
  color: string;
  color2: string;
  preview: string; // emoji for grid preview
}

export interface PlayerClothing {
  ownedItems: string[];
  equippedItems: {
    hat?: string;
    sunglasses?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
  };
}

export const DEFAULT_PLAYER_CLOTHING: PlayerClothing = {
  ownedItems: [],
  equippedItems: {},
};

export const CLOTHING_CATEGORIES: { type: ClothingCategory; label: string; emoji: string }[] = [
  { type: 'shirt', label: 'חולצות', emoji: '👕' },
  { type: 'pants', label: 'מכנסיים', emoji: '👖' },
  { type: 'shoes', label: 'נעליים', emoji: '👟' },
  { type: 'hat', label: 'כובעים', emoji: '🎩' },
  { type: 'sunglasses', label: 'משקפי שמש', emoji: '🕶️' },
];

export const CLOTHING_ITEMS: ClothingItem[] = [
  // ===== SHIRTS (6) =====
  { id: 'shirt_blue', name: 'חולצה כחולה', price: 20, type: 'shirt', description: 'קלאסית ויפה!', color: '#4488CC', color2: '#2266AA', preview: '👕' },
  { id: 'shirt_red', name: 'חולצה אדומה', price: 22, type: 'shirt', description: 'אש!', color: '#DD4444', color2: '#BB2222', preview: '👕' },
  { id: 'shirt_green', name: 'חולצה ירוקה', price: 20, type: 'shirt', description: 'ירוק טבע!', color: '#44AA44', color2: '#228822', preview: '👕' },
  { id: 'shirt_pink', name: 'חולצה ורודה', price: 22, type: 'shirt', description: 'ורוד מתוק!', color: '#FF88AA', color2: '#DD6688', preview: '👚' },
  { id: 'shirt_star', name: 'חולצת כוכבים', price: 35, type: 'shirt', description: 'זורח כמו כוכב!', color: '#FFD700', color2: '#E8B800', preview: '⭐' },
  { id: 'shirt_hero', name: 'גלימת גיבור', price: 60, type: 'shirt', description: 'גיבור על!', color: '#CC2020', color2: '#991010', preview: '🦸' },

  // ===== PANTS (5) =====
  { id: 'pants_jeans', name: "ג'ינס כחול", price: 30, type: 'pants', description: "ג'ינס קלאסי!", color: '#3366AA', color2: '#224488', preview: '👖' },
  { id: 'pants_red', name: 'מכנסיים אדומים', price: 25, type: 'pants', description: 'צבע חם!', color: '#DD4444', color2: '#BB2222', preview: '👖' },
  { id: 'pants_green', name: 'מכנסיים ירוקים', price: 25, type: 'pants', description: 'סטייל צבאי!', color: '#4A7A3A', color2: '#3A5A2A', preview: '👖' },
  { id: 'pants_purple', name: 'מכנסיים סגולים', price: 28, type: 'pants', description: 'צבע מיוחד!', color: '#8844CC', color2: '#6622AA', preview: '👖' },
  { id: 'pants_yellow', name: 'מכנסיים צהובים', price: 22, type: 'pants', description: 'שמש ושמחה!', color: '#DDBB22', color2: '#BB9900', preview: '👖' },

  // ===== SHOES (5) =====
  { id: 'shoes_red', name: 'נעלי ספורט אדומות', price: 35, type: 'shoes', description: 'מהירות!', color: '#DD3333', color2: '#BB1111', preview: '👟' },
  { id: 'shoes_blue', name: 'נעלי ספורט כחולות', price: 35, type: 'shoes', description: 'ריצה!', color: '#3366DD', color2: '#2244BB', preview: '👟' },
  { id: 'shoes_boots', name: 'מגפיים', price: 40, type: 'shoes', description: 'להרפתקאות!', color: '#8B6914', color2: '#6B4E0A', preview: '🥾' },
  { id: 'shoes_sandals', name: 'סנדלים', price: 15, type: 'shoes', description: 'נוח לקיץ!', color: '#FF8844', color2: '#DD6622', preview: '🩴' },
  { id: 'shoes_fancy', name: 'נעליים אלגנטיות', price: 45, type: 'shoes', description: 'מיוחדות!', color: '#222222', color2: '#111111', preview: '👞' },

  // ===== HATS (6) =====
  { id: 'hat_crown', name: 'כתר זהב', price: 50, type: 'hat', description: 'כתר מלכותי!', color: '#FFD700', color2: '#DAA520', preview: '👑' },
  { id: 'hat_wizard', name: 'כובע קוסם', price: 35, type: 'hat', description: 'קסם של חכמה!', color: '#3B2080', color2: '#2A1060', preview: '🎩' },
  { id: 'hat_party', name: 'כובע מסיבה', price: 25, type: 'hat', description: 'מסיבה!', color: '#FF4570', color2: '#E03060', preview: '🥳' },
  { id: 'hat_cap', name: 'כובע מצחייה', price: 20, type: 'hat', description: 'סטייל!', color: '#2266CC', color2: '#1A4488', preview: '🧢' },
  { id: 'hat_cowboy', name: 'כובע קאובוי', price: 40, type: 'hat', description: 'יי-האא!', color: '#8B6914', color2: '#6B4E0A', preview: '🤠' },
  { id: 'hat_beanie', name: 'כובע צמר', price: 22, type: 'hat', description: 'חמים ונעים!', color: '#CC3333', color2: '#992222', preview: '🧶' },

  // ===== SUNGLASSES (5) =====
  { id: 'sun_classic', name: 'משקפי שמש קלאסיים', price: 30, type: 'sunglasses', description: 'מגניב!', color: '#333333', color2: '#111111', preview: '🕶️' },
  { id: 'sun_star', name: 'משקפי כוכב', price: 40, type: 'sunglasses', description: 'כוכב על!', color: '#FFD700', color2: '#DAA520', preview: '⭐' },
  { id: 'sun_heart', name: 'משקפי לב', price: 35, type: 'sunglasses', description: 'אהבה!', color: '#FF4488', color2: '#CC2266', preview: '❤️' },
  { id: 'sun_round', name: 'משקפיים עגולים', price: 25, type: 'sunglasses', description: 'חכם וחמוד!', color: '#8B7355', color2: '#6B5335', preview: '👓' },
  { id: 'sun_nerd', name: 'משקפי נרד', price: 28, type: 'sunglasses', description: 'גאון!', color: '#222222', color2: '#000000', preview: '🤓' },
];

export function getItemsByType(type: ClothingCategory): ClothingItem[] {
  return CLOTHING_ITEMS.filter(item => item.type === type);
}
