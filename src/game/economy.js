// Pure economy functions. No React, no storage.
import { BALANCE, SECTION_KEYS, FLOW_KEYS } from '../config/balance';

export function defaultLevels() {
  const levels = {};
  SECTION_KEYS.forEach((k) => { levels[k] = 1; });
  return levels;
}

// Units/sec produced by a flow section (vitrin = customers, pishkhan = sales, tanoor = bread).
export function flowRate(key, level) {
  const s = BALANCE.sections[key];
  return s.rateBase * Math.pow(s.rateGrowth, level - 1);
}

// Extra coins per customer from decor.
export function decorExtra(level) {
  return BALANCE.sections.decor.extraPerLevel * (level - 1);
}

export function upgradeCost(key, level) {
  const s = BALANCE.sections[key];
  return Math.floor(s.costBase * Math.pow(s.costGrowth, level - 1));
}

// Full picture of the economy for a set of section levels.
export function analyze(levels) {
  const flows = {};
  FLOW_KEYS.forEach((k) => { flows[k] = flowRate(k, levels[k]); });
  let bottleneck = FLOW_KEYS[0];
  FLOW_KEYS.forEach((k) => { if (flows[k] < flows[bottleneck]) bottleneck = k; });
  const throughput = flows[bottleneck];                 // customers actually served & paid per sec
  const price = BALANCE.basePrice + decorExtra(levels.decor);
  return { flows, bottleneck, throughput, price, income: throughput * price };
}

export function incomePerSec(levels) {
  return analyze(levels).income;
}

// Single "bakery level" used for season progress / HUD: average of the 4 sections (rounded down).
export function overallLevel(levels) {
  const sum = SECTION_KEYS.reduce((a, k) => a + levels[k], 0);
  return Math.max(1, Math.floor(sum / SECTION_KEYS.length));
}

export function cappedOfflineSeconds(seconds) {
  return Math.min(seconds, BALANCE.offlineCapSec);
}

export function offlineEarnings(levels, seconds) {
  return incomePerSec(levels) * cappedOfflineSeconds(seconds) * BALANCE.offlineEfficiency;
}
