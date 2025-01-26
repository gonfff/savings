export const compactNumber = (value: number): string => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';

  if (value > 0 && value < 1) {
    if (value <= 1e-9) return (value * 1e12).toFixed(1) + 'p';
    if (value <= 1e-6) return (value * 1e9).toFixed(1) + 'n';
    if (value <= 1e-3) return (value * 1e6).toFixed(1) + 'µ';
    return (value * 1e3).toFixed(1) + 'm';
  }

  return value.toString(); // Для значений между 1 и 1000
};
