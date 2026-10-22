// Game state + reducer. Pure: time is always passed in via actions.
import { BALANCE } from '../config/balance';
import { incomePerSec, upgradeCost, offlineEarnings, cappedOfflineSeconds } from './economy';

export function createInitialState(now) {
  return {
    money: 0,
    level: 1,
    totalEarned: 0,
    lastSeen: now,
    offlineReport: null, // runtime only, never saved
  };
}

const num = (v, fallback) => (typeof v === 'number' && isFinite(v) ? v : fallback);

function sanitize(saved, now) {
  return {
    money: Math.max(0, num(saved.money, 0)),
    level: Math.max(1, Math.floor(num(saved.level, 1))),
    totalEarned: Math.max(0, num(saved.totalEarned, 0)),
    lastSeen: Math.min(now, num(saved.lastSeen, now)),
  };
}

function applyTime(state, now) {
  const dt = Math.max(0, now - state.lastSeen) / 1000;
  if (dt < BALANCE.offlineThresholdSec) {
    const earned = incomePerSec(state.level) * dt;
    return {
      ...state,
      money: state.money + earned,
      totalEarned: state.totalEarned + earned,
      lastSeen: now,
    };
  }
  const earned = offlineEarnings(state.level, dt);
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
      const cost = upgradeCost(state.level);
      if (state.money < cost) return state;
      return { ...state, money: state.money - cost, level: state.level + 1 };
    }
    case 'DISMISS_OFFLINE':
      return { ...state, offlineReport: null };
    default:
      return state;
  }
}
