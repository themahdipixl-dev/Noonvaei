export type UpgradeId = 'oven' | 'baker';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  incomePerLevel: number; // coins per second, per level
}

// Add new upgrades here (e.g. 'apprentice', 'lavash_oven') and extend UpgradeId.
export const UPGRADES: readonly UpgradeDef[] = [
  { id: 'oven', name: 'تنور', description: 'نان بیشتر، درآمد بیشتر', baseCost: 10, costGrowth: 1.15, incomePerLevel: 1 },
  { id: 'baker', name: 'شاطر', description: 'پخت سریع‌تر', baseCost: 40, costGrowth: 1.17, incomePerLevel: 2 },
];

export const UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map((u) => [u.id, u])) as Record<UpgradeId, UpgradeDef>;

export const GAME_CONFIG = {
  tickMs: 100,
  autosaveMs: 10_000,
  offlineCapSeconds: 8 * 3600, // max offline time that pays out
  offlineEfficiency: 0.5, // offline income = 50% of online income
  minOfflineReportSeconds: 10, // don't show the popup for tiny gaps
  saveKey: 'bakery-tycoon:save',
  saveVersion: 1,
} as const;
