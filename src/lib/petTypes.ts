// Pet care system types and utilities

export interface PetState {
  hunger: number; // 0-100, 100 = full, depletes over time
  lastFed: number; // timestamp
  lastInteraction: number; // timestamp
  totalTreats: number; // lifetime treats consumed
  doubleStarsUntil: number | null; // timestamp when double stars expires
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
  {
    id: 'lollipop',
    name: 'סוכריה על מקל',
    emoji: '🍭',
    price: 5,
    hungerRestore: 15,
    description: 'טעימה ומתוקה!',
  },
  {
    id: 'chocolate',
    name: 'שוקולד',
    emoji: '🍫',
    price: 10,
    hungerRestore: 30,
    description: 'משביע ומטעים!',
  },
  {
    id: 'magic_cupcake',
    name: 'קאפקייק קסום',
    emoji: '🧁',
    price: 25,
    hungerRestore: 50,
    effect: 'double_stars',
    effectDuration: 5 * 60 * 1000, // 5 minutes
    description: 'כוכבים כפולים ל-5 דקות!',
  },
  {
    id: 'pizza',
    name: 'פיצה',
    emoji: '🍕',
    price: 8,
    hungerRestore: 25,
    description: 'אוכל אמיתי!',
  },
  {
    id: 'apple',
    name: 'תפוח',
    emoji: '🍎',
    price: 3,
    hungerRestore: 10,
    description: 'בריא וטעים!',
  },
  {
    id: 'cookie',
    name: 'עוגיה',
    emoji: '🍪',
    price: 4,
    hungerRestore: 12,
    description: 'פריכה ומתוקה!',
  },
];

export const DEFAULT_PET_STATE: PetState = {
  hunger: 100,
  lastFed: Date.now(),
  lastInteraction: Date.now(),
  totalTreats: 0,
  doubleStarsUntil: null,
};

// Hunger depletes over time - about 10% per hour of inactivity
export const HUNGER_DEPLETION_RATE = 10; // per hour
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
