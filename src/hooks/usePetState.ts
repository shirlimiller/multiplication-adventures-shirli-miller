import { useState, useCallback, useEffect } from 'react';
import { 
  PetState, 
  DEFAULT_PET_STATE, 
  ShopItem,
  WalkLocation,
  calculateCurrentHunger,
  calculateCurrentHappiness,
} from '@/lib/petTypes';

const PET_STATE_KEY = 'multiplication_game_pet_state';

interface UsePetStateReturn {
  petState: PetState;
  currentHunger: number;
  currentHappiness: number;
  isDoubleStarsActive: boolean;
  feedPet: (item: ShopItem) => void;
  walkPet: (location: WalkLocation) => void;
  interactWithPet: () => void;
  updatePetState: (updates: Partial<PetState>) => void;
  depleteHungerWhilePlaying: () => void;
}

export function usePetState(playerId: string | null): UsePetStateReturn {
  const [petStates, setPetStates] = useState<Record<string, PetState>>(() => {
    const saved = localStorage.getItem(PET_STATE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const petState = playerId ? (petStates[playerId] || DEFAULT_PET_STATE) : DEFAULT_PET_STATE;
  const currentHunger = calculateCurrentHunger(petState);
  const currentHappiness = calculateCurrentHappiness(petState);
  
  // Check if double stars is currently active
  const isDoubleStarsActive = petState.doubleStarsUntil !== null && 
    Date.now() < petState.doubleStarsUntil;

  // Save to localStorage whenever petStates changes
  useEffect(() => {
    localStorage.setItem(PET_STATE_KEY, JSON.stringify(petStates));
  }, [petStates]);

  const updatePetState = useCallback((updates: Partial<PetState>) => {
    if (!playerId) return;
    
    setPetStates(prev => ({
      ...prev,
      [playerId]: {
        ...(prev[playerId] || DEFAULT_PET_STATE),
        ...updates,
      },
    }));
  }, [playerId]);

  const feedPet = useCallback((item: ShopItem) => {
    if (!playerId) return;
    
    const current = petStates[playerId] || DEFAULT_PET_STATE;
    const currentHungerValue = calculateCurrentHunger(current);
    const newHunger = Math.min(100, currentHungerValue + item.hungerRestore);
    
    const updates: Partial<PetState> = {
      hunger: newHunger,
      lastFed: Date.now(),
      totalTreats: current.totalTreats + 1,
    };

    // Handle special effects
    if (item.effect === 'double_stars' && item.effectDuration) {
      updates.doubleStarsUntil = Date.now() + item.effectDuration;
    }

    updatePetState(updates);
  }, [playerId, petStates, updatePetState]);

  const walkPet = useCallback((location: WalkLocation) => {
    if (!playerId) return;
    
    const current = petStates[playerId] || DEFAULT_PET_STATE;
    const currentHappinessValue = calculateCurrentHappiness(current);
    const newHappiness = Math.min(100, currentHappinessValue + location.happinessRestore);
    
    const updates: Partial<PetState> = {
      happiness: newHappiness,
      lastWalk: Date.now(),
      totalWalks: current.totalWalks + 1,
    };

    updatePetState(updates);
  }, [playerId, petStates, updatePetState]);

  const interactWithPet = useCallback(() => {
    if (!playerId) return;
    updatePetState({ lastInteraction: Date.now() });
  }, [playerId, updatePetState]);

  // Deplete hunger and happiness while playing (called during game)
  const depleteHungerWhilePlaying = useCallback(() => {
    if (!playerId) return;
    
    const current = petStates[playerId] || DEFAULT_PET_STATE;
    const currentHungerValue = calculateCurrentHunger(current);
    const currentHappinessValue = calculateCurrentHappiness(current);
    
    // Deplete 0.5% hunger and 0.3% happiness per call (called periodically during game)
    const newHunger = Math.max(0, currentHungerValue - 0.5);
    const newHappiness = Math.max(0, currentHappinessValue - 0.3);
    
    updatePetState({
      hunger: newHunger,
      happiness: newHappiness,
      lastFed: Date.now(), // Reset timer so it doesn't stack with time-based depletion
      lastWalk: Date.now(), // Reset timer for happiness too
    });
  }, [playerId, petStates, updatePetState]);

  return {
    petState,
    currentHunger,
    currentHappiness,
    isDoubleStarsActive,
    feedPet,
    walkPet,
    interactWithPet,
    updatePetState,
    depleteHungerWhilePlaying,
  };
}
