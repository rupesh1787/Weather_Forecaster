import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { DataPoint } from '../../types';
import SkeletonBlock from '../shared/SkeletonBlock';
import EmptyState from '../shared/EmptyState';
import { formatChartTimestamp, formatNumber } from '../shared/format';

interface ErrorChartProps {
  data: DataPoint[];
  loading: boolean;
}

interface ErrorRow extends DataPoint {
  timeLabel: string;
  absError: number;
}

function errorColor(value: number, max: number): string {
  const normalized = max <= 0 ? 0 : value / max;
  if (normalized < 0.35) return '#22C55E';
  if (normalized < 0.7) return '#60A5FA';
  return '#F97316';
}

export default function ErrorChart({ data, loading }: ErrorChartProps) {
  const chartData = useMemo<ErrorRow[]>(() => {
    return data
      .filter((point) => point.error != null)
      .map((point) => ({
        ...point,
        timeLabel: formatChartTimestamp(point.time),
        absError: Math.abs(point.error as number)
      }));
  }, [data]);

  const maxError = useMemo(() => {
    return chartData.length ? Math.max(...chartData.map((item) => item.absError)) : 0;
  }, [chartData]);

  if (loading) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="mt-4 h-[260px] w-full" />
      </section>
    );
  }

  if (!chartData.length) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <EmptyState
          title="No wind data available for the selected time range."
          message="Prediction error appears when both actual and predicted wind power are available."
        />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel animate-rise">
      <h2 className="text-base font-semibold text-textPrimary">Prediction Error Over Time</h2>
      <p className="mb-4 mt-1 text-xs text-textSecondary">
        Shows how far predictions were from the actual wind power.
      </p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 24 }}>
            <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="timeLabel" hide />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: '#1F293755' }}
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#1F2937',
                borderRadius: 12,
                color: '#E5E7EB'
              }}
              formatter={(value, name, props) => {
                const numericValue =
                  typeof value === 'number' ? value : Number.isFinite(Number(value)) ? Number(value) : null;

                if (name === 'absError') {
                  const row = props.payload as ErrorRow;
                  return [
                    `${formatNumber(numericValue)} MW | actual ${formatNumber(row.actual)} | predicted ${formatNumber(row.forecast)}`,
                    'Prediction Error'
                  ];
                }
                return [String(value ?? 'N/A'), name];
              }}
            />
            <Bar dataKey="absError" name="absError" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={`${entry.time}-err`} fill={errorColor(entry.absError, maxError)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
