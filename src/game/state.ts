import type { UpgradeId } from './config';

export interface GameState {
  coins: number;
  levels: Record<UpgradeId, number>;
  savedAt: number; // epoch ms of last save / last time the game was running
}

export function createInitialState(now: number = Date.now()): GameState {
  return {
    coins: 0,
    levels: { oven: 1, baker: 1 },
    savedAt: now,
  };
}
