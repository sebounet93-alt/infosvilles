"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer le menu déroulant si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recherche en direct au fil de la frappe
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.cities || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Erreur de recherche en direct:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Attendre 300ms après la dernière frappe avant d'appeler l'API (Debounce)
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Si l'utilisateur tape sur Entrée ou clique sur le bouton "Rechercher"
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex items-center shadow-sm hover:shadow-md transition-shadow rounded-full z-20 bg-background">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Rechercher une commune, un code postal..."
          className="w-full rounded-full border border-input bg-transparent px-10 py-3.5 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-[115px] top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Menu déroulant des suggestions */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          <ul className="max-h-[320px] overflow-y-auto py-2">
            {results.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/ville/${city.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="truncate font-medium text-foreground text-sm">
                      {city.name} <span className="text-muted-foreground font-normal">({city.postal_code})</span>
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {city.department_name} • {Number(city.population).toLocaleString('fr-FR')} hab.
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-center text-muted-foreground">
            Appuyez sur <kbd className="rounded bg-background border px-1 shadow-sm">Entrée</kbd> pour voir tous les résultats
          </div>
        </div>
      )}
    </div>
  );
}