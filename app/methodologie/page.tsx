import Link from 'next/link';
import type { Metadata } from 'next';
import { FileText, Database, ShieldCheck, Users, RefreshCw, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getAllIndicators } from '@/lib/mockData';
import { pageMetadata } from '@/lib/seo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = pageMetadata({
  title: 'Méthodologie & sources',
  description:
    'Méthodologie en préparation d’InfosVilles : indicateurs envisagés, fréquence de mise à jour, traitement des témoignages et engagement transparence. Version de démonstration.',
  path: '/methodologie',
});

function PrincipleCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-3 font-serif text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default async function MethodologyPage() {
  const indicators = await getAllIndicators();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
      <header>
        <Badge variant="secondary" className="gap-1">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Transparence
        </Badge>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance">
          Méthodologie & sources
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          InfosVilles prépare un outil de comparaison des communes à partir de données
          publiques documentées. Voici la méthode envisagée pour construire les analyses
          de chaque commune.
        </p>
      </header>

      <section className="mt-10">
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
          <strong>État actuel :</strong> les données présentées sur le site sont des
          données fictives de démonstration. Elles illustrent l’expérience produit et
          seront remplacées par des sources réelles une fois les flux connectés.
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <PrincipleCard
          icon={Database}
          title="Indicateurs illustrés"
          desc="Chaque indicateur est accompagné d’un exemple de source et d’un lien vers celle-ci. Aucune valeur n’est présentée sans provenance indiquée."
        />
        <PrincipleCard
          icon={RefreshCw}
          title="Mises à jour datées"
          desc="Chaque valeur porte une date indicative. Nous indiquons clairement l’âge de la donnée, réelle ou illustrative."
        />
        <PrincipleCard
          icon={ShieldCheck}
          title="Pas de présentation trompeuse"
          desc="Les données fictives de démonstration ne sont jamais présentées comme des données officielles."
        />
        <PrincipleCard
          icon={Users}
          title="Témoignages fictifs"
          desc="Les avis présentés sont fictifs et étiquetés comme tels. À terme, les témoignages d’habitants seront modérés et clairement étiquetés comme expériences personnelles."
        />
      </section>

      <section id="score" className="mt-12 scroll-mt-24">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Comment le score est calculé&nbsp;?
        </h2>

        <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
          <strong>Score illustratif</strong>, en attente de données et d’une formule
          définitives. Les pondérations ci-dessous sont des exemples non validés.
        </div>

        <div className="reading-width mt-6 space-y-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Les cinq dimensions
            </h3>
            <p className="mt-1">
              Le score global repose sur cinq dimensions, chacune notée sur 100&nbsp;:
            </p>
            <ul className="mt-3 space-y-2">
              <li><strong className="text-foreground">Sécurité</strong> — incidence de la délinquance enregistrée.</li>
              <li><strong className="text-foreground">Éducation</strong> — densité et appréciation des établissements scolaires.</li>
              <li><strong className="text-foreground">Commerces et services</strong> — commerce de proximité, santé, transports du quotidien.</li>
              <li><strong className="text-foreground">Immobilier</strong> — rapport entre prix pratiqués et revenus locaux.</li>
              <li><strong className="text-foreground">Nature et espaces verts</strong> — part des espaces verts et accès à la nature.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Pondérations (illustratives)
            </h3>
            <p className="mt-1">
              Les pondérations ci-dessous sont indicatives et non définitives. Elles
              seront ajustées et validées une fois les données réelles connectées.
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>Sécurité — 25&nbsp;%</li>
              <li>Éducation — 20&nbsp;%</li>
              <li>Commerces et services — 20&nbsp;%</li>
              <li>Immobilier — 20&nbsp;%</li>
              <li>Nature et espaces verts — 15&nbsp;%</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Échelle sur 100
            </h3>
            <p className="mt-1">
              Chaque dimension est ramenée à une note sur 100. Le score global est une
              moyenne pondérée des cinq dimensions, également exprimée sur 100. Les
              seuils de lecture sont&nbsp;: favorable (≥ 66), intermédiaire (40–65), à
              surveiller (&lt; 40).
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Limites de comparaison entre communes
            </h3>
            <p className="mt-1">
              Les scores ne sont pas directement comparables entre communes de tailles
              ou de contextes très différents. Une commune rurale et une métropole
              n’offrent pas les mêmes services ni les mêmes contraintes. Les scores
              facilitent une lecture rapide, mais ne remplacent pas une analyse
              détaillée, une visite ou l’avis d’un professionnel.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Donnée communale vs donnée départementale
            </h3>
            <p className="mt-1">
              La plupart des indicateurs sont mesurés à l’échelle communale. La
              sécurité, en revanche, est suivie à l’échelle départementale&nbsp;: les
              faits constatés sont comptabilisés au lieu de commission, pas au lieu de
              résidence. Cette limite est rappelée directement sous l’indicateur
              Sécurité sur chaque fiche. Une lecture quartier par quartier reste
              indispensable.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Date de mise à jour prévue
            </h3>
            <p className="mt-1">
              Les scores actuellement affichés datent d’octobre 2026 et sont fictifs.
              La première mise à jour avec des données réelles est prévue après
              connexion des sources officielles. Chaque fiche indique la date de
              dernière mise à jour de ses données.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Sources envisagées par indicateur
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Liste des sources envisagées (données fictives de démonstration tant que les flux réels ne sont pas connectés).
        </p>
        <Card className="mt-5">
          <CardContent className="divide-y divide-border p-0">
            {indicators.map((ind) => (
              <div key={ind.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="font-medium">{ind.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {ind.category} · {ind.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{ind.source_name}</div>
                  {ind.source_url && (
                    <a
                      href={ind.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Exemple de source <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Traitement des témoignages
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Les avis actuellement affichés sont fictifs et étiquetés comme tels. Le fonctionnement ci-dessous décrit le futur dispositif de modération.
        </p>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Tout internaute pourra soumettre un témoignage pour une commune donnée.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Les témoignages seront modérés avant publication (statut « en attente » par défaut).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Ils seront <strong>toujours</strong> présentés comme des expériences personnelles et jamais comme des faits vérifiés.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Les propos haineux, discriminatoires ou diffamatoires seront rejetés.
          </li>
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="font-serif text-xl font-semibold">Limites & avertissement</h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Les indicateurs sont des synthèses utiles pour orienter une recherche, mais ils ne
          remplacent pas une visite, une enquête de proximité ou l’avis d’un professionnel.
          InfosVilles ne saurait être tenu responsable des décisions prises sur la seule base de
          ces données.
        </p>
        <Link
          href="/a-propos"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          En savoir plus sur InfosVilles
        </Link>
      </section>
    </main>
  );
}
