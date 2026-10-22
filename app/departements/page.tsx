import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDepartments } from '@/lib/mockData';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Départements',
  description:
    'Explorez les communes françaises analysées par InfosVilles, classées par département et région. Prototype en démonstration — seules quelques communes sont actuellement disponibles.',
  path: '/departements',
});

export default async function DepartmentsIndexPage() {
  const departments = await getDepartments();

  const byRegion: Record<string, typeof departments> = {};
  for (const d of departments) {
    (byRegion[d.region] ||= []).push(d);
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
          Départements
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Sélectionnez un département pour découvrir les communes analysées par InfosVilles.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {Object.entries(byRegion).map(([region, deps]) => (
          <section key={region}>
            <h2 className="font-serif text-xl font-semibold tracking-tight">{region}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deps.map((d) => (
                <Link
                  key={d.id}
                  href={`/departement/${d.code}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
                    {d.code}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">Département {d.code}</div>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
