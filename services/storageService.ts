
import { GameState } from '../types';
import { STORAGE_KEY } from '../constants';

export const saveGame = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadGame = (): GameState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse saved game", e);
    return null;
  }
};

export const clearGame = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
