'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Commune, CommuneIndicator, Indicator } from '@/lib/types';
import { HIGHER_IS_BETTER } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Row = Commune & { commune_indicators: CommuneIndicator[] };

type Props = {
  indicators: Indicator[];
  /** Classement rendu côté serveur : contenu principal lisible sans JavaScript. */
  fallbackRows: Row[];
};

export function RankingClient({ indicators, fallbackRows }: Props) {
  const [communes, setCommunes] = useState<Row[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selectedKey, setSelectedKey] = useState<string>(indicators[0]?.key ?? '');

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('communes')
      .select('*, commune_indicators(*)')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setStatus('error');
          setCommunes(null);
        } else {
          setCommunes((data ?? []) as Row[]);
          setStatus('ready');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const higherBetter = HIGHER_IS_BETTER[selectedKey] ?? true;

  const ranked = (communes ?? fallbackRows)
    .map((c) => {
      const v = c.commune_indicators.find((x) => x.indicator_key === selectedKey);
      return { commune: c, value: v?.value ?? null, label: v?.value_label ?? null };
    })
    .filter((r) => r.value !== null)
    .sort((a, b) => (higherBetter ? (b.value! - a.value!) : (a.value! - b.value!)));

  const selectedIndicator = indicators.find((i) => i.key === selectedKey);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
          Classement des communes
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-balance">
          Classements
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Comparez les communes analysées sur un indicateur donné. Sélectionnez un indicateur
          pour voir le classement mis à jour.
        </p>
      </header>

      {/* Indicator selector */}
      <div className="mt-8">
        <label
          htmlFor="indicator-select"
          className="text-sm font-medium text-foreground"
        >
          Indicateur
        </label>
        <select
          id="indicator-select"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {indicators.map((ind) => (
            <option key={ind.key} value={ind.key}>
              {ind.label} ({ind.category})
            </option>
          ))}
        </select>
        {selectedIndicator && (
          <p className="mt-2 text-xs text-muted-foreground">
            Source : {selectedIndicator.source_name} ·{' '}
            {higherBetter ? 'plus élevé = meilleur' : 'plus bas = meilleur'}
          </p>
        )}
      </div>

      {/* Loading state */}
      {status === 'loading' && (
        <section className="mt-8" aria-live="polite" aria-busy="true">
          <ol className="space-y-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <Card className="h-[72px] animate-pulse bg-muted/40 p-4" />
              </li>
            ))}
          </ol>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Chargement du classement…
          </p>
        </section>
      )}

      {/* Error state */}
      {status === 'error' && (
        <section className="mt-8" role="alert">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" aria-hidden="true" />
            <h2 className="mt-3 font-serif text-lg font-semibold">
              Impossible de charger le classement
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vérifiez votre connexion puis réessayez. Les fiches communes restent
              accessibles depuis la page Recherche.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </section>
      )}

      {/* Ranking list */}
      {status === 'ready' && (
        <section className="mt-8">
          {ranked.length > 0 ? (
            <ol className="space-y-2">
              {ranked.map((r, i) => (
                <li key={r.commune.id}>
                  <Card className="flex items-center gap-4 p-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/ville/${r.commune.slug}`}
                        className="font-serif text-base font-semibold hover:text-primary"
                      >
                        {r.commune.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {r.commune.region} · {r.commune.postal_code}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-serif text-lg font-semibold">{r.label ?? r.value}</div>
                      <div className="flex items-center justify-end gap-0.5 text-xs text-muted-foreground">
                        {higherBetter ? (
                          <TrendingUp className="h-3 w-3 text-success" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-success" aria-hidden="true" />
                        )}
                        {selectedIndicator?.unit ?? ''}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <h2 className="font-serif text-lg font-semibold">
                Aucune donnée disponible pour cet indicateur
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choisissez un autre indicateur dans la liste ci-dessus.
              </p>
            </div>
          )}

          <div
            className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground"
            role="note"
          >
            Données fictives de démonstration — en attente de sources réelles.
          </div>
        </section>
      )}
    </main>
  );
}
