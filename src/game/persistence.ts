import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONFIG, UPGRADES } from './config';
import { createInitialState, type GameState } from './state';

export async function saveState(state: GameState): Promise<void> {
  try {
    const payload = { version: GAME_CONFIG.saveVersion, ...state };
    await AsyncStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(payload));
  } catch (e) {
    console.warn('save failed', e);
  }
}

export async function loadState(): Promise<GameState | null> {
  try {
    const raw = await AsyncStorage.getItem(GAME_CONFIG.saveKey);
    if (!raw) return null;
    return sanitize(JSON.parse(raw));
  } catch (e) {
    console.warn('load failed', e);
    return null;
  }
}

// Never trust stored data: validate and fill missing fields (also where migrations go).
function sanitize(data: unknown): GameState | null {
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;
  const base = createInitialState();

  const coins = typeof d.coins === 'number' && Number.isFinite(d.coins) && d.coins >= 0 ? d.coins : 0;
  const savedAt = typeof d.savedAt === 'number' && Number.isFinite(d.savedAt) ? d.savedAt : Date.now();

  const levels = { ...base.levels };
  const rawLevels = (d.levels ?? {}) as Record<string, unknown>;
  for (const def of UPGRADES) {
    const v = rawLevels[def.id];
    if (typeof v === 'number' && Number.isInteger(v) && v >= 1) levels[def.id] = v;
  }
  return { coins, levels, savedAt };
}
