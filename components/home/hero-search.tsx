'use client';

import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import type { City } from '@/lib/types';
import { searchDemoCities } from '@/lib/search-demo';
import { formatPopulation } from '@/lib/data';

type Props = { cities: City[] };

export function HeroSearch({ cities }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[] | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasQuery = query.trim().length > 0;
  const showList = results !== null;

  const handleSearch = async (raw: string) => {
    const q = raw.trim();
    if (!q) {
      setResults([]);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    try {
      const found = await searchDemoCities(q, cities);
      setResults(found);
      setStatus('idle');
      setActiveIndex(-1);
    } catch {
      setStatus('error');
      setResults([]);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults(null);
      setStatus('idle');
      setActiveIndex(-1);
      return;
    }
    void handleSearch(value);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (results && activeIndex >= 0 && results[activeIndex]) {
      router.push(`/ville/${results[activeIndex].slug}`);
      return;
    }
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        router.push(`/ville/${results[activeIndex].slug}`);
      }
    } else if (e.key === 'Escape') {
      setResults(null);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const loading = status === 'loading';
  const error = status === 'error';
  const noResult = showList && !loading && !error && results!.length === 0 && hasQuery;

  return (
    <div className="relative mx-auto mt-8 max-w-xl">
      <form action="/recherche" method="get" onSubmit={submit} role="search">
        <input type="hidden" name="q" value={query.trim()} />
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring">
          <Search className="ml-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            name="q-visible"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Rechercher une commune, un code postal…"
            aria-label="Rechercher une commune par nom ou code postal"
            aria-describedby="hero-search-status"
            role="combobox"
            aria-expanded={showList}
            aria-controls="hero-search-listbox"
            aria-activedescendant={
              activeIndex >= 0 && results?.[activeIndex]
                ? `hero-option-${results[activeIndex].slug}`
                : undefined
            }
            autoComplete="off"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && (
            <Loader2 className="mr-1 h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
          )}
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Rechercher
          </button>
        </div>
      </form>

      <div id="hero-search-status" role="status" aria-live="polite" className="sr-only">
        {loading && 'Recherche en cours…'}
        {!loading && error && 'Erreur lors de la recherche. Veuillez réessayer.'}
        {!loading && !error && showList && `${results!.length} résultat(s).`}
        {!loading && !error && !hasQuery && ''}
      </div>

      {showList && !error && (
        <ul
          id="hero-search-listbox"
          role="listbox"
          aria-label="Résultats de recherche"
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-1.5 text-left shadow-lg"
        >
          {noResult && (
            <li role="option" aria-selected="false" className="px-4 py-4 text-center">
              <span className="block text-sm font-medium text-foreground">
                Aucune fiche ne correspond à « {query.trim()} »
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Essayez « Bordeaux », « Annecy » ou un code postal.
              </span>
            </li>
          )}
          {results!.map((city, i) => (
            <li
              key={city.slug}
              id={`hero-option-${city.slug}`}
              role="option"
              aria-selected={i === activeIndex}
            >
              <Link
                href={`/ville/${city.slug}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-soft ${
                  i === activeIndex ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block font-medium text-foreground">{city.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {city.postalCode} · {city.regionName}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatPopulation(city.population)} hab.
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          La recherche a échoué. Réessayez ou passez par la page{' '}
          <Link href="/recherche" className="underline">
            Recherche
          </Link>
          .
        </p>
      )}
    </div>
  );
}
