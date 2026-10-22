import Link from 'next/link';
import { MapPin, Users, ArrowUpRight } from 'lucide-react';
import type { SearchResult } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/data';

type Props = { result: SearchResult };

export function ResultCard({ result }: Props) {
  return (
    <Link
      href={`/ville/${result.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:border-primary/30">
        <div className="relative h-24 bg-gradient-to-br from-primary/90 via-primary to-accent/80">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
          <div className="absolute right-3 top-3">
            {result.isDemo && (
              <Badge
                variant="outline"
                className="bg-white/15 text-white border-white/30 text-[10px]"
              >
                Démonstration
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1 text-xs opacity-90">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {result.region}
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground">
              {result.name}
            </h3>
            <ArrowUpRight
              className="mt-1 h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {result.postalCode}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNumber(result.population)} hab.
            </span>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {result.departmentName}
            {result.departmentCode && (
              <span className="ml-1 font-mono text-[11px]">
                ({result.departmentCode})
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
