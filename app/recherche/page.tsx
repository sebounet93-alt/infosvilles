import pool from '@/lib/db';
import { Frown, MapPin, AlertCircle, Search as SearchIcon } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { ResultCard, SearchForm } from '@/components/search';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata = pageMetadata({
  title: 'Rechercher une commune',
  description: 'Recherchez une commune française par nom ou code postal et explorez ses indicateurs de cadre de vie, immobilier et services.',
  path: '/recherche',
});

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = (params.q ?? '').trim();

  let results: any[] = [];
  let departments: any[] = [];
  let searchError = false;

  try {
    // 1. Recherche des communes (par nom ou code postal)
    if (q) {
      const res = await pool.query(`
        SELECT slug, name, postal_code, department_name, region_name, population, score_overall 
        FROM cities 
        WHERE name ILIKE $1 OR postal_code LIKE $1 
        ORDER BY population DESC 
        LIMIT 24
      `, [`${q}%`]);
      
      results = res.rows.map(r => ({
        slug: r.slug,
        name: r.name,
        postalCode: r.postal_code,
        departmentName: r.department_name,
        region: r.region_name,
        population: Number(r.population),
        scores: { overall: r.score_overall ? Number(r.score_overall) : null }
      }));
    } else {
      // 1b. Si pas de recherche, afficher les plus grandes villes par défaut
      const res = await pool.query(`
        SELECT slug, name, postal_code, department_name, region_name, population, score_overall 
        FROM cities 
        ORDER BY population DESC 
        LIMIT 12
      `);
      
      results = res.rows.map(r => ({
        slug: r.slug,
        name: r.name,
        postalCode: r.postal_code,
        departmentName: r.department_name,
        region: r.region_name,
        population: Number(r.population),
        scores: { overall: r.score_overall ? Number(r.score_overall) : null }
      }));
    }

    // 2. Liste dynamique de tous les départements présents en base
    const depRes = await pool.query(`
      SELECT DISTINCT department_code, department_name, region_name 
      FROM cities 
      ORDER BY department_code
    `);
    departments = depRes.rows;

  } catch (err) {
    console.error(err);
    searchError = true;
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
          Rechercher une commune
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Explorez les communes françaises présentes dans InfosVilles. Cherchez par
          nom ou code postal pour découvrir les indicateurs réels (DVF, INSEE, SSMSI).
        </p>
      </header>

      <SearchForm defaultValue={q} activeQuery={q} />

      <section className="mt-10" aria-live="polite">
        {searchError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-12 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" aria-hidden="true" />
            <h3 className="mt-4 font-serif text-lg font-semibold">Erreur de connexion</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Impossible de récupérer les données depuis la base de données.
            </p>
          </div>
        ) : q && results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <Frown className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-serif text-lg font-semibold">Aucune commune trouvée</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucune commune ne correspond à « {q} ». Essayez un autre nom ou code postal.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl font-semibold">
                {results.length} commune{results.length > 1 ? 's' : ''}
                {q && (
                  <span className="text-muted-foreground"> pour « {q} »</span>
                )}
              </h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <ResultCard key={r.slug} result={r} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Explorer par département
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <a
              key={d.department_code}
              href={`/departement/${d.department_code}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
                {d.department_code}
              </span>
              <div className="flex-1">
                <div className="font-medium">{d.department_name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {d.region_name}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}