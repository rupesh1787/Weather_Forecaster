export type ThemeMode = 'dark' | 'light';

export interface DataPoint {
  time: string;
  actual: number | null;
  forecast: number | null;
  error: number | null;
}

export interface ApiResponse {
  horizonHours: number;
  count: number;
  mae: number | null;
  maxError: number | null;
  minError: number | null;
  forecastMissingCount: number;
  forecastMissingRatio: number;
  data: DataPoint[];
}

export interface HorizonMetric {
  horizon: number;
  count: number;
  mae: number | null;
}

export interface DashboardFilters {
  start: string;
  end: string;
  horizon: number;
}

export interface KpiItem {
  label: string;
  value: string;
  helper: string;
  tooltip: string;
}
