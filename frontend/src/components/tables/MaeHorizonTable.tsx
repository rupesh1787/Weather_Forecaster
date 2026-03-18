import type { HorizonMetric } from '../../types';
import { formatNumber } from '../shared/format';
import SkeletonBlock from '../shared/SkeletonBlock';

interface MaeHorizonTableProps {
  rows: HorizonMetric[];
  loading: boolean;
}

export default function MaeHorizonTable({ rows, loading }: MaeHorizonTableProps) {
  if (loading) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="mt-4 h-36 w-full" />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel animate-rise">
      <h2 className="text-base font-semibold text-textPrimary">Advanced Analysis Section</h2>
      <p className="mb-4 mt-1 text-xs text-textSecondary">
        Compare average prediction error across different forecast delays.
      </p>
      <h3 className="mb-3 text-sm font-semibold text-textPrimary">Average Prediction Error by Forecast Delay</h3>
      <div className="overflow-x-auto rounded-lg border border-appBorder">
        <table className="min-w-full text-sm">
          <thead className="bg-appBg text-left text-xs uppercase tracking-wide text-textSecondary">
            <tr>
              <th className="px-3 py-2">Forecast Delay</th>
              <th className="px-3 py-2">Measurements</th>
              <th className="px-3 py-2">Average Prediction Error</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.horizon} className="border-t border-appBorder text-textPrimary">
                <td className="px-3 py-2 font-mono">{row.horizon}h</td>
                <td className="px-3 py-2">{row.count}</td>
                <td className="px-3 py-2">{formatNumber(row.mae)} MW</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
