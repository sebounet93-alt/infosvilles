import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, ArrowRight } from 'lucide-react';
import { getDepartmentByCode, getCommunesByDepartment, getDepartments } from '@/lib/mockData';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { CommuneCard } from '@/components/search';
import { Badge } from '@/components/ui/badge';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((d) => ({ slug: d.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const department = await getDepartmentByCode(params.slug);
  if (!department) return { title: 'Département introuvable', robots: { index: false, follow: false } };

  const communes = await getCommunesByDepartment(department.code);
  const hasContent = communes.length > 0;

  return pageMetadata({
    title: `${department.name} — communes analysées`,
    description: `Découvrez les communes analysées par InfosVilles dans le département ${department.name} (${department.region}).${hasContent ? '' : ' Aucune commune disponible pour l’instant dans ce département — prototype en démonstration.'}`,
    path: `/departement/${params.slug}`,
    robots: hasContent ? undefined : { index: false, follow: true },
  });
}

export default async function DepartmentPage({ params }: Props) {
  const department = await getDepartmentByCode(params.slug);
  if (!department) notFound();

  const communes = await getCommunesByDepartment(department.code);

  const breadcrumbJson = breadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Départements', path: '/departements' },
    { name: department.name, path: `/departement/${params.slug}` },
  ]);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <Link
        href="/departements"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Tous les départements
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-accent" aria-hidden="true" /> {department.region}
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
          {department.name}
        </h1>
        {department.is_demo && (
          <Badge
            variant="outline"
            className="mt-3 border-warning/50 text-warning-foreground bg-warning/10"
          >
            Exemple de démonstration
          </Badge>
        )}
      </header>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold">
          {communes.length} commune{communes.length > 1 ? 's' : ''}
        </h2>
        {communes.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {communes.map((c) => (
              <CommuneCard key={c.id} commune={c} indicators={c.commune_indicators ?? []} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Aucune commune analysée dans ce département pour l’instant.
          </p>
        )}
      </section>
    </main>
  );
}
