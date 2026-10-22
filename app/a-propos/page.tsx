import Link from 'next/link';
import type { Metadata } from 'next';
import { Building2, Target, Mail, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = pageMetadata({
  title: 'À propos',
  description:
    'InfosVilles.com : une plateforme indépendante d’analyse du cadre de vie des communes françaises. Notre mission, nos engagements et notre contact.',
  path: '/a-propos',
});

function ValueCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
        <h2 className="mt-3 font-serif text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
      <header>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance">
          À propos d’InfosVilles
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          InfosVilles.com est une plateforme indépendante consacrée à l’analyse du cadre de vie
          et de l’immobilier des communes françaises. Une alternative moderne, lisible et
          documentée aux annuaires vieillissants.
        </p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <ValueCard
          icon={Target}
          title="Notre mission"
          desc="Aider chaque visiteur à découvrir une commune, comprendre ses points forts et ses limites, comparer plusieurs indicateurs et consulter les sources — puis poursuivre sa recherche en confiance."
        />
        <ValueCard
          icon={Sparkles}
          title="Notre approche"
          desc="Clarté, transparence et sérénité. Chaque indicateur est accompagné d’un exemple de source et d’une date indicative, explicitement étiqueté comme fictif tant que les flux réels ne sont pas connectés."
        />
        <ValueCard
          icon={ShieldCheck}
          title="Transparence"
          desc="Nous ne présentons jamais des données fictives comme des données officielles. Les avis actuellement affichés sont fictifs et étiquetés comme tels."
        />
        <ValueCard
          icon={Scale}
          title="Indépendance"
          desc="InfosVilles est éditorialement indépendant. Aucun annonceur n’influence les analyses présentées sur le site."
        />
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Ce que vous pouvez faire
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Découvrir une commune et ses indicateurs détaillés.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Comparer plusieurs communes côte à côte.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Consulter l’exemple de source et la date indicative de chaque donnée.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            À terme, partager une expérience habitant, modérée et jamais présentée comme vérifiée.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Poursuivre votre recherche vers d’autres communes ou départements.
          </li>
        </ul>
      </section>

      <section id="contact" className="mt-12 scroll-mt-24">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Une question, une correction, une suggestion de source ? Écrivez-nous.
        </p>
        <a
          href="mailto:contact@infosvilles.com"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
        >
          <Mail className="h-4 w-4" aria-hidden="true" /> contact@infosvilles.com
        </a>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="font-serif text-xl font-semibold">Mentions légales</h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Éditeur : InfosVilles.com — Plateforme indépendante d’analyse territoriale. Les données
          présentées sont des données fictives de démonstration jusqu’au remplacement par des
          sources réelles. Aucune donnée fictive n’est présentée comme une
          donnée officielle.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/methodologie" className="text-primary hover:underline">
            Méthodologie & sources
          </Link>
          <Link href="/mentions-legales" className="text-primary hover:underline">
            Mentions légales complètes
          </Link>
          <Link href="/politique-confidentialite" className="text-primary hover:underline">
            Politique de confidentialité
          </Link>
        </div>
      </section>
    </main>
  );
}
