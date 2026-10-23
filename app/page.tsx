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
import { pageMetadata } from '@/lib/seo';
import pool from '@/lib/db';

export const metadata = pageMetadata({
  title: 'Choisir sa ville : cadre de vie, immobilier et services',
  description:
    'Découvrez un outil de comparaison des communes françaises selon le budget immobilier, les services, les transports et le cadre de vie.',
  path: '/',
});

export default async function HomePage() {
  const [citiesRes, countRes] = await Promise.all([
    pool.query(`
      SELECT 
        insee_code,
        slug,
        name,
        postal_code,
        department_code,
        department_name,
        region_name,
        population,
        score_overall,
        score_security,
        score_education,
        score_amenities,
        avg_price_sqm_house,
        avg_price_sqm_apt,
        ai_synthesis
      FROM cities
      ORDER BY population DESC
      LIMIT 6
    `),
    pool.query('SELECT count(*)::int as total FROM cities'),
  ]);

  const cities = citiesRes.rows.map((row) => ({
    inseeCode: row.insee_code,
    slug: row.slug,
    name: row.name,
    postalCode: row.postal_code,
    departmentCode: row.department_code,
    departmentName: row.department_name,
    departmentSlug: row.department_name?.toLowerCase().replace(/\s+/g, '-'),
    regionName: row.region_name,
    population: Number(row.population),
    density: 0,
    isDemo: false,
    scores: {
      overall: Math.round(Number(row.score_overall) * 10),
      security: Math.round(Number(row.score_security) * 10),
      education: Math.round(Number(row.score_education) * 10),
      amenities: Math.round(Number(row.score_amenities) * 10),
      realEstate: 70,
      nature: 70,
    },
    stats: {
      apartmentPriceM2: {
        raw: Number(row.avg_price_sqm_apt),
        display: `${Number(row.avg_price_sqm_apt).toLocaleString('fr-FR')} €`,
      },
      housePriceM2: {
        raw: Number(row.avg_price_sqm_house),
        display: `${Number(row.avg_price_sqm_house).toLocaleString('fr-FR')} €`,
      },
    },
    lastUpdated: new Date().toISOString(),
    aiSynthesis: row.ai_synthesis,
  }));

  const communeCount = countRes.rows[0]?.total || 1000;
  const indicatorCount = 18;

  return (
    <main>
      <Hero communeCount={communeCount} indicatorCount={indicatorCount} {...({ cities } as any)} />
      <StatsBar communeCount={communeCount} indicatorCount={indicatorCount} />
      <HomeSteps />

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight">
              Exemples de fiches communes
            </h2>
            <p className="mt-2 text-muted-foreground">
              Des fiches complètes alimentées en direct par PostgreSQL : scores, immobilier et cadre de vie.
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
            <CityCard key={city.slug} city={city as any} />
          ))}
        </div>
      </section>

      <MethodologyCommitments />
      <HomeCta />
    </main>
  );
}