import { supabase } from '@/lib/supabase';
import { getDemoCities } from '@/lib/mockData';
import type { City, Commune, CommuneIndicator, Department } from '@/lib/types';

/**
 * Modèle de comparaison unifié, indépendant du stockage.
 * Les fiches locales (City) et les communes Supabase sont mappées
 * vers ce format commun pour permettre une comparaison côte à côte.
 */

export type CompareMetric = {
  key: string;
  label: string;
  category: string;
  higherIsBetter: boolean;
};

export type CompareValue = {
  display: string;
  value: number | null;
};

export type CompareColumn = {
  slug: string;
  name: string;
  postalCode: string;
  departmentName: string;
  region: string;
  population: number;
  density: number | null;
  isDemo: boolean;
  source: 'local' | 'supabase';
  values: Record<string, CompareValue>;
};

export type CompareEntry = {
  slug: string;
  name: string;
  postalCode: string;
  region: string;
  isDemo: boolean;
  source: 'local' | 'supabase';
};

/** Les 10 indicateurs affichés dans la comparaison. */
export const COMPARE_METRICS: CompareMetric[] = [
  { key: 'overall', label: 'Note globale', category: 'Synthèse', higherIsBetter: true },
  { key: 'security', label: 'Sécurité', category: 'Synthèse', higherIsBetter: true },
  { key: 'education', label: 'Éducation', category: 'Synthèse', higherIsBetter: true },
  { key: 'amenities', label: 'Commerces et services', category: 'Synthèse', higherIsBetter: true },
  { key: 'realEstate', label: 'Immobilier (score)', category: 'Synthèse', higherIsBetter: true },
  { key: 'nature', label: 'Nature et espaces verts', category: 'Synthèse', higherIsBetter: true },
  { key: 'apartmentPriceM2', label: 'Prix au m² — appartement', category: 'Immobilier', higherIsBetter: false },
  { key: 'housePriceM2', label: 'Prix au m² — maison', category: 'Immobilier', higherIsBetter: false },
  { key: 'population', label: 'Population', category: 'Démographie', higherIsBetter: true },
  { key: 'density', label: 'Densité (hab./km²)', category: 'Démographie', higherIsBetter: true },
];

const MAX_COMMUNES = 4;

/**
 * Récupère toutes les communes disponibles (local + Supabase)
 * pour le sélecteur, sans doublons.
 */
export async function getAllCompareEntries(): Promise<CompareEntry[]> {
  const local = getDemoCities().map((c) => ({
    slug: c.slug,
    name: c.name,
    postalCode: c.postalCode,
    region: c.regionName,
    isDemo: c.isDemo,
    source: 'local' as const,
  }));

  const { data, error } = await supabase
    .from('communes')
    .select('slug, name, postal_code, region, is_demo')
    .order('name');
  if (error || !data) return local;

  const supabaseEntries = (data as Commune[]).map((c) => ({
    slug: c.slug,
    name: c.name,
    postalCode: c.postal_code,
    region: c.region,
    isDemo: c.is_demo,
    source: 'supabase' as const,
  }));

  const seen = new Set(local.map((e) => e.slug));
  const merged = [...local, ...supabaseEntries.filter((e) => !seen.has(e.slug))];
  merged.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  return merged;
}

/**
 * Charge les données de comparaison complètes pour les slugs donnés.
 * Fusionne les fiches locales et les communes Supabase.
 */
export async function loadCompareColumns(slugs: string[]): Promise<CompareColumn[]> {
  if (!slugs.length) return [];

  const localCities = getDemoCities();
  const localSlugs = new Set(localCities.map((c) => c.slug));
  const requestedLocal = slugs.filter((s) => localSlugs.has(s));
  const requestedSupabase = slugs.filter((s) => !localSlugs.has(s));

  const columns: CompareColumn[] = [];

  for (const slug of requestedLocal) {
    const city = localCities.find((c) => c.slug === slug);
    if (city) columns.push(mapLocalCity(city));
  }

  if (requestedSupabase.length) {
    const supabaseColumns = await loadSupabaseColumns(requestedSupabase);
    columns.push(...supabaseColumns);
  }

  columns.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
  return columns;
}

function mapLocalCity(city: City): CompareColumn {
  return {
    slug: city.slug,
    name: city.name,
    postalCode: city.postalCode,
    departmentName: city.departmentName,
    region: city.regionName,
    population: city.population,
    density: city.density,
    isDemo: city.isDemo,
    source: 'local',
    values: {
      overall: { display: `${city.scores.overall}/100`, value: city.scores.overall },
      security: { display: `${city.scores.security}/100`, value: city.scores.security },
      education: { display: `${city.scores.education}/100`, value: city.scores.education },
      amenities: { display: `${city.scores.amenities}/100`, value: city.scores.amenities },
      realEstate: { display: `${city.scores.realEstate}/100`, value: city.scores.realEstate },
      nature: { display: `${city.scores.nature}/100`, value: city.scores.nature },
      apartmentPriceM2: city.stats.apartmentPriceM2.display
        ? { display: city.stats.apartmentPriceM2.display, value: city.stats.apartmentPriceM2.value ?? null }
        : { display: '—', value: null },
      housePriceM2: city.stats.housePriceM2.display
        ? { display: city.stats.housePriceM2.display, value: city.stats.housePriceM2.value ?? null }
        : { display: '—', value: null },
      population: { display: new Intl.NumberFormat('fr-FR').format(city.population), value: city.population },
      density: { display: new Intl.NumberFormat('fr-FR').format(city.density), value: city.density },
    },
  };
}

async function loadSupabaseColumns(slugs: string[]): Promise<CompareColumn[]> {
  const { data: communesData, error } = await supabase
    .from('communes')
    .select('*, commune_indicators(*)')
    .in('slug', slugs);
  if (error || !communesData) return [];

  const departments = await getDepartmentMap();

  return (communesData as (Commune & { commune_indicators: CommuneIndicator[] })[]).map((c) => {
    const inds = c.commune_indicators ?? [];
    const get = (key: string): CompareValue => {
      const ind = inds.find((i) => i.indicator_key === key);
      if (!ind) return { display: '—', value: null };
      return { display: ind.value_label ?? String(ind.value), value: Number(ind.value) };
    };

    const density = c.area_km2 && Number(c.area_km2) > 0
      ? Math.round(c.population / Number(c.area_km2))
      : null;

    return {
      slug: c.slug,
      name: c.name,
      postalCode: c.postal_code,
      departmentName: departments[c.department_code] ?? c.department_code,
      region: c.region,
      population: c.population,
      density,
      isDemo: c.is_demo,
      source: 'supabase',
      values: {
        overall: { display: '—', value: null },
        security: mapSecurityScore(inds),
        education: mapEducationScore(inds),
        amenities: mapAmenitiesScore(inds),
        realEstate: { display: '—', value: null },
        nature: mapNatureScore(inds),
        apartmentPriceM2: get('median_price_m2'),
        housePriceM2: get('median_price_m2'),
        population: { display: new Intl.NumberFormat('fr-FR').format(c.population), value: c.population },
        density: density !== null
          ? { display: new Intl.NumberFormat('fr-FR').format(density), value: density }
          : { display: '—', value: null },
      },
    };
  });
}

function mapSecurityScore(inds: CommuneIndicator[]): CompareValue {
  const crime = inds.find((i) => i.indicator_key === 'crime_rate');
  if (!crime) return { display: '—', value: null };
  return { display: crime.value_label ?? String(crime.value), value: Number(crime.value) };
}

function mapEducationScore(inds: CommuneIndicator[]): CompareValue {
  const school = inds.find((i) => i.indicator_key === 'school_score');
  if (!school) return { display: '—', value: null };
  return { display: school.value_label ?? String(school.value), value: Number(school.value) };
}

function mapAmenitiesScore(inds: CommuneIndicator[]): CompareValue {
  const shops = inds.find((i) => i.indicator_key === 'shops_per_1000');
  if (!shops) return { display: '—', value: null };
  return { display: shops.value_label ?? String(shops.value), value: Number(shops.value) };
}

function mapNatureScore(inds: CommuneIndicator[]): CompareValue {
  const green = inds.find((i) => i.indicator_key === 'green_space_pct');
  if (!green) return { display: '—', value: null };
  return { display: green.value_label ?? String(green.value), value: Number(green.value) };
}

async function getDepartmentMap(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('departments')
    .select('code, name');
  if (error || !data) return {};
  const map: Record<string, string> = {};
  for (const d of data as Department[]) {
    map[d.code] = d.name;
  }
  return map;
}

export { MAX_COMMUNES };
