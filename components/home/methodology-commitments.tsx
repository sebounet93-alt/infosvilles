import Link from 'next/link';
import { ArrowRight, FileCheck2, ScrollText, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Item = { icon: LucideIcon; title: string; desc: string };

const ITEMS: Item[] = [
  {
    icon: FileCheck2,
    title: 'Sources publiques envisagées',
    desc: 'Chaque indicateur est accompagné d’un exemple de source et d’un lien vers celle-ci. Les données manquantes sont signalées comme telles, jamais inventées.',
  },
  {
    icon: ScrollText,
    title: 'Synthèses lisibles et nuancées',
    desc: 'Nos analyses présentent les atouts et les limites de chaque commune, sans superlatif injustifié. Les chiffres sont toujours accompagnés de leur contexte.',
  },
  {
    icon: ShieldCheck,
    title: 'Avis fictifs de démonstration',
    desc: 'Les avis actuellement affichés sont fictifs et étiquetés comme tels. À terme, les témoignages d’habitants seront modérés et jamais présentés comme vérifiés.',
  },
];

export function MethodologyCommitments() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance">
              Notre méthodologie, en trois engagements
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">
              Ce que vous lisez sur InfosVilles repose sur des règles explicites,
              détaillées page Méthodologie. Cette version présente des données fictives
              de démonstration.
            </p>
          </div>
          <Link
            href="/methodologie"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Voir la méthodologie complète{' '}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ITEMS.map((item) => (
            <Card key={item.title} className="border-border/60 bg-card">
              <CardContent className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground text-pretty">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
