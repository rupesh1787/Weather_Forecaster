import { useMemo, useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DataPoint } from '../../types';
import { formatDateTime, formatNumber } from '../shared/format';
import SkeletonBlock from '../shared/SkeletonBlock';

type SortKey = 'time' | 'actual' | 'forecast' | 'error';

type SortDirection = 'asc' | 'desc';

interface RawDataTableProps {
  rows: DataPoint[];
  loading: boolean;
}

const PAGE_SIZE = 10;

export default function RawDataTable({ rows, loading }: RawDataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    const copy = [...rows];

    copy.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];

      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;

      if (sortKey === 'time') {
        const leftTime = new Date(String(left)).getTime();
        const rightTime = new Date(String(right)).getTime();
        return sortDirection === 'asc' ? leftTime - rightTime : rightTime - leftTime;
      }

      const leftNumber = Number(left);
      const rightNumber = Number(right);
      return sortDirection === 'asc' ? leftNumber - rightNumber : rightNumber - leftNumber;
    });

    return copy;
  }, [rows, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return sortedRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [safePage, sortedRows]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection(key === 'time' ? 'desc' : 'asc');
  };

  const exportCsv = () => {
    const lines = [
      'Time,Actual Wind Power,Predicted Wind Power,Prediction Error',
      ...sortedRows.map(
        (row) =>
          `${new Date(row.time).toISOString()},${row.actual ?? ''},${row.forecast ?? ''},${row.error ?? ''}`
      )
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'wind-forecast-data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <SkeletonBlock className="h-5 w-28" />
        <SkeletonBlock className="mt-4 h-52 w-full" />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel animate-rise">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-textPrimary">Data Table</h2>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!sortedRows.length}
          className="inline-flex items-center gap-1 rounded-lg border border-appBorder bg-appBg px-3 py-1.5 text-xs text-textSecondary transition hover:border-accent hover:text-textPrimary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-appBorder">
        <table className="min-w-full text-sm">
          <thead className="bg-appBg text-left text-xs uppercase tracking-wide text-textSecondary">
            <tr>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('time')}>
                Time
              </th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('actual')}>
                Actual Wind Power
              </th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('forecast')}>
                Predicted Wind Power
              </th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('error')}>
                Prediction Error
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row) => (
              <tr key={row.time} className="border-t border-appBorder text-textPrimary">
                <td className="px-3 py-2 font-mono text-xs">{formatDateTime(row.time)}</td>
                <td className="px-3 py-2">{formatNumber(row.actual, 2)}</td>
                <td className="px-3 py-2">{formatNumber(row.forecast, 2)}</td>
                <td className="px-3 py-2">{formatNumber(row.error, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-textSecondary">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={safePage <= 1}
          className="rounded border border-appBorder px-2 py-1 transition hover:border-accent disabled:opacity-50"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <span>
          Page {safePage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={safePage >= totalPages}
          className="rounded border border-appBorder px-2 py-1 transition hover:border-accent disabled:opacity-50"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </section>
  );
}
