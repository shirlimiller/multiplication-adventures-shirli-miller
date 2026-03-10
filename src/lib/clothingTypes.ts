// Clothing shop types and data — 6 categories with varied styles

export type ClothingCategory = 'shirt' | 'pants' | 'shoes' | 'hat' | 'sunglasses' | 'dress';

export interface ClothingItem {
  id: string;
  name: string;
  price: number;
  type: ClothingCategory;
  description: string;
  color: string;
  color2: string;
  preview: string; // emoji for grid preview
  style?: string; // sub-style for varied shapes (e.g. 'tank', 'hoodie', 'shorts')
}

export interface PlayerClothing {
  ownedItems: string[];
  equippedItems: {
    hat?: string;
    sunglasses?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    dress?: string;
  };
}

export const DEFAULT_PLAYER_CLOTHING: PlayerClothing = {
  ownedItems: [],
  equippedItems: {},
};

export const CLOTHING_CATEGORIES: { type: ClothingCategory; label: string; emoji: string }[] = [
  { type: 'dress', label: 'שמלות', emoji: '👗' },
  { type: 'shirt', label: 'חולצות', emoji: '👕' },
  { type: 'pants', label: 'מכנסיים', emoji: '👖' },
  { type: 'shoes', label: 'נעליים', emoji: '👟' },
  { type: 'hat', label: 'כובעים', emoji: '🎩' },
  { type: 'sunglasses', label: 'משקפיים', emoji: '🕶️' },
];

export const CLOTHING_ITEMS: ClothingItem[] = [
  // ===== DRESSES (6) =====
  { id: 'dress_princess', name: 'שמלת נסיכה', price: 55, type: 'dress', description: 'שמלה מלכותית!', color: '#FF88CC', color2: '#DD66AA', preview: '👗', style: 'ballgown' },
  { id: 'dress_summer', name: 'שמלת קיץ', price: 30, type: 'dress', description: 'קלילה ונוחה!', color: '#FFD700', color2: '#E8B800', preview: '👗', style: 'aline' },
  { id: 'dress_party', name: 'שמלת מסיבה', price: 45, type: 'dress', description: 'נוצצת!', color: '#8844DD', color2: '#6622BB', preview: '👗', style: 'ballgown' },
  { id: 'dress_sailor', name: 'שמלת מלחים', price: 35, type: 'dress', description: 'סגנון ימי!', color: '#2255BB', color2: '#113388', preview: '👗', style: 'aline' },
  { id: 'dress_flower', name: 'שמלת פרחים', price: 40, type: 'dress', description: 'פרחונית ויפה!', color: '#44BB88', color2: '#228866', preview: '🌸', style: 'aline' },
  { id: 'dress_tutu', name: 'חצאית טוטו', price: 50, type: 'dress', description: 'כמו רקדנית!', color: '#FF66AA', color2: '#DD4488', preview: '🩰', style: 'tutu' },

  // ===== SHIRTS (9) — with varied styles =====
  { id: 'shirt_blue', name: 'חולצה כחולה', price: 20, type: 'shirt', description: 'קלאסית ויפה!', color: '#4488CC', color2: '#2266AA', preview: '👕', style: 'tshirt' },
  { id: 'shirt_red', name: 'חולצה אדומה', price: 22, type: 'shirt', description: 'אש!', color: '#DD4444', color2: '#BB2222', preview: '👕', style: 'tshirt' },
  { id: 'shirt_green', name: 'חולצה ירוקה', price: 20, type: 'shirt', description: 'ירוק טבע!', color: '#44AA44', color2: '#228822', preview: '👕', style: 'tshirt' },
  { id: 'shirt_pink', name: 'חולצה ורודה', price: 22, type: 'shirt', description: 'ורוד מתוק!', color: '#FF88AA', color2: '#DD6688', preview: '👚', style: 'tshirt' },
  { id: 'shirt_star', name: 'חולצת כוכבים', price: 35, type: 'shirt', description: 'זורח כמו כוכב!', color: '#FFD700', color2: '#E8B800', preview: '⭐', style: 'tshirt' },
  { id: 'shirt_hero', name: 'גלימת גיבור', price: 60, type: 'shirt', description: 'גיבור על!', color: '#CC2020', color2: '#991010', preview: '🦸', style: 'tshirt' },
  { id: 'shirt_tank', name: 'גופייה ספורטיבית', price: 18, type: 'shirt', description: 'נוח לספורט!', color: '#FF6644', color2: '#DD4422', preview: '🏃', style: 'tank' },
  { id: 'shirt_hoodie', name: 'קפוצ׳ון', price: 40, type: 'shirt', description: 'חמים ומגניב!', color: '#5566CC', color2: '#3344AA', preview: '🧥', style: 'hoodie' },
  { id: 'shirt_polo', name: 'חולצת פולו', price: 28, type: 'shirt', description: 'אלגנטי!', color: '#228855', color2: '#116633', preview: '👔', style: 'polo' },

  // ===== PANTS (8) — with varied cuts =====
  { id: 'pants_jeans', name: "ג'ינס כחול", price: 30, type: 'pants', description: "ג'ינס קלאסי!", color: '#3366AA', color2: '#224488', preview: '👖', style: 'long' },
  { id: 'pants_red', name: 'מכנסיים אדומים', price: 25, type: 'pants', description: 'צבע חם!', color: '#DD4444', color2: '#BB2222', preview: '👖', style: 'long' },
  { id: 'pants_green', name: 'מכנסיים ירוקים', price: 25, type: 'pants', description: 'סטייל צבאי!', color: '#4A7A3A', color2: '#3A5A2A', preview: '👖', style: 'long' },
  { id: 'pants_purple', name: 'מכנסיים סגולים', price: 28, type: 'pants', description: 'צבע מיוחד!', color: '#8844CC', color2: '#6622AA', preview: '👖', style: 'long' },
  { id: 'pants_yellow', name: 'מכנסיים צהובים', price: 22, type: 'pants', description: 'שמש ושמחה!', color: '#DDBB22', color2: '#BB9900', preview: '👖', style: 'long' },
  { id: 'pants_shorts_blue', name: 'מכנסיים קצרים', price: 18, type: 'pants', description: 'נוח לקיץ!', color: '#4488BB', color2: '#226699', preview: '🩳', style: 'shorts' },
  { id: 'pants_shorts_sport', name: 'מכנסי ספורט', price: 20, type: 'pants', description: 'לריצה!', color: '#222222', color2: '#111111', preview: '🩳', style: 'shorts' },
  { id: 'pants_overalls', name: 'אוברול', price: 45, type: 'pants', description: 'סטייל מיוחד!', color: '#3366AA', color2: '#224488', preview: '👖', style: 'overalls' },

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
