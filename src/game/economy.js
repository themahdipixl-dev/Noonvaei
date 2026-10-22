// Pure economy functions. No React, no storage.
import { BALANCE } from '../config/balance';

export function incomePerSec(level) {
  return BALANCE.baseIncome * level * Math.pow(BALANCE.incomeGrowth, level - 1);
}

export function upgradeCost(level) {
  return Math.floor(BALANCE.upgradeBaseCost * Math.pow(BALANCE.upgradeGrowth, level - 1));
}

export function cappedOfflineSeconds(seconds) {
  return Math.min(seconds, BALANCE.offlineCapSec);
}

export function offlineEarnings(level, seconds) {
  return incomePerSec(level) * cappedOfflineSeconds(seconds) * BALANCE.offlineEfficiency;
}
