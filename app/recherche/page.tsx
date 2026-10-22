import { Frown, MapPin, AlertCircle, Search as SearchIcon } from 'lucide-react';
import { searchCommunesUnified, getAllSearchResults } from '@/lib/search';
import { getDepartments } from '@/lib/mockData';
import { pageMetadata } from '@/lib/seo';
import { ResultCard, SearchForm } from '@/components/search';
import { Badge } from '@/components/ui/badge';

type Props = {
  searchParams: { q?: string };
};

export const metadata = pageMetadata({
  title: 'Rechercher une commune',
  description:
    'Recherchez une commune française par nom ou code postal et explorez ses indicateurs de cadre de vie, immobilier, emploi et services. Prototype en démonstration — données fictives.',
  path: '/recherche',
});

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? '').trim();

  let results: Awaited<ReturnType<typeof getAllSearchResults>> = [];
  let searchError = false;

  try {
    if (q) {
      results = await searchCommunesUnified(q);
    } else {
      results = await getAllSearchResults();
    }
  } catch {
    searchError = true;
  }

  const departments = await getDepartments();

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
          Rechercher une commune
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Explorez les communes françaises présentes dans InfosVilles. Cherchez par
          nom, code postal ou région. Toutes les communes affichées sont en
          démonstration.
        </p>
      </header>

      <SearchForm defaultValue={q} activeQuery={q} />

      <section className="mt-10" aria-live="polite">
        {searchError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-12 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" aria-hidden="true" />
            <h3 className="mt-4 font-serif text-lg font-semibold">Erreur de recherche</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Une erreur est survenue lors de la récupération des communes. Veuillez réessayer.
            </p>
          </div>
        ) : q && results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <Frown className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-serif text-lg font-semibold">Aucune commune trouvée</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucune commune ne correspond à « {q} ». Essayez un autre nom, un code
              postal ou une région.
            </p>
          </div>
        ) : !q && results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <SearchIcon className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-serif text-lg font-semibold">Commencez votre recherche</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Saisissez un nom de commune, un code postal ou une région ci-dessus pour
 voir les communes disponibles.
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
              <Badge variant="secondary" className="text-[10px]">
                Données fictives de démonstration
              </Badge>
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
              key={d.id}
              href={`/departement/${d.code}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
                {d.code}
              </span>
              <div className="flex-1">
                <div className="font-medium">{d.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {d.region}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
