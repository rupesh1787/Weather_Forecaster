export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return value.toFixed(digits);
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-GB', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatChartTimestamp(value: string): string {
  return new Date(value).toLocaleString('en-GB', {
    hour12: false,
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
