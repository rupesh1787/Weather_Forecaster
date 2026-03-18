interface SkeletonBlockProps {
  className?: string;
}

export default function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-700/50 dark:bg-slate-700/50 ${className}`}
      aria-hidden
    />
  );
}
