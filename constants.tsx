
import { Phase } from './types';

export const PHASES: Phase[] = [
  { number: 1, description: "2 sets of 3" },
  { number: 2, description: "1 set of 3 + 1 run of 4" },
  { number: 3, description: "1 set of 4 + 1 run of 4" },
  { number: 4, description: "1 run of 7" },
  { number: 5, description: "1 run of 8" },
  { number: 6, description: "1 run of 9" },
  { number: 7, description: "2 sets of 4" },
  { number: 8, description: "7 cards of one color" },
  { number: 9, description: "1 set of 5 + 1 set of 2" },
  { number: 10, description: "1 set of 5 + 1 set of 3" },
];

export const STORAGE_KEY = 'phase10_game_state';
