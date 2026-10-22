import Link from 'next/link';
import { MapPin, Users, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { Commune, CommuneIndicator } from '@/lib/types';
import { formatNumber } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = {
  commune: Commune;
  indicators?: CommuneIndicator[];
};

export function CommuneCard({ commune, indicators = [] }: Props) {
  const price = indicators.find((i) => i.indicator_key === 'median_price_m2');
  const transport = indicators.find((i) => i.indicator_key === 'transport_score');
  const green = indicators.find((i) => i.indicator_key === 'green_space_pct');

  return (
    <Link
      href={`/ville/${commune.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:border-primary/30">
        <div className="relative h-28 bg-gradient-to-br from-primary/90 via-primary to-accent/80">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
          <div className="absolute right-3 top-3">
            {commune.is_demo && (
              <Badge variant="outline" className="bg-white/15 text-white border-white/30 text-[10px]">
                Démo
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1 text-xs opacity-90">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {commune.region}
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground">
              {commune.name}
            </h3>
            <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground text-pretty">
            {commune.short_description ?? 'Commune française analysée par InfosVilles.'}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNumber(commune.population)} hab.
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {commune.postal_code}
            </span>
          </div>

          {(price || transport || green) && (
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
              {price && (
                <Stat label="Prix m²" value={price.value_label ?? '—'} trend="neutral" />
              )}
              {transport && (
                <Stat label="Transport" value={transport.value_label ?? '—'} trend="up" />
              )}
              {green && (
                <Stat label="Espaces verts" value={green.value_label ?? '—'} trend="up" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div>
      <div className="flex items-center gap-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-success" aria-hidden="true" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3 text-destructive" aria-hidden="true" />}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
