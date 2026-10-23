import { notFound } from 'next/navigation';
import Link from 'next/link';
import pool from '@/lib/db';
import { pageMetadata } from '@/lib/seo';
import { ArrowRight, Star, MessageSquareQuote, HelpCircle, ShieldCheck } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const res = await pool.query('SELECT name, postal_code, department_name FROM cities WHERE slug = $1 LIMIT 1', [slug]);
  const city = res.rows[0];
  if (!city) return {};

  return pageMetadata({
    title: `${city.name} (${city.postal_code}) : cadre de vie, immobilier et avis`,
    description: `Découvrez la fiche détaillée de ${city.name} (${city.department_name}) : indicateurs de sécurité, prix au m², avis et comparaison territoriale.`,
    path: `/ville/${slug}`,
  });
}

export default async function CityDetailPage({ params }: Props) {
  const { slug } = await params;

  // 1. Récupération de la commune cible
  const cityRes = await pool.query('SELECT * FROM cities WHERE slug = $1 LIMIT 1', [slug]);
  const city = cityRes.rows[0];
  if (!city) notFound();

  // 2. Récupération de communes comparables dans le même département
  const compareRes = await pool.query(`
    SELECT slug, name, postal_code, population, score_overall, avg_price_sqm_apt, score_security
    FROM cities 
    WHERE department_code = $1 AND slug != $2
    ORDER BY population DESC
    LIMIT 3
  `, [city.department_code, slug]);
  const nearbyCities = compareRes.rows;

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      {/* En-tête */}
      <div className="border-b border-border/70 pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/recherche" className="hover:underline">Recherche</Link>
          <span>/</span>
          <Link href={`/departement/${city.department_code}`} className="hover:underline">
            {city.department_name} ({city.department_code})
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {city.name} ({city.postal_code})
          </h1>
          <Link
            href={`/comparer?villes=${city.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Comparer cette commune
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {city.department_name} ({city.department_code}) — Région {city.region_name}
        </p>
      </div>

      {/* Synthèse */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Synthèse territoriale</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {city.ai_synthesis || `${city.name} est une commune de ${Number(city.population).toLocaleString('fr-FR')} habitants située dans le département de ${city.department_name}.`}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Population recensée : <strong className="text-foreground">{Number(city.population).toLocaleString('fr-FR')} habitants</strong>
        </p>
      </div>

      {/* Indicateurs clés */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-bold text-foreground">Indicateurs clés du cadre de vie</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs font-medium uppercase text-muted-foreground">Cadre global</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-600">{Number(city.score_overall).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs font-medium uppercase text-muted-foreground">Sécurité</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{Number(city.score_security).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs font-medium uppercase text-muted-foreground">Éducation</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{Number(city.score_education).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs font-medium uppercase text-muted-foreground">Commerces</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{Number(city.score_amenities).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">/10</span>
            </div>
          </div>
        </div>
      </section>

      {/* Repères immobiliers */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-bold text-foreground">Repères immobiliers moyens (DVF)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <span className="text-xs font-medium text-muted-foreground">Prix moyen maison</span>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {city.avg_price_sqm_house ? `${Number(city.avg_price_sqm_house).toLocaleString('fr-FR')} €` : 'N.C.'}
              <span className="text-xs font-normal text-muted-foreground"> / m²</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <span className="text-xs font-medium text-muted-foreground">Prix moyen appartement</span>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {city.avg_price_sqm_apt ? `${Number(city.avg_price_sqm_apt).toLocaleString('fr-FR')} €` : 'N.C.'}
              <span className="text-xs font-normal text-muted-foreground"> / m²</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparatif avec les communes voisines */}
      {nearbyCities.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground">Comparatif départemental</h2>
            <Link href={`/departement/${city.department_code}`} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Voir tout le département <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Commune</th>
                  <th className="px-4 py-3">Population</th>
                  <th className="px-4 py-3">Prix m² (appart.)</th>
                  <th className="px-4 py-3">Sécurité</th>
                  <th className="px-4 py-3 text-right">Note globale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="bg-primary/5 font-medium">
                  <td className="px-4 py-3 text-foreground">{city.name} (cette fiche)</td>
                  <td className="px-4 py-3">{Number(city.population).toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-3">{city.avg_price_sqm_apt ? `${Number(city.avg_price_sqm_apt).toLocaleString('fr-FR')} €` : '-'}</td>
                  <td className="px-4 py-3">{city.score_security}/10</td>
                  <td className="px-4 py-3 text-right font-bold text-primary">{city.score_overall}/10</td>
                </tr>
                {nearbyCities.map((c) => (
                  <tr key={c.slug} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/ville/${c.slug}`} className="hover:underline text-foreground">
                        {c.name} ({c.postal_code})
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{Number(c.population).toLocaleString('fr-FR')}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.avg_price_sqm_apt ? `${Number(c.avg_price_sqm_apt).toLocaleString('fr-FR')} €` : '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.score_security}/10</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{c.score_overall}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Retours d'expérience et avis */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-bold text-foreground">Avis et retours d'expérience</h2>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquareQuote className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">
              Aucun avis pour le moment
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Vous habitez ou avez vécu à {city.name} ? Partagez votre ressenti sur le cadre de vie, les services et les transports.
            </p>
          </div>
          <div>
            <button className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Donner mon avis sur {city.name}
            </button>
          </div>
        </div>
      </section>

      {/* Sources officielles et méthodologie */}
      <section className="mt-12 rounded-xl border border-border/60 bg-muted/20 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Sources officielles certifiées</h3>
            <p className="text-xs text-muted-foreground">Données Open Data issues des bases DVF (DGFiP), SSMSI (Intérieur) et Filosofi (INSEE).</p>
          </div>
        </div>
        <Link href="/methodologie" className="text-xs font-medium text-primary hover:underline whitespace-nowrap">
          En savoir plus
        </Link>
      </section>
    </main>
  );
}