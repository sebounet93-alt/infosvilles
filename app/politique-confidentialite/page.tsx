import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = pageMetadata({
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité d’InfosVilles.com : données collectées, témoignages, cookies et droits des utilisateurs.',
  path: '/politique-confidentialite',
});

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
        Politique de confidentialité
      </h1>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Principes généraux</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              InfosVilles s’engage à protéger votre vie privée. Cette page décrit les données
              traitées lorsque vous utilisez le site, conformément au Règlement Général sur la
              Protection des Données (RGPD).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Témoignages d’habitants</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Lorsque vous soumettez un témoignage, nous traitons les informations suivantes :
              votre prénom (ou pseudonyme), la note attribuée, le titre et le texte du
              témoignage, et l’année d’installation (optionnelle). Ces informations sont
              publiées après modération et ne sont jamais présentées comme vérifiées.
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Nous vous recommandons de ne pas partager d’informations personnelles sensibles dans
              votre témoignage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Données de navigation</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              InfosVilles peut collecter des statistiques de fréquentation anonymisées à des fins
              d’amélioration du service. Ces données ne permettent pas de vous identifier
              personnellement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Cookies</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Le site utilise un minimum de cookies techniques nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou de pistage commercial n’est déposé sans votre
              consentement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Vos droits</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de
              suppression des données vous concernant. Pour exercer ces droits, écrivez à
              contact@infosvilles.com.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold">Durée de conservation</h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Les témoignages sont conservés tant que la commune concernée est présente sur le
              site. Les données de navigation anonymisées sont conservées pour une durée maximale
              de 13 mois.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
