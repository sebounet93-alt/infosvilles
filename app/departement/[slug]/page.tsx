import { notFound } from 'next/navigation';
import Link from 'next/link';
import pool from '@/lib/db';
import { CityCard } from '@/components/home/city-card';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const res = await pool.query(
    `SELECT department_name, department_code FROM cities WHERE LOWER(department_code) = LOWER($1) OR LOWER(REPLACE(department_name, ' ', '-')) = LOWER($1) LIMIT 1`,
    [slug]
  );
  const dept = res.rows[0];
  if (!dept) return {};

  return pageMetadata({
    title: `${dept.department_name} (${dept.department_code}) : immobilier, cadre de vie et données`,
    description: `Découvrez les statistiques officielles des communes du département ${dept.department_name} : prix au m², sécurité et services.`,
    path: `/departement/${slug}`,
  });
}

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;

  const res = await pool.query(`
    SELECT 
      insee_code,
      slug,
      name,
      postal_code,
      department_code,
      department_name,
      region_name,
      population,
      score_overall,
      score_security,
      score_education,
      score_amenities,
      avg_price_sqm_house,
      avg_price_sqm_apt,
      ai_synthesis
    FROM cities 
    WHERE LOWER(department_code) = LOWER($1) OR LOWER(REPLACE(department_name, ' ', '-')) = LOWER($1)
    ORDER BY population DESC
    LIMIT 20
  `, [slug]);

  if (res.rows.length === 0) {
    notFound();
  }

  const deptName = res.rows[0].department_name;
  const deptCode = res.rows[0].department_code;

  const cities = res.rows.map((row) => ({
    inseeCode: row.insee_code,
    slug: row.slug,
    name: row.name,
    postalCode: row.postal_code,
    departmentCode: row.department_code,
    departmentName: row.department_name,
    regionName: row.region_name,
    population: Number(row.population),
    scores: {
      overall: Math.round(Number(row.score_overall) * 10),
      security: Math.round(Number(row.score_security) * 10),
      education: Math.round(Number(row.score_education) * 10),
      amenities: Math.round(Number(row.score_amenities) * 10),
      realEstate: 70,
      nature: 70,
    },
    stats: {
      apartmentPriceM2: {
        raw: Number(row.avg_price_sqm_apt),
        display: `${Number(row.avg_price_sqm_apt).toLocaleString('fr-FR')} €`,
      },
      housePriceM2: {
        raw: Number(row.avg_price_sqm_house),
        display: `${Number(row.avg_price_sqm_house).toLocaleString('fr-FR')} €`,
      },
    },
    lastUpdated: new Date().toISOString(),
    aiSynthesis: row.ai_synthesis,
  }));

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <Link href="/recherche" className="text-sm text-muted-foreground hover:underline">
          ← Retour à la recherche
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Communes du département : {deptName} ({deptCode})
        </h1>
        <p className="mt-2 text-muted-foreground">
          Données officielles consolidées pour les principales villes du territoire.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <CityCard key={city.slug} city={city as any} />
        ))}
      </div>
    </main>
  );
}