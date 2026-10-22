import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Users, Gauge, CalendarClock, Info, Scale, GitCompare, Search } from 'lucide-react';
import { getCityBySlug, getCitySlugs } from '@/lib/mockData';
import { pageMetadata, placeJsonLd, faqPageJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { formatPopulation, formatDate } from '@/lib/data';
import {
  ReviewCard,
  CityFaq,
  SourcesPanel,
  DataDisclaimer,
  IndicatorCards,
  DemoReviewForm,
  RealEstateTable,
} from '@/components/city';
import { Badge } from '@/components/ui/badge';
import { toneForScore } from '@/components/home/score-tone';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return (await getCitySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.slug);
  if (!city) return { title: 'Commune introuvable', robots: { index: false, follow: false } };

  return pageMetadata({
    title: `Cadre de vie et immobilier à ${city.name} | InfosVilles`,
    description: `Analyse de ${city.name} (${city.regionName}, ${city.departmentName}) : prix immobilier, sécurité, éducation, services, nature. Fiche de démonstration — données fictives, sources envisagées.`,
    path: `/ville/${params.slug}`,
    type: 'article',
  });
}

export default async function VillePage({ params }: Props) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  const tone = toneForScore(city.scores.overall);

  const placeJson = placeJsonLd({
    name: city.name,
    region: city.regionName,
    postalCode: city.postalCode,
    description: `Analyse du cadre de vie et de l’immobilier à ${city.name} (${city.postalCode}).`,
  });
  const faqJson = faqPageJsonLd(city.faq.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbJson = breadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: city.departmentName, path: `/departement/${city.departmentSlug}` },
    { name: city.name, path: `/ville/${params.slug}` },
  ]);

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([placeJson, faqJson, breadcrumbJson]) }} />

      {/* Fil d'Ariane */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/departement/${city.departmentSlug}`}>
              {city.departmentName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{city.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête */}
      <header className="mt-6">
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Cadre de vie et immobilier à {city.name} ({city.postalCode})
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" aria-hidden="true" />
            {formatPopulation(city.population)} hab.
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            {formatPopulation(city.density)} hab./km²
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {city.departmentName} · {city.regionName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Mise à jour : {formatDate(city.lastUpdated)}
          </span>
        </div>

        {/* Note globale avec texte alternatif */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-primary/10"
              role="img"
              aria-label={`Note globale : ${city.scores.overall}/100`}
            >
              <span className="text-xl font-semibold text-primary">{city.scores.overall}</span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Note globale : {city.scores.overall}/100
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Indicateur composite de démonstration calculé à partir des cinq dimensions affichées ci-dessous.
              </p>
              <Link
                href="/methodologie#score"
                className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Comprendre cette note
              </Link>
            </div>
            {city.isDemo && (
              <Badge variant="outline" className="border-warning/50 text-warning-foreground bg-warning/10">
                Exemple de démonstration
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Note de non-conseil */}
      <div className="mt-6">
        <DataDisclaimer />
      </div>

      {/* Analyse InfosVilles */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">L’analyse InfosVilles</h2>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
          Synthèse éditoriale rédigée par l’équipe, à partir de données documentées —
          non générée automatiquement, sans objectivité garantie.
        </p>
        <div className="reading-width mt-4 space-y-4">
          {city.summary.map((p, i) => (
            <p key={i} className="text-pretty text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Scale className="h-4 w-4" aria-hidden="true" />
            Sources associées ci-dessous.
          </span>
          <Link href="/methodologie" className="font-medium text-primary hover:underline">
            Voir la méthodologie
          </Link>
        </div>
      </section>

      {/* Indicateurs */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Les cinq indicateurs</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Score numérique, barre de progression et interprétation : trois façons de
          lire la même donnée.
        </p>
        <div className="mt-6">
          <IndicatorCards
            scores={city.scores}
            securityScope={city.stats.crimeRate?.scope ?? null}
          />
        </div>
      </section>

      {/* Cette commune correspond-elle à votre projet ? */}
      <section className="mt-12">
        <div className="rounded-2xl border border-border bg-muted/20 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Cette commune correspond-elle à votre projet&nbsp;?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Comparez-la avec une autre commune ou poursuivez votre recherche parmi
            les communes disponibles.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/comparer?with=${city.slug}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <GitCompare className="h-4 w-4" aria-hidden="true" />
              Comparer avec une autre commune
            </Link>
            <Link
              href="/recherche"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-soft hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Chercher une autre commune
            </Link>
          </div>
        </div>
      </section>

      {/* Immobilier et budget */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Immobilier et budget</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sur mobile, faites défiler le tableau horizontalement : les intitulés
          restent associés à chaque valeur.
        </p>
        <div className="mt-6">
          <RealEstateTable stats={city.stats} />
        </div>
      </section>

      {/* Avis habitants */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Avis d’habitants</h2>
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground" role="note">
          <Info className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
          Les avis affichés sont fictifs et de démonstration, étiquetés comme tels.
          À terme, ils refléteront des expériences personnelles modérées, jamais
          présentées comme vérifiés.
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {city.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      {/* À découvrir aussi */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">À découvrir aussi</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InternalLinkCard
            href={`/departement/${city.departmentSlug}`}
            title={city.departmentName}
            desc="Autres communes analysées dans le département"
          />
          <InternalLinkCard
            href="/classement"
            title="Classement des communes"
            desc="Comparer les scores de toutes les communes analysées"
          />
        </div>
      </section>

      {/* Partager mon expérience (action secondaire) */}
      <section id="laisser-un-avis" className="mt-12 scroll-mt-24">
        <div className="rounded-2xl border border-border bg-muted/20 p-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Partager mon expérience sur {city.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Vous habitez ou avez habité à {city.name}&nbsp;? À terme, vous pourrez
            partager votre témoignage pour aider d’autres personnes.
          </p>
          <Link
            href="#avis-form"
            className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-6 text-sm font-medium text-primary transition-soft hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Partager mon expérience
          </Link>
        </div>
        <div id="avis-form" className="mt-6 scroll-mt-24">
          <DemoReviewForm cityName={city.name} />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Questions fréquentes</h2>
        <div className="mt-4">
          <CityFaq items={city.faq} />
        </div>
      </section>

      {/* Sources */}
      <section className="mt-12">
        <SourcesPanel sources={city.sources} />
      </section>
    </main>
  );
}

function InternalLinkCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
    >
      <span className="block font-medium text-foreground">{title}</span>
      <span className="mt-1 block text-xs text-muted-foreground text-pretty">{desc}</span>
    </Link>
  );
}
