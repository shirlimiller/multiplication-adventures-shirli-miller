import { useState, useCallback, useEffect } from 'react';
import { PlayerClothing, DEFAULT_PLAYER_CLOTHING, ClothingItem } from '@/lib/clothingTypes';

const CLOTHING_STATE_KEY = 'multiplication_game_clothing_state';

interface UseClothingStateReturn {
  clothing: PlayerClothing;
  purchaseItem: (item: ClothingItem) => boolean;
  equipItem: (item: ClothingItem) => void;
  unequipItem: (type: ClothingItem['type']) => void;
  ownsItem: (itemId: string) => boolean;
  isEquipped: (itemId: string) => boolean;
}

export function useClothingState(playerId: string | null): UseClothingStateReturn {
  const [clothingStates, setClothingStates] = useState<Record<string, PlayerClothing>>(() => {
    const saved = localStorage.getItem(CLOTHING_STATE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const clothing = playerId ? (clothingStates[playerId] || DEFAULT_PLAYER_CLOTHING) : DEFAULT_PLAYER_CLOTHING;

  // Save to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem(CLOTHING_STATE_KEY, JSON.stringify(clothingStates));
  }, [clothingStates]);

  const updateClothing = useCallback((updates: Partial<PlayerClothing>) => {
    if (!playerId) return;
    
    setClothingStates(prev => ({
      ...prev,
      [playerId]: {
        ...(prev[playerId] || DEFAULT_PLAYER_CLOTHING),
        ...updates,
      },
    }));
  }, [playerId]);

  const purchaseItem = useCallback((item: ClothingItem): boolean => {
    if (!playerId) return false;
    
    const current = clothingStates[playerId] || DEFAULT_PLAYER_CLOTHING;
    if (current.ownedItems.includes(item.id)) {
      return false; // Already owns
    }
    
    updateClothing({
      ownedItems: [...current.ownedItems, item.id],
    });
    
    return true;
  }, [playerId, clothingStates, updateClothing]);

  const equipItem = useCallback((item: ClothingItem) => {
    if (!playerId) return;
    
    const current = clothingStates[playerId] || DEFAULT_PLAYER_CLOTHING;
    updateClothing({
      equippedItems: {
        ...current.equippedItems,
        [item.type]: item.id,
      },
    });
  }, [playerId, clothingStates, updateClothing]);

  const unequipItem = useCallback((type: ClothingItem['type']) => {
    if (!playerId) return;
    
    const current = clothingStates[playerId] || DEFAULT_PLAYER_CLOTHING;
    const newEquipped = { ...current.equippedItems };
    delete newEquipped[type];
    
    updateClothing({
      equippedItems: newEquipped,
    });
  }, [playerId, clothingStates, updateClothing]);

  const ownsItem = useCallback((itemId: string): boolean => {
    return clothing.ownedItems.includes(itemId);
  }, [clothing]);

  const isEquipped = useCallback((itemId: string): boolean => {
    return Object.values(clothing.equippedItems).includes(itemId);
  }, [clothing]);

  return {
    clothing,
    purchaseItem,
    equipItem,
    unequipItem,
    ownsItem,
    isEquipped,
  };
}
