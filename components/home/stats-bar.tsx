import { MapPin, BarChart3, FileText } from "lucide-react";

export function StatsBar({ communeCount, indicatorCount }: { communeCount: number; indicatorCount: number }) {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm border border-border">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{communeCount}</div>
              <div className="text-sm text-muted-foreground">Communes analysées</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm border border-border">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{indicatorCount}</div>
              <div className="text-sm text-muted-foreground">Indicateurs officiels</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm border border-border">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">Open Data</div>
              <div className="text-sm text-muted-foreground">Sources gouvernementales</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}