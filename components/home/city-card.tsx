import Link from 'next/link';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';
import type { City } from '@/lib/types';
import { formatPopulation, formatDate } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toneForScore } from '@/components/home/score-tone';

type Props = { city: City };

export function CityCard({ city }: Props) {
  const tone = toneForScore(city.scores.overall);

  return (
    <Link
      href={`/ville/${city.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:border-primary/30">
        <div className="relative h-28 bg-gradient-to-br from-primary/90 via-primary to-accent/80">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
          <div className="absolute right-3 top-3">
            <Badge variant="outline" className="bg-white/15 text-white border-white/30 text-[10px]">
              Exemple de démonstration
            </Badge>
          </div>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1 text-xs opacity-90">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {city.regionName}
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground">
              {city.name}
            </h3>
            <ArrowUpRight
              className="mt-1 h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {city.departmentName} · {city.postalCode}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {formatPopulation(city.population)} hab.
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {city.departmentName}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
            <Stat label="Note globale" value={`${city.scores.overall}/100`} />
            <Stat label="Prix m² (appart.)" value={city.stats.apartmentPriceM2.display ?? 'n.d.'} />
            <Stat label="MAJ" value={formatDate(city.lastUpdated)} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
