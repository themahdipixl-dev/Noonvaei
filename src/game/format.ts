const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞';
  if (value < 1000) return Math.floor(value).toString();
  const tier = Math.min(Math.floor(Math.log10(value) / 3), SUFFIXES.length - 1);
  const scaled = value / Math.pow(1000, tier);
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${scaled.toFixed(digits)}${SUFFIXES[tier]}`;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} ساعت و ${m} دقیقه`;
  if (m > 0) return `${m} دقیقه`;
  return `${s} ثانیه`;
}
