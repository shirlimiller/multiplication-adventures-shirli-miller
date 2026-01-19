// Pet care system types and utilities

export interface PetState {
  hunger: number; // 0-100, 100 = full, depletes over time
  lastFed: number; // timestamp
  lastInteraction: number; // timestamp
  totalTreats: number; // lifetime treats consumed
  doubleStarsUntil: number | null; // timestamp when double stars expires
  happiness: number; // 0-100, 100 = very happy, depletes over time
  lastWalk: number; // timestamp
  totalWalks: number; // lifetime walks taken
}

export interface WalkLocation {
  id: string;
  name: string;
  emoji: string;
  description: string;
  happinessRestore: number;
  duration: number; // in milliseconds (animation duration)
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  hungerRestore: number;
  effect?: 'double_stars';
  effectDuration?: number; // in milliseconds
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Fruits - healthy and affordable
  {
    id: 'apple',
    name: 'תפוח',
    emoji: '🍎',
    price: 12,
    hungerRestore: 5,
    description: 'בריא וטעים!',
  },
  {
    id: 'banana',
    name: 'בננה',
    emoji: '🍌',
    price: 14,
    hungerRestore: 6,
    description: 'מתוק וטעים!',
  },
  {
    id: 'grapes',
    name: 'ענבים',
    emoji: '🍇',
    price: 16,
    hungerRestore: 7,
    description: 'עסיסיים!',
  },
  {
    id: 'watermelon',
    name: 'אבטיח',
    emoji: '🍉',
    price: 20,
    hungerRestore: 10,
    description: 'מרענן!',
  },
  {
    id: 'strawberry',
    name: 'תות',
    emoji: '🍓',
    price: 18,
    hungerRestore: 8,
    description: 'מתוק במיוחד!',
  },
  // Snacks
  {
    id: 'lollipop',
    name: 'סוכריה על מקל',
    emoji: '🍭',
    price: 18,
    hungerRestore: 7,
    description: 'טעימה ומתוקה!',
  },
  {
    id: 'fries',
    name: 'ציפס',
    emoji: '🍟',
    price: 25,
    hungerRestore: 10,
    description: 'פריך וטעים!',
  },
  {
    id: 'chocolate',
    name: 'שוקולד',
    emoji: '🍫',
    price: 22,
    hungerRestore: 8,
    description: 'מתוק ומטעים!',
  },
  // Main meals
  {
    id: 'hamburger',
    name: 'המבורגר',
    emoji: '🍔',
    price: 40,
    hungerRestore: 18,
    description: 'ארוחה משביעה!',
  },
  {
    id: 'pizza',
    name: 'פיצה',
    emoji: '🍕',
    price: 35,
    hungerRestore: 15,
    description: 'אוכל אמיתי!',
  },
  {
    id: 'ice_cream',
    name: 'גלידה',
    emoji: '🍦',
    price: 28,
    hungerRestore: 12,
    description: 'קר ומתוק!',
  },
  // Special items
  {
    id: 'magic_cupcake',
    name: 'קאפקייק קסום',
    emoji: '🧁',
    price: 50,
    hungerRestore: 25,
    effect: 'double_stars',
    effectDuration: 5 * 60 * 1000, // 5 minutes
    description: 'כוכבים כפולים ל-5 דקות!',
  },
];

export const DEFAULT_PET_STATE: PetState = {
  hunger: 20, // Start hungry to encourage earning stars
  lastFed: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
  lastInteraction: Date.now(),
  totalTreats: 0,
  doubleStarsUntil: null,
  happiness: 15, // Start low - pet wants to go for a walk!
  lastWalk: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
  totalWalks: 0,
};

// Happiness depletes over time - about 40% per hour of inactivity
export const HAPPINESS_DEPLETION_RATE = 40; // per hour
export const HAPPINESS_THRESHOLD_SAD = 40; // Below this, pet is sad
export const HAPPINESS_THRESHOLD_VERY_SAD = 20; // Below this, pet is very sad

