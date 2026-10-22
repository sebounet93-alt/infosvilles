import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { City } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { HeroSearch } from './hero-search';

type Props = {
  communeCount: number;
  indicatorCount: number;
  cities: City[];
};

export function Hero({ communeCount, indicatorCount, cities }: Props) {
  const topCities = cities.slice(0, 2);

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-grid opacity-[0.35]" aria-hidden="true" />
      <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />

      <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-5 gap-1.5 rounded-full px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {indicatorCount} indicateurs illustrés sur {communeCount} communes en démonstration
          </Badge>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
            Trouvez une commune adaptée à votre{' '}
            <span className="text-primary">projet de vie</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl">
            Comparez le budget immobilier, les services, les transports et le cadre de
            vie avant de choisir où vous installer.
          </p>

          <HeroSearch cities={cities} />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Communes en démonstration :</span>
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/ville/${city.slug}`}
                className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-medium text-primary transition-colors hover:bg-primary/10"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
