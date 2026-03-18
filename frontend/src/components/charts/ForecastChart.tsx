import { useMemo, useState } from 'react';
import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { DataPoint } from '../../types';
import SkeletonBlock from '../shared/SkeletonBlock';
import EmptyState from '../shared/EmptyState';
import { formatChartTimestamp, formatNumber } from '../shared/format';

interface ForecastChartProps {
  data: DataPoint[];
  loading: boolean;
}

interface ChartRow extends DataPoint {
  timeLabel: string;
  absError: number | null;
}

export default function ForecastChart({ data, loading }: ForecastChartProps) {
  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});

  const chartData = useMemo<ChartRow[]>(() => {
    return data.map((point) => ({
      ...point,
      timeLabel: formatChartTimestamp(point.time),
      absError: point.error == null ? null : Math.abs(point.error)
    }));
  }, [data]);

  const toggleKey = (key: string) => {
    setHiddenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <SkeletonBlock className="h-5 w-44" />
        <SkeletonBlock className="mt-4 h-[340px] w-full" />
      </section>
    );
  }

  if (!chartData.length) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <EmptyState
          title="No wind data available for the selected time range."
          message="Try a wider time range or a shorter forecast delay to see trend lines."
        />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel animate-rise">
      <h2 className="text-base font-semibold text-textPrimary">Actual vs Predicted Wind Power</h2>
      <p className="mb-4 mt-1 text-xs text-textSecondary">
        Blue line shows actual measured wind power. Green line shows predicted wind power.
      </p>

      <div className="h-[380px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 42 }}>
            <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
            <XAxis
              dataKey="timeLabel"
              minTickGap={18}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              angle={-25}
              height={58}
              textAnchor="end"
            />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#1F2937',
                borderRadius: 12,
                color: '#E5E7EB'
              }}
              formatter={(value, name) => {
                const numericValue =
                  typeof value === 'number' ? value : Number.isFinite(Number(value)) ? Number(value) : null;

                if (name === 'absError' || name === 'Prediction Error Range') {
                  return [`${formatNumber(numericValue)} MW`, 'Prediction Error'];
                }
                return [
                  `${formatNumber(numericValue)} MW`,
                  name === 'actual' || name === 'Actual Wind Power'
                    ? 'Actual Wind Power'
                    : 'Predicted Wind Power'
                ];
              }}
            />
            <Legend
              wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }}
              onClick={(payload) => {
                if (typeof payload?.dataKey === 'string') toggleKey(payload.dataKey);
              }}
            />
            <Area
              type="monotone"
              dataKey="absError"
              name="Prediction Error Range"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.18}
              hide={Boolean(hiddenKeys.absError)}
              isAnimationActive
              animationDuration={450}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Wind Power"
              stroke="#60A5FA"
              strokeWidth={2.4}
              dot={false}
              hide={Boolean(hiddenKeys.actual)}
              isAnimationActive
              animationDuration={450}
              legendType="line"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Predicted Wind Power"
              stroke="#22C55E"
              strokeWidth={2.4}
              dot={false}
              connectNulls
              hide={Boolean(hiddenKeys.forecast)}
              isAnimationActive
              animationDuration={450}
              legendType="line"
            />
            <Brush
              dataKey="timeLabel"
              stroke="#3B82F6"
              travellerWidth={10}
              fill="#0B1220"
              height={26}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
