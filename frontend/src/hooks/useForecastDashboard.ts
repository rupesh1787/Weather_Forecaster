import { useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, DashboardFilters, HorizonMetric, KpiItem } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://weather-forecaster-sogc.onrender.com' : '');
const COMPARISON_HORIZONS = [1, 4, 8, 12, 24, 48];

function datetimeLocalToUtcIso(value: string): string | null {
  if (!value) return null;
  const [datePart, timePart] = value.split('T');
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString();
}

function num(value: number | null | undefined, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return value.toFixed(digits);
}

async function fetchForHorizon(
  start: string,
  end: string,
  horizon: number
): Promise<ApiResponse> {
  const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/data`, {
    params: {
      start,
      end,
      horizon
    }
  });

  return response.data;
}

export function toInputValue(date: Date): string {
  return date.toISOString().slice(0, 16);
}

export function useForecastDashboard(filters: DashboardFilters) {
  const query = useQuery({
    queryKey: ['dashboard-data', filters.start, filters.end, filters.horizon],
    enabled: Boolean(filters.start && filters.end),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchInterval: 2 * 60_000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const start = datetimeLocalToUtcIso(filters.start);
      const end = datetimeLocalToUtcIso(filters.end);

      if (!start || !end) {
        throw new Error('Start and end time are required');
      }

      const [main, ...comparisons] = await Promise.all([
        fetchForHorizon(start, end, filters.horizon),
        ...COMPARISON_HORIZONS.filter((h) => h !== filters.horizon).map((h) =>
          fetchForHorizon(start, end, h)
        )
      ]);

      const horizonMetrics: HorizonMetric[] = [
        {
          horizon: filters.horizon,
          count: main.data?.length ?? 0,
          mae: main.mae ?? null
        },
        ...comparisons.map((item, index) => ({
          horizon: COMPARISON_HORIZONS.filter((h) => h !== filters.horizon)[index],
          count: item.data?.length ?? 0,
          mae: item.mae ?? null
        }))
      ].sort((a, b) => a.horizon - b.horizon);

      return {
        main,
        horizonMetrics
      };
    }
  });

  const stats = useMemo(() => {
    const points = query.data?.main.data ?? [];

    const actualPoints = points.filter((d) => d.actual != null).map((d) => d.actual as number);
    const forecastPoints = points
      .filter((d) => d.forecast != null)
      .map((d) => d.forecast as number);
    const errors = points
      .filter((d) => d.error != null)
      .map((d) => Math.abs(d.error as number));

    const avgActual = actualPoints.length
      ? actualPoints.reduce((sum, v) => sum + v, 0) / actualPoints.length
      : null;
    const avgForecast = forecastPoints.length
      ? forecastPoints.reduce((sum, v) => sum + v, 0) / forecastPoints.length
      : null;

    const mae = query.data?.main.mae ?? null;
    const maxError = errors.length ? Math.max(...errors) : query.data?.main.maxError ?? null;
    const peakWindPower = actualPoints.length ? Math.max(...actualPoints) : null;

    const accuracy =
      avgActual && avgActual > 0 && mae != null
        ? Math.max(0, Math.min(100, (1 - mae / avgActual) * 100))
        : null;

    const kpis: KpiItem[] = [
      {
        label: 'Prediction Accuracy',
        value: accuracy == null ? 'N/A' : `${num(accuracy)}%`,
        helper: 'How close predictions were to measured wind power.',
        tooltip: 'Calculated from average prediction error relative to actual wind power.'
      },
      {
        label: 'Average Prediction Error',
        value: mae == null ? 'N/A' : `${num(mae)} MW`,
        helper: 'Average difference between predicted and actual wind power.',
        tooltip: 'This is the mean absolute error across all available timestamps.'
      },
      {
        label: 'Largest Prediction Gap',
        value: maxError == null ? 'N/A' : `${num(maxError)} MW`,
        helper: 'Biggest miss between prediction and actual output.',
        tooltip: 'Maximum absolute prediction error in the selected period.'
      },
      {
        label: 'Peak Wind Power',
        value: peakWindPower == null ? 'N/A' : `${num(peakWindPower, 0)} MW`,
        helper: 'Highest measured wind power in this range.',
        tooltip: 'Peak value from actual wind power measurements.'
      },
      {
        label: 'Measurements',
        value: String(points.length),
        helper: 'Number of timestamps included in this analysis.',
        tooltip: 'Total records available after applying your filters.'
      }
    ];

    const peakSentence =
      peakWindPower == null
        ? 'Wind power peak could not be determined for the selected period.'
        : `Wind power peaked at ${num(peakWindPower, 0)} MW during the selected period.`;

    const accuracySentence =
      accuracy == null
        ? 'Forecast accuracy is not available for this range.'
        : `Forecast accuracy is ${num(accuracy)}%.`;

    const insightSummary = `${peakSentence} ${accuracySentence}`;

    let quickSummary = 'Select a time range and click Apply Filters to see how predictions performed.';
    if (points.length > 0) {
      const qualityText =
        accuracy == null
          ? 'prediction quality could not be estimated'
          : accuracy >= 90
            ? 'predictions were very close to real values'
            : accuracy >= 75
              ? 'predictions were fairly close to real values'
              : 'predictions were often far from real values';

      const peakText =
        peakWindPower == null ? 'peak wind power was unavailable' : `peak wind power was ${num(peakWindPower, 0)} MW`;

      quickSummary = `Quick summary: ${qualityText}, and ${peakText} in this selected period.`;
    }

    return {
      points,
      kpis,
      mae,
      maxError,
      quickSummary,
      insightSummary,
      horizonMetrics: query.data?.horizonMetrics ?? [],
      empty: points.length === 0
    };
  }, [query.data]);

  return {
    ...query,
    ...stats
  };
}
