export const compactNumber = (value: number): string => {
  const absValue = Math.abs(value);
  let suffix = '';
  let compacted = absValue;

  if (absValue >= 1_000_000_000) {
    compacted = absValue / 1_000_000_000;
    suffix = 'B';
  } else if (absValue >= 1_000_000) {
    compacted = absValue / 1_000_000;
    suffix = 'M';
  } else if (absValue >= 1_000) {
    compacted = absValue / 1_000;
    suffix = 'K';
  } else if (absValue > 0 && absValue < 1) {
    if (absValue <= 1e-9) {
      compacted = absValue * 1e12;
      suffix = 'p';
    } else if (absValue <= 1e-6) {
      compacted = absValue * 1e9;
      suffix = 'n';
    } else if (absValue <= 1e-3) {
      compacted = absValue * 1e6;
      suffix = 'µ';
    } else {
      compacted = absValue * 1e3;
      suffix = 'm';
    }
  } else {
    return value.toString();
  }

  return (value < 0 ? '-' : '') + compacted.toFixed(1) + suffix;
};
