// Tiny external store. It lives OUTSIDE React so that both the 2D UI and the
// R3F <Canvas> (a separate React root) can read the same state.
import { AppState, type AppStateStatus } from 'react-native';
import { GAME_CONFIG, type UpgradeId } from './config';
import { buyUpgrade, computeOffline, tick, type OfflineReport } from './engine';
import { loadState, saveState } from './persistence';
import { createInitialState, type GameState } from './state';

export interface StoreState {
  game: GameState;
  ready: boolean;
  offlineReport: OfflineReport | null;
}

let store: StoreState = { game: createInitialState(), ready: false, offlineReport: null };
const listeners = new Set<() => void>();

function setStore(patch: Partial<StoreState>) {
  store = { ...store, ...patch };
  listeners.forEach((l) => l());
}

export const getSnapshot = () => store;
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------- loop ----------
let timer: ReturnType<typeof setInterval> | null = null;
let lastTick = 0;
let msSinceSave = 0;
let startPromise: Promise<void> | null = null;

function persist(now: number = Date.now()) {
  const game = { ...store.game, savedAt: now };
  setStore({ game });
  void saveState(game);
}

function applyOffline(now: number) {
  const report = computeOffline(store.game, now);
  setStore({
    game: { ...store.game, coins: store.game.coins + report.earned, savedAt: now },
    offlineReport: report.seconds >= GAME_CONFIG.minOfflineReportSeconds ? report : store.offlineReport,
  });
}

function onTick() {
  const now = Date.now();
  const dt = Math.min((now - lastTick) / 1000, 1); // clamp: big gaps are handled as "offline"
  lastTick = now;
  setStore({ game: tick(store.game, dt) });

  msSinceSave += dt * 1000;
  if (msSinceSave >= GAME_CONFIG.autosaveMs) {
    msSinceSave = 0;
    persist(now);
  }
}

function startLoop() {
  stopLoop();
  lastTick = Date.now();
  timer = setInterval(onTick, GAME_CONFIG.tickMs);
}

function stopLoop() {
  if (timer) clearInterval(timer);
  timer = null;
}

function onAppStateChange(status: AppStateStatus) {
  if (status === 'active') {
    if (!timer) {
      applyOffline(Date.now()); // coming back from background = offline time
      startLoop();
    }
  } else {
    stopLoop();
    persist();
  }
}

async function init() {
  const saved = await loadState();
  if (saved) {
    store = { ...store, game: saved };
    applyOffline(Date.now());
  }
  setStore({ ready: true });
  startLoop();
  AppState.addEventListener('change', onAppStateChange);
}

export function startGame(): Promise<void> {
  if (!startPromise) startPromise = init();
  return startPromise;
}

// ---------- actions ----------
export const gameActions = {
  buyUpgrade(id: UpgradeId) {
    const next = buyUpgrade(store.game, id);
    if (next === store.game) return;
    setStore({ game: next });
    persist();
  },
  dismissOfflineReport() {
    setStore({ offlineReport: null });
  },
};
