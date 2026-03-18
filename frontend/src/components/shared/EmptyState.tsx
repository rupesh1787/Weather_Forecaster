interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-appBorder bg-card/70 p-8 text-center dark:border-appBorder dark:bg-card/70">
      <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
      <p className="mt-2 text-sm text-textSecondary">{message}</p>
    </div>
  );
}
