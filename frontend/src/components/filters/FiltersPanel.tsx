import { useMemo, useState } from 'react';
import { CalendarRange, Clock4, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import type { DashboardFilters } from '../../types';

interface FiltersPanelProps {
  filters: DashboardFilters;
  minTime: string;
  maxTime: string;
  loading: boolean;
  onChange: (next: DashboardFilters) => void;
  onApply: () => void;
}

const HORIZON_PRESETS = [1, 4, 8, 12, 24, 48];

const DATE_PRESETS: Array<{ label: string; hours: number }> = [
  { label: 'Last 24h', hours: 24 },
  { label: 'Last 3 days', hours: 72 },
  { label: 'Last 7 days', hours: 168 },
  { label: 'Last 30 days', hours: 720 },
  { label: 'Last 3 months', hours: 2160 },
  { label: 'Last 6 months', hours: 4320 }
];

function toInputValue(date: Date): string {
  return date.toISOString().slice(0, 16);
}

export default function FiltersPanel({
  filters,
  minTime,
  maxTime,
  loading,
  onChange,
  onApply
}: FiltersPanelProps) {
  const maxDate = useMemo(() => new Date(maxTime), [maxTime]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');

  const applyDatePreset = (hours: number, label: string) => {
    const end = new Date(maxDate);
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);

    setSelectedPreset(label);
    onChange({
      ...filters,
      start: toInputValue(start),
      end: toInputValue(end)
    });
  };

  const onCustomStartChange = (value: string) => {
    setSelectedPreset('Custom');
    onChange({ ...filters, start: value });
  };

  const onCustomEndChange = (value: string) => {
    setSelectedPreset('Custom');
    onChange({ ...filters, end: value });
  };

  const filterSummary = `${selectedPreset} | ${filters.horizon}h delay`;

  const handleApply = () => {
    onApply();
    setCollapsed(true);
  };

  return (
    <section
      className={`rounded-xl border border-appBorder bg-card/95 shadow-panel backdrop-blur animate-rise transition-all ${
        collapsed ? 'p-2.5' : 'p-4'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {!collapsed ? (
          <div>
            <h2 className="text-base font-semibold text-textPrimary">Filter Bar</h2>
            <p className="text-xs text-textSecondary">{filterSummary}</p>
          </div>
        ) : (
          <p className="text-xs text-textSecondary">{filterSummary}</p>
        )}

        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="inline-flex items-center gap-1 rounded-full border border-appBorder px-2 py-0.5 text-xs text-textSecondary">
              <Clock4 className="h-3 w-3" />
              Dynamic preview
            </span>
          )}

          {collapsed && (
            <button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="rounded-lg border border-accent bg-accent px-2.5 py-1 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-lg border border-appBorder bg-appBg px-2 py-1 text-xs text-textSecondary transition hover:border-accent hover:text-textPrimary"
          >
            {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <label className="text-xs text-textSecondary">
              Time Range Start (UTC)
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-appBorder bg-appBg px-3 py-2 text-sm text-textPrimary outline-none transition focus:border-accent"
                min={minTime}
                max={maxTime}
                value={filters.start}
                onChange={(event) => onCustomStartChange(event.target.value)}
              />
            </label>
            <label className="text-xs text-textSecondary">
              Time Range End (UTC)
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-appBorder bg-appBg px-3 py-2 text-sm text-textPrimary outline-none transition focus:border-accent"
                min={minTime}
                max={maxTime}
                value={filters.end}
                onChange={(event) => onCustomEndChange(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-textSecondary">
              <span>Forecast Delay</span>
              <span className="rounded bg-appBg px-2 py-0.5 text-textPrimary">{filters.horizon}h</span>
            </div>
            <input
              type="range"
              min={1}
              max={48}
              value={filters.horizon}
              onChange={(event) => onChange({ ...filters, horizon: Number(event.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-appBorder accent-accent"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {HORIZON_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange({ ...filters, horizon: preset })}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    filters.horizon === preset
                      ? 'border-accent bg-accent/20 text-textPrimary'
                      : 'border-appBorder text-textSecondary hover:border-accent/70 hover:text-textPrimary'
                  }`}
                >
                  {preset}h
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-appBorder pt-4">
            <p className="mb-2 inline-flex items-center gap-1 text-xs text-textSecondary">
              <CalendarRange className="h-3 w-3" />
              Quick Ranges
            </p>
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyDatePreset(preset.hours, preset.label)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selectedPreset === preset.label
                      ? 'border-accent bg-accent/20 text-textPrimary'
                      : 'border-appBorder bg-appBg text-textSecondary hover:border-accent hover:text-textPrimary'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedPreset('Custom')}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition ${
                  selectedPreset === 'Custom'
                    ? 'border-accent bg-accent/20 text-textPrimary'
                    : 'border-appBorder bg-appBg text-textSecondary hover:border-accent hover:text-textPrimary'
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Custom
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Applying...' : 'Apply Filters'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
