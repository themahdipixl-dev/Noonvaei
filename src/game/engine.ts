// Pure functions only: state in -> state out. Easy to unit test.
import { GAME_CONFIG, UPGRADES, UPGRADE_BY_ID, type UpgradeId } from './config';
import type { GameState } from './state';

export interface OfflineReport {
  seconds: number; // seconds actually paid (after cap)
  earned: number;
}

export function upgradeCost(id: UpgradeId, level: number): number {
  const def = UPGRADE_BY_ID[id];
  return Math.ceil(def.baseCost * Math.pow(def.costGrowth, level));
}

export function incomePerSecond(state: GameState): number {
  return UPGRADES.reduce((sum, def) => sum + def.incomePerLevel * state.levels[def.id], 0);
}

export function tick(state: GameState, dtSeconds: number): GameState {
  return { ...state, coins: state.coins + incomePerSecond(state) * dtSeconds };
}

/** Returns the same object reference when the purchase is not possible. */
export function buyUpgrade(state: GameState, id: UpgradeId): GameState {
  const level = state.levels[id];
  const cost = upgradeCost(id, level);
  if (state.coins < cost) return state;
  return {
    ...state,
    coins: state.coins - cost,
    levels: { ...state.levels, [id]: level + 1 },
  };
}

export function computeOffline(state: GameState, now: number): OfflineReport {
  const elapsed = Math.max(0, (now - state.savedAt) / 1000); // clock moved back -> 0
  const seconds = Math.min(elapsed, GAME_CONFIG.offlineCapSeconds);
  const earned = incomePerSecond(state) * seconds * GAME_CONFIG.offlineEfficiency;
  return { seconds, earned };
}
