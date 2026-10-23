// Game state + reducer. Pure: time is always passed in via actions.
import { BALANCE, SECTION_KEYS } from '../config/balance';
import { defaultLevels, incomePerSec, upgradeCost, offlineEarnings, cappedOfflineSeconds } from './economy';

export function createInitialState(now) {
  return {
    money: 0,
    levels: defaultLevels(), // { vitrin, pishkhan, tanoor, decor }
    totalEarned: 0,
    lastSeen: now,
    offlineReport: null, // runtime only, never saved
  };
}

const num = (v, fallback) => (typeof v === 'number' && isFinite(v) ? v : fallback);
const lvl = (v) => Math.max(1, Math.floor(num(v, 1)));

// v2 saves have `levels`; v1 saves had a single `level` -> every section starts at that level.
function sanitizeLevels(saved) {
  const src = saved.levels && typeof saved.levels === 'object' ? saved.levels : null;
  const legacy = lvl(saved.level);
  const out = {};
  SECTION_KEYS.forEach((k) => { out[k] = src ? lvl(src[k]) : legacy; });
  return out;
}

function sanitize(saved, now) {
  return {
    money: Math.max(0, num(saved.money, 0)),
    levels: sanitizeLevels(saved),
    totalEarned: Math.max(0, num(saved.totalEarned, 0)),
    lastSeen: Math.min(now, num(saved.lastSeen, now)),
  };
}

function applyTime(state, now) {
  const dt = Math.max(0, now - state.lastSeen) / 1000;
  if (dt < BALANCE.offlineThresholdSec) {
    const earned = incomePerSec(state.levels) * dt;
    return {
      ...state,
      money: state.money + earned,
      totalEarned: state.totalEarned + earned,
      lastSeen: now,
    };
  }
  const earned = offlineEarnings(state.levels, dt);
  return {
    ...state,
    money: state.money + earned,
    totalEarned: state.totalEarned + earned,
    lastSeen: now,
    offlineReport: { amount: earned, seconds: cappedOfflineSeconds(dt) },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'LOAD': {
      const base = action.saved
        ? { ...createInitialState(action.now), ...sanitize(action.saved, action.now) }
        : createInitialState(action.now);
      return action.saved ? applyTime(base, action.now) : base;
    }
    case 'TICK':
      return applyTime(state, action.now);
    case 'UPGRADE': {
      const key = action.section;
      if (!SECTION_KEYS.includes(key)) return state;
      const cost = upgradeCost(key, state.levels[key]);
      if (state.money < cost) return state;
      return {
        ...state,
        money: state.money - cost,
        levels: { ...state.levels, [key]: state.levels[key] + 1 },
      };
    }
    case 'DISMISS_OFFLINE':
      return { ...state, offlineReport: null };
    default:
      return state;
  }
}
