// All tunable numbers live here.
//
// Economy model (step 1):
//   customers/sec  <- ویترین  (vitrin)
//   sales/sec      <- پیشخوان (pishkhan)
//   bread/sec      <- تنور و حمل (tanoor)
//   throughput     =  min(customers, sales, bread)   <- the weakest section limits everything
//   price per sale =  basePrice + decor bonus          <- دکور (decor) adds money per customer
//   income/sec     =  throughput * price per sale
export const SECTION_KEYS = ['vitrin', 'pishkhan', 'tanoor', 'decor'];
export const FLOW_KEYS = ['vitrin', 'pishkhan', 'tanoor']; // sections that can be the bottleneck

export const BALANCE = {
  saveKey: 'bakery_save_v1', // same key; save format is versioned inside (v:2), v1 saves are migrated
  saveVersion: 2,
  tickMs: 250,
  saveEveryMs: 5000,

  basePrice: 1, // coins per sold loaf at decor level 1

  sections: {
    // rate(level) = rateBase * rateGrowth^(level-1)   (units per second)
    // cost(level) = costBase * costGrowth^(level-1)   (cost of going level -> level+1)
    vitrin:   { rateBase: 1.0, rateGrowth: 1.15, costBase: 15, costGrowth: 1.32 },
    pishkhan: { rateBase: 1.5, rateGrowth: 1.15, costBase: 20, costGrowth: 1.32 },
    tanoor:   { rateBase: 1.2, rateGrowth: 1.15, costBase: 25, costGrowth: 1.32 },
    // decor: extra coins per customer = extraPerLevel * (level-1)
    decor:    { extraPerLevel: 0.25, costBase: 30, costGrowth: 1.4 },
  },

  offlineThresholdSec: 10,   // gaps longer than this count as "offline"
  offlineCapSec: 8 * 3600,   // max 8h of offline income
  offlineEfficiency: 0.5,    // offline pays 50%
};
