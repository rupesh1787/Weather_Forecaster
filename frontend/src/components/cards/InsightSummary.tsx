import SkeletonBlock from '../shared/SkeletonBlock';

interface InsightSummaryProps {
  loading: boolean;
  text: string;
  title?: string;
}

export default function InsightSummary({
  loading,
  text,
  title = 'Insight Summary'
}: InsightSummaryProps) {
  if (loading) {
    return (
      <section className="rounded-xl border border-appBorder bg-card p-4 shadow-panel">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="mt-3 h-4 w-full" />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-accent/50 bg-accent/10 p-4 shadow-panel animate-rise">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-textPrimary">{title}</h2>
      <p className="mt-2 text-sm text-textSecondary">{text}</p>
    </section>
  );
}
