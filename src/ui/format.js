const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export const toFa = (s) => String(s).replace(/\d/g, (d) => FA[d]);

export function formatNumber(n) {
  if (n < 10000) return toFa(Math.floor(n));
  const units = [
    [1e12, 'تریلیون'],
    [1e9, 'میلیارد'],
    [1e6, 'میلیون'],
    [1e3, 'هزار'],
  ];
  for (const [v, name] of units) {
    if (n >= v) return toFa((n / v).toFixed(1).replace('.', '٫')) + ' ' + name;
  }
  return toFa(Math.floor(n));
}

// Full number with thousands separators (۱۲۴,۵۰۰). Falls back to the short form for huge values.
export function formatGrouped(n) {
  if (n >= 1e9) return formatNumber(n);
  return toFa(String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}

export function formatRate(n) {
  return n < 100 ? toFa(n.toFixed(1).replace('.', '٫')) : formatNumber(n);
}
