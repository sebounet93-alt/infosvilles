import { Search as SearchIcon } from 'lucide-react';

export default function SearchLoading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
          Rechercher une commune
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Explorez les communes françaises présentes dans InfosVilles.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm">
          <SearchIcon className="ml-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="h-10 flex-1 rounded bg-muted/40" aria-hidden="true" />
        </div>
        <div className="h-11 w-32 rounded-full bg-muted/40" aria-hidden="true" />
      </div>

      <section className="mt-10" aria-busy="true" aria-live="polite">
        <div className="h-7 w-48 rounded bg-muted/40" aria-hidden="true" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="h-24 bg-muted/40" aria-hidden="true" />
              <div className="p-4">
                <div className="h-5 w-32 rounded bg-muted/40" aria-hidden="true" />
                <div className="mt-3 h-3 w-24 rounded bg-muted/40" aria-hidden="true" />
                <div className="mt-2 h-3 w-20 rounded bg-muted/40" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
