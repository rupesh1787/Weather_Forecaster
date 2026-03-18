import { motion } from 'framer-motion';
import {
  Activity,
  Gauge,
  Waves,
  Zap,
  TriangleAlert,
  Database,
  CircleHelp
} from 'lucide-react';
import type { KpiItem } from '../../types';
import SkeletonBlock from '../shared/SkeletonBlock';

interface KpiCardsProps {
  items: KpiItem[];
  loading: boolean;
}

const icons = [Activity, Gauge, TriangleAlert, Waves, Database, Zap];

export default function KpiCards({ items, loading }: KpiCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-appBorder bg-card p-4 shadow-panel"
          >
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-3 h-8 w-36" />
            <SkeletonBlock className="mt-3 h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        const Icon = icons[index] ?? Activity;

        return (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
            whileHover={{ y: -3 }}
            className="group rounded-xl border border-appBorder bg-card p-4 shadow-panel transition duration-200 hover:border-accent/60 hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-textSecondary">{item.label}</p>
              <div className="flex items-center gap-2">
                <span
                  title={item.tooltip}
                  className="inline-flex cursor-help text-textSecondary transition group-hover:text-textPrimary"
                >
                  <CircleHelp className="h-3.5 w-3.5" />
                </span>
                <Icon className="h-4 w-4 text-accent transition group-hover:text-actual" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-textPrimary">{item.value}</p>
            <p className="mt-2 text-xs text-textSecondary">{item.helper}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
