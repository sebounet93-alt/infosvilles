import { SlidersHorizontal, GitCompare, FileSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = { icon: LucideIcon; title: string; desc: string };

const STEPS: Step[] = [
  {
    icon: SlidersHorizontal,
    title: 'Définissez vos critères',
    desc: 'Budget immobilier, services, transports, cadre de vie : choisissez ce qui compte pour votre projet.',
  },
  {
    icon: GitCompare,
    title: 'Comparez les communes',
    desc: 'Mettez côte à côte les communes disponibles selon les indicateurs qui vous intéressent.',
  },
  {
    icon: FileSearch,
    title: 'Consultez indicateurs et sources',
    desc: 'Lisez chaque indicateur, sa source envisagée et ses limites avant de décider.',
  },
];

export function HomeSteps() {
  return (
    <section className="border-b border-border/60 bg-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-14 md:py-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Trois étapes pour comparer les communes
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <step.icon className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-3 font-medium text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
