import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Méthodologie et sources de données — InfosVilles',
  description: 'Présentation documentée des sources ouvertes officielles (INSEE, DVF, SSMSI) et du mode de calcul des indicateurs territoriaux.',
};

export default function MethodologiePage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 font-sans">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Méthodologie et sources de données
      </h1>
      <p className="mt-4 text-base text-muted-foreground leading-relaxed">
        InfosVilles centralise et traite exclusivement des données publiques ouvertes (Open Data) produites par les ministères et organismes statistiques nationaux. Aucun classement n’est sponsorisé.
      </p>

      <section className="mt-10 space-y-8">
        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="text-xl font-semibold">1. Marché immobilier (Prix au m²)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Source :</strong> Base DVF (Demandes de Valeurs Foncières) — DGFiP / Etalab.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Les valeurs au m² correspondent aux transactions notariales enregistrées à titre onéreux sur les maisons et appartements au cours des 24 derniers mois. Sont exclues les mutations sans surface bâtie déclarée et les valeurs aberrantes (ventes en viager, cessions de parts de SCI).
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="text-xl font-semibold">2. Sécurité et délinquance</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Source :</strong> SSMSI (Service statistique ministériel de la sécurité intérieure) — Ministère de l’Intérieur.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Le score de sécurité (sur 10) est calculé à partir du taux d’infractions constatées pour 1 000 habitants (cambriolages, dégradations, violences aux personnes). La note est relative et indexée sur la distribution nationale par strate de population.
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="text-xl font-semibold">3. Démographie et cadre socio-économique</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Source :</strong> INSEE (Filosofi et Recensement de la population).
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Les données intègrent les populations légales officielles, la médiane du revenu disponible par unité de consommation et le taux de pauvreté monétaire communal.
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="text-xl font-semibold">4. Note globale d'attractivité</h2>
          <p className="mt-2 text-sm leading-relaxed">
            L’indicateur global est une moyenne pondérée équilibrée intégrant le cadre sécuritaire, le dynamisme économique, la proximité des commodités scolaires et de santé, et l’accessibilité relative du marché du logement.
          </p>
        </div>
      </section>
    </main>
  );
}