import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales — InfosVilles',
  description: 'Mentions légales, conditions d’utilisation et informations d’hébergement de la plateforme InfosVilles.',
};

export default function MentionsLegalesPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 font-sans">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Mentions légales
      </h1>

      <section className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Éditeur du site</h2>
          <p className="mt-1 text-muted-foreground">
            Le site <strong>InfosVilles</strong> est édité en tant que service indépendant d’information territoriale.
            <br />Contact administratif et technique : <a href="mailto:contact@infosvilles.com" className="text-primary hover:underline">contact@infosvilles.com</a>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Hébergement</h2>
          <p className="mt-1 text-muted-foreground">
            L’infrastructure et la base de données PostgreSQL sont hébergées au sein de l’Union Européenne par :
            <br /><strong>OVH SAS</strong> — 2 rue Kellermann, 59100 Roubaix, France.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Réutilisation des données publiques</h2>
          <p className="mt-1 text-muted-foreground">
            Les informations territoriales proviennent de jeux de données ouverts publiés par l’INSEE, Etalab et le Ministère de l’Intérieur sous licence ouverte (Licence Ouverte 2.0 / Open Government Licence). InfosVilles traite ces données à titre informatif. Malgré les contrôles automatisés, la plateforme ne peut être tenue responsable des évolutions cadastrales ou des décisions d’achat/vente prises sur la base de ces indicateurs.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Données personnelles & Cookies</h2>
          <p className="mt-1 text-muted-foreground">
            Le site ne requiert aucune inscription obligatoire pour la consultation des données publiques et n’exploite aucun cookie publicitaire tiers.
          </p>
        </div>
      </section>
    </main>
  );
}