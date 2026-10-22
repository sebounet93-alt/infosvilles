'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  X,
  Plus,
  Search,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import {
  COMPARE_METRICS,
  MAX_COMMUNES,
  loadCompareColumns,
  getAllCompareEntries,
  type CompareColumn,
  type CompareEntry,
  type CompareMetric,
} from '@/lib/compare';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'ready' | 'error';

type Props = {
  initialSlugs: string[];
  initialColumns: CompareColumn[];
  allEntries: CompareEntry[];
};

export function CompareClient({ initialSlugs, initialColumns, allEntries }: Props) {
  const [columns, setColumns] = useState<CompareColumn[]>(initialColumns);
  const [entries] = useState<CompareEntry[]>(allEntries);
  const [status, setStatus] = useState<Status>('ready');
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState('');

  const selectedSlugs = useMemo(() => columns.map((c) => c.slug), [columns]);

  const syncUrl = useCallback((slugs: string[]) => {
    const url = new URL(window.location.href);
    if (slugs.length) url.searchParams.set('with', slugs.join(','));
    else url.searchParams.delete('with');
    window.history.replaceState({}, '', url.toString());
  }, []);

  const add = useCallback(async (slug: string) => {
    if (columns.some((c) => c.slug === slug)) return;
    if (columns.length >= MAX_COMMUNES) return;
    const next = [...columns.map((c) => c.slug), slug];
    syncUrl(next);
    setPicker(false);
    setQuery('');
    setStatus('loading');
    try {
      const loaded = await loadCompareColumns(next);
      setColumns(loaded);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [columns, syncUrl]);

  const remove = useCallback(async (slug: string) => {
    const next = columns.filter((c) => c.slug !== slug).map((c) => c.slug);
    syncUrl(next);
    setStatus('loading');
    try {
      const loaded = await loadCompareColumns(next);
      setColumns(loaded);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [columns, syncUrl]);

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries;
    return entries.filter((e) =>
      `${e.name} ${e.postalCode} ${e.region}`.toLowerCase().includes(normalized),
    );
  }, [entries, query]);

  const hasDuplicate = useMemo(() => {
    return new Set(selectedSlugs).size !== selectedSlugs.length;
  }, [selectedSlugs]);

  const groupedMetrics = useMemo(() => {
    const groups: Record<string, CompareMetric[]> = {};
    for (const m of COMPARE_METRICS) {
      (groups[m.category] ||= []).push(m);
    }
    return groups;
  }, []);

  const bestValues = useMemo(() => {
    const best: Record<string, number | null> = {};
    for (const m of COMPARE_METRICS) {
      const vals = columns
        .map((c) => c.values[m.key]?.value)
        .filter((v): v is number => typeof v === 'number');
      if (!vals.length) {
        best[m.key] = null;
        continue;
      }
      best[m.key] = m.higherIsBetter ? Math.max(...vals) : Math.min(...vals);
    }
    return best;
  }, [columns]);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
          Comparer des communes
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Sélectionnez jusqu’à {MAX_COMMUNES} communes et comparez leurs indicateurs
          côte à côte. Les valeurs proviennent d’exemples de sources, non de données
          officielles connectées.
        </p>
      </header>

      <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground">
        Comparaison de démonstration : les chiffres affichés sont fictifs et
        illustrent le fonctionnement futur du service.
      </div>

      {status === 'error' && (
        <section className="mt-8" role="alert">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" aria-hidden="true" />
            <h2 className="mt-3 font-serif text-lg font-semibold">
              Impossible de charger la comparaison
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vérifiez votre connexion puis réessayez.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-stretch gap-3">
        {columns.map((c) => (
          <div
            key={c.slug}
            className="group relative flex w-56 flex-col rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <button
              onClick={() => remove(c.slug)}
              aria-label={`Retirer ${c.name}`}
              className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link
              href={`/ville/${c.slug}`}
              className="font-serif text-lg font-semibold hover:text-primary focus:outline-none focus-visible:underline"
            >
              {c.name}
            </Link>
            <div className="mt-1 text-xs text-muted-foreground">
              {c.postalCode} · {c.region}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {c.departmentName}
            </div>
            {c.isDemo && (
              <Badge
                variant="outline"
                className="mt-2 w-fit border-warning/50 text-warning-foreground bg-warning/10 text-[10px]"
              >
                Démonstration
              </Badge>
            )}
          </div>
        ))}

        {columns.length < MAX_COMMUNES && (
          <button
            onClick={() => setPicker((v) => !v)}
            className="flex w-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Ajouter une commune à comparer"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
            Ajouter une commune
          </button>
        )}
      </div>

      {columns.length >= MAX_COMMUNES && (
        <p className="mt-3 text-sm text-muted-foreground">
          Maximum de {MAX_COMMUNES} communes atteint. Retirez une commune pour en
          ajouter une autre.
        </p>
      )}

      {picker && (
        <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une commune…"
              aria-label="Rechercher une commune à ajouter"
              className="h-8 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.slice(0, 18).map((e) => {
              const alreadySelected = columns.some((c) => c.slug === e.slug);
              return (
                <button
                  key={e.slug}
                  onClick={() => add(e.slug)}
                  disabled={alreadySelected}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background p-3 text-left text-sm hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.postalCode} · {e.region}
                    </div>
                  </div>
                  {alreadySelected ? (
                    <Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
              );
            })}
            {filteredEntries.length === 0 && (
              <p className="col-span-full py-4 text-center text-sm text-muted-foreground">
                Aucune commune trouvée pour « {query} ».
              </p>
            )}
          </div>
        </div>
      )}

      {status === 'loading' && (
        <section className="mt-8" aria-live="polite" aria-busy="true">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Chargement de la comparaison…
          </p>
        </section>
      )}

      {status === 'ready' && columns.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <GitCompare className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-lg font-semibold">Aucune commune sélectionnée</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajoutez au moins deux communes pour démarrer la comparaison.
          </p>
        </div>
      )}

      {status === 'ready' && columns.length === 1 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <GitCompare className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-lg font-semibold">Une seule commune sélectionnée</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajoutez au moins une autre commune pour comparer leurs indicateurs côte à côte.
          </p>
        </div>
      )}

      {hasDuplicate && (
        <div className="mt-6 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground">
          Vous avez sélectionné la même commune plusieurs fois. La comparaison est plus
          pertinente avec des communes différentes.
        </div>
      )}

      {status === 'ready' && columns.length >= 2 && (
        <section className="mt-10">
          {Object.entries(groupedMetrics).map(([category, metrics]) => (
            <div key={category} className="mt-8 first:mt-0">
              <h2 className="font-serif text-xl font-semibold tracking-tight">{category}</h2>
              <Card className="mt-3 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      Comparaison des indicateurs de la catégorie {category} pour les communes sélectionnées.
                    </caption>
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left">
                        <th scope="col" className="sticky left-0 z-10 bg-muted/40 p-3 font-medium text-muted-foreground">
                          Indicateur
                        </th>
                        {columns.map((c) => (
                          <th key={c.slug} scope="col" className="p-3 font-semibold min-w-[140px]">
                            <Link
                              href={`/ville/${c.slug}`}
                              className="hover:text-primary focus:outline-none focus-visible:underline"
                            >
                              {c.name}
                            </Link>
                            <div className="text-xs font-normal text-muted-foreground">
                              {c.postalCode} · {c.departmentName}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((m, i) => (
                        <tr key={m.key} className={i % 2 ? 'bg-muted/20' : ''}>
                          <th scope="row" className="sticky left-0 z-10 bg-inherit p-3 text-left font-medium text-foreground">
                            {m.label}
                          </th>
                          {columns.map((c) => {
                            const v = c.values[m.key];
                            const best = bestValues[m.key];
                            const isBest =
                              v && v.value !== null && best !== null && v.value === best && !hasDuplicate;
                            return (
                              <td key={c.slug} className="p-3">
                                {v ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{v.display}</span>
                                    {isBest && columns.length > 1 && (
                                      <Badge
                                        variant="outline"
                                        className="border-success/50 text-success text-[10px]"
                                      >
                                        meilleur
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ))}

          <Card className="mt-8 bg-muted/30 p-5">
            <h2 className="font-serif text-base font-semibold">Exemples de sources envisagées</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Les sources ci-dessous sont des exemples illustratifs. Aucune donnée
              officielle n’est encore connectée.
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {SOURCE_EXAMPLES.map((s) => (
                <li key={s} className="text-sm text-muted-foreground">
                  · {s}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </main>
  );
}

const SOURCE_EXAMPLES: string[] = [
  'Notaires de France — bases BIEN (Exemple de source envisagée)',
  'INSEE — populations légales et densité (Exemple de source envisagée)',
  'DGCL — données locales des finances publiques (Exemple de source envisagée)',
  'SSMSI — données de la délinquance (Exemple de source envisagée)',
  'Éducation nationale — indice scolaire (Exemple de source envisagée)',
  'ATMO France — qualité de l’air (Exemple de source envisagée)',
];