export function calculateCurrentHappiness(petState: PetState): number {
  const now = Date.now();
  const hoursSinceLastWalk = (now - petState.lastWalk) / (1000 * 60 * 60);
  const depleted = hoursSinceLastWalk * HAPPINESS_DEPLETION_RATE;
  return Math.max(0, Math.min(100, petState.happiness - depleted));
}

export function getWalkMessage(): string {
  const messages = [
    'איזה כיף! זה היה טיול מדהים! 🏃',
    'וואו! אני כל כך שמח! בוא נעשה את זה שוב! 🌟',
    'הטיול הזה היה מושלם! תודה! 💚',
    'אני מלא אנרגיה עכשיו! 🚀',
    'איזה יום נפלא! אני אוהב לטייל איתך! 🌳',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Hunger depletes over time - about 60% per hour of inactivity
// With prices 12-50 and restore 5-25%, filling from 0 to 100 costs ~250-300 stars
export const HUNGER_DEPLETION_RATE = 60; // per hour - moderate depletion
export const HUNGER_ACTIVE_DEPLETION_RATE = 15; // per hour while playing
export const HUNGER_THRESHOLD_HUNGRY = 40; // Below this, pet is hungry
export const HUNGER_THRESHOLD_VERY_HUNGRY = 20; // Below this, pet is very hungry

export function calculateCurrentHunger(petState: PetState): number {
  const now = Date.now();
  const hoursSinceLastFed = (now - petState.lastFed) / (1000 * 60 * 60);
  const depleted = hoursSinceLastFed * HUNGER_DEPLETION_RATE;
  return Math.max(0, Math.min(100, petState.hunger - depleted));
}

export function getPetMood(hunger: number): 'happy' | 'content' | 'hungry' | 'very_hungry' {
  if (hunger >= 70) return 'happy';
  if (hunger >= HUNGER_THRESHOLD_HUNGRY) return 'content';
  if (hunger >= HUNGER_THRESHOLD_VERY_HUNGRY) return 'hungry';
  return 'very_hungry';
}

export function getPetMessage(mood: 'happy' | 'content' | 'hungry' | 'very_hungry', playerName: string): string {
  const messages = {
    happy: [
      `אני כל כך שמח ${playerName}! בוא נשחק! 🎉`,
      `יום נהדר להרפתקה! 🌟`,
      `אני מוכן לעזור לך ללמוד! 💪`,
    ],
    content: [
      `שלום ${playerName}! מה נעשה היום? 😊`,
      `בוא נתרגל קצת! ✨`,
      `אני כאן בשבילך! 🦊`,
    ],
    hungry: [
      `אני קצת רעב... בוא נתרגל כדי להרוויח כוכבים לקניית אוכל! 🍕`,
      `הבטן שלי מקרקרת! נשחק ונרוויח ממתקים? 🍬`,
      `קצת אוכל יעזור לי ללמד אותך טוב יותר! 🌟`,
    ],
    very_hungry: [
      `אני ממש רעב ${playerName}! בוא נתרגל כדי שנוכל לקנות אוכל! 😢`,
      `אני צריך אוכל... בוא נרוויח כוכבים יחד! 💫`,
      `עזור לי לאכול משהו! נשחק ונרוויח! 🍭`,
    ],
  };
  
  const options = messages[mood];
  return options[Math.floor(Math.random() * options.length)];
}

export function getYumMessage(): string {
  const messages = [
    'יאמי! תודה רבה! אתה הכי טוב! 😋',
    'ממממ... טעים! עכשיו יש לי כוח ללמוד איתך! 🌟',
    'וואו! זה היה טעים! בוא נתרגל! 💪',
    'תודה! אני מלא אנרגיה עכשיו! 🚀',
    'נפלא! עכשיו אני יכול לעזור לך טוב יותר! ✨',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getNotEnoughStarsMessage(): string {
  const messages = [
    'זה נראה טעים! בוא נפתור עוד כמה תרגילים כדי לקנות את זה! 🌟',
    'אני רוצה את זה! בוא נשחק ונרוויח עוד כוכבים! 💫',
    'עוד קצת כוכבים ונוכל לקנות! בוא נתרגל! ✨',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
