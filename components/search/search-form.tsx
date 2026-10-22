import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Props = {
  defaultValue?: string;
  activeQuery?: string;
};

export function SearchForm({ defaultValue = '', activeQuery = '' }: Props) {
  return (
    <form action="/recherche" method="get" className="mt-6" role="search">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring">
          <Search className="ml-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={defaultValue}
            placeholder="Nom, code postal, région…"
            aria-label="Rechercher une commune"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Rechercher
        </button>
      </div>

      {activeQuery && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Filtre actif :</span>
          <Badge variant="secondary">Recherche : « {activeQuery} »</Badge>
          <Link
            href="/recherche"
            className="text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Réinitialiser
          </Link>
        </div>
      )}
    </form>
  );
}
