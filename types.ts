
export interface RoundEntry {
  playerId: string;
  points: number;
  phaseCompleted: boolean;
}

export interface Round {
  id: string;
  timestamp: number;
  entries: RoundEntry[];
}

export interface Player {
  id: string;
  name: string;
  currentPhase: number; // 1-10
  totalScore: number;
}

export interface GameState {
  players: Player[];
  history: Round[];
  isGameOver: boolean;
  gameStartedAt: number;
}

export interface Phase {
  number: number;
  description: string;
}
