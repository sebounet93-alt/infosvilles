'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CityResult {
  name: string;
  slug: string;
  postal_code: string;
  department_name: string;
  population: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.cities || []);
          setIsOpen(true);
        } catch {
          setResults([]);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une ville ou un code postal..."
        className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-background shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40"
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden divide-y divide-border">
          {results.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/ville/${city.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors text-sm"
              >
                <div>
                  <span className="font-semibold text-foreground">{city.name}</span>{' '}
                  <span className="text-muted-foreground">({city.postal_code})</span>
                  <p className="text-xs text-muted-foreground">{city.department_name}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {city.population.toLocaleString('fr-FR')} hab.
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}