// All tunable numbers live here.
export const BALANCE = {
  saveKey: 'bakery_save_v1',
  tickMs: 250,
  saveEveryMs: 5000,

  baseIncome: 1,          // coins/sec at level 1
  incomeGrowth: 1.1,      // per-level multiplier
  upgradeBaseCost: 15,
  upgradeGrowth: 1.3,

  offlineThresholdSec: 10,   // gaps longer than this count as "offline"
  offlineCapSec: 8 * 3600,   // max 8h of offline income
  offlineEfficiency: 0.5,    // offline pays 50%
};
