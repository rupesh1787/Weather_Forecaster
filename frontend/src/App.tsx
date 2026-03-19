import { useMemo, useState } from 'react';
import FiltersPanel from './components/filters/FiltersPanel';
import KpiCards from './components/cards/KpiCards';
import InsightSummary from './components/cards/InsightSummary';
import ForecastChart from './components/charts/ForecastChart';
import ErrorChart from './components/charts/ErrorChart';
import MaeHorizonTable from './components/tables/MaeHorizonTable';
import RawDataTable from './components/tables/RawDataTable';
import EmptyState from './components/shared/EmptyState';
import { toInputValue, useForecastDashboard } from './hooks/useForecastDashboard';
import type { DashboardFilters } from './types';

const MIN_PICKER_DATE = new Date('2025-01-01T00:00:00Z');
const DEFAULT_START = new Date('2025-01-01T00:00:00Z');
const DEFAULT_END = new Date('2025-01-02T00:00:00Z');

export default function App() {
  const [draftFilters, setDraftFilters] = useState<DashboardFilters>({
    start: toInputValue(DEFAULT_START),
    end: toInputValue(DEFAULT_END),
    horizon: 1
  });
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>({
    start: toInputValue(DEFAULT_START),
    end: toInputValue(DEFAULT_END),
    horizon: 1
  });

  const maxPickerDate = useMemo(() => new Date(), []);

  const {
    isLoading,
    isFetching,
    isError,
    error,
    points,
    kpis,
    quickSummary,
    insightSummary,
    horizonMetrics,
    empty
  } = useForecastDashboard(appliedFilters);

  const showLoading = isLoading || isFetching;

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  return (
    <div className="min-h-screen bg-appBg bg-dashboard texture-grid text-textPrimary transition-colors duration-300">
      <header className="sticky top-0 z-20 border-b border-appBorder bg-appBg backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Wind Forecast Monitoring</h1>
            <p className="text-xs text-textSecondary sm:text-sm">
              Compare predicted wind power with actual wind generation and analyze forecast accuracy.
            </p>
          </div>
          <span className="rounded-full border border-appBorder bg-card px-3 py-1 text-xs font-medium text-textSecondary">
            Classy Blue Theme
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <InsightSummary loading={showLoading} title="Quick Summary" text={quickSummary} />

        <FiltersPanel
          filters={draftFilters}
          minTime={toInputValue(MIN_PICKER_DATE)}
          maxTime={toInputValue(maxPickerDate)}
          loading={showLoading}
          onChange={setDraftFilters}
          onApply={applyFilters}
        />

        {isError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {(error as Error)?.message || 'Failed to load dashboard data.'}
          </div>
        )}

        {!isError && empty && !showLoading ? (
          <EmptyState
            title="No wind data available for the selected time range."
            message="Try a different time range or forecast delay to load chart data."
          />
        ) : (
          <>
            <ForecastChart data={points} loading={showLoading} />
            <InsightSummary loading={showLoading} title="Insight Summary" text={insightSummary} />
            <KpiCards items={kpis} loading={showLoading} />
            <ErrorChart data={points} loading={showLoading} />
            <MaeHorizonTable rows={horizonMetrics} loading={showLoading} />
            <RawDataTable rows={points} loading={showLoading} />
          </>
        )}
      </main>
    </div>
  );
}
