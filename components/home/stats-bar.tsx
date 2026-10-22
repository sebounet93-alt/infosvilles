import { MapPin, BarChart3, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  communeCount: number;
  indicatorCount: number;
};

export function StatsBar({ communeCount, indicatorCount }: Props) {
  return (
    <section className="border-b border-border/60 bg-muted/30">
      <div className="container mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <StatBlock icon={MapPin} value={`${communeCount}`} label="Communes en démonstration" />
        <StatBlock icon={BarChart3} value={`${indicatorCount}`} label="Indicateurs illustrés" />
        <StatBlock icon={FileText} value="En cours" label="Méthodologie en préparation" />
      </div>
    </section>
  );
}

function StatBlock({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <div className="font-serif text-2xl font-semibold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
