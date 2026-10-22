import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = pageMetadata({
  title: 'Mentions légales',
  description:
    'Mentions légales d’InfosVilles.com : éditeur, responsabilité, propriété intellectuelle et statut des données présentées.',
  path: '/mentions-legales',
});

export default function LegalPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
        Mentions légales
      </h1>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Éditeur</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              InfosVilles.com — Plateforme indépendante d’analyse territoriale. Pour toute
              demande, écrivez à contact@infosvilles.com.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Statut des données</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Les données présentées sur ce site sont actuellement des{' '}
              <strong>données fictives de démonstration</strong>. Elles ont pour seul
              but d’illustrer l’expérience produit. Elles seront remplacées par des données
              réelles (exemples de sources envisagées : Insee, Notaires de France, Éducation nationale, ATMO France…) une fois
              les flux connectés.
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Aucune donnée fictive n’est présentée comme une donnée officielle.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Témoignages d’habitants</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Les avis actuellement affichés sur InfosVilles sont <strong>fictifs et de
              démonstration</strong>, étiquetés comme tels. À terme, les témoignages d’habitants
              refléteront des expériences personnelles partagées par des internautes, modérés avant
              publication et <strong>jamais présentés comme des faits vérifiés</strong>.
              InfosVilles ne saurait être tenu responsable du contenu des témoignages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Propriété intellectuelle</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Les éléments éditoriaux d’InfosVilles (textes, présentation, logo) sont protégés.
              Les sources envisagées appartiendront à leurs éditeurs respectifs, cités sur chaque
              page. Les sources sont référencées à titre indicatif, en vue d’un futur branchage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Limites de responsabilité</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Les indicateurs sont des synthèses utiles pour orienter une recherche, mais ils ne
              remplacent pas une visite, une enquête de proximité ou l’avis d’un professionnel.
              InfosVilles ne saurait être tenu responsable des décisions prises sur la seule base
              de ces données.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
