import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Hero,
  StatsBar,
  HomeSteps,
  CityCard,
  MethodologyCommitments,
  HomeCta,
} from '@/components/home';
import { getDemoCities, getCommuneCount, getIndicatorCount } from '@/lib/mockData';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Choisir sa ville : cadre de vie, immobilier et services',
  description:
    'Découvrez un outil de comparaison des communes françaises selon le budget immobilier, les services, les transports et le cadre de vie. Prototype en démonstration — données fictives illustrant le fonctionnement futur d’InfosVilles.',
  path: '/',
});

export default async function HomePage() {
  const [cities, communeCount, indicatorCount] = await Promise.all([
    getDemoCities(),
    getCommuneCount(),
    getIndicatorCount(),
  ]);

  return (
    <main>
      <Hero communeCount={communeCount} indicatorCount={indicatorCount} cities={cities} />
      <StatsBar communeCount={communeCount} indicatorCount={indicatorCount} />
      <HomeSteps />

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight">
              Exemples de fiches communes
            </h2>
            <p className="mt-2 text-muted-foreground">
              Des fiches complètes : scores, immobilier, sécurité, services et avis
              d’habitants modérés. Données fictives de démonstration.
            </p>
          </div>
          <Link
            href="/recherche"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-soft hover:bg-primary/10"
          >
            Explorer les communes
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </section>

      <MethodologyCommitments />
      <HomeCta />
    </main>
  );
}
