import { supabase } from '@/lib/supabase';
import { getDemoCities } from '@/lib/mockData';
import type { Commune, Department, SearchResult } from '@/lib/types';

/**
 * Normalisation de chaîne pour la recherche : minuscules, sans accents,
 * prête pour une comparaison partielle insensible à la casse et aux diacritiques.
 */
function normalize(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Recherche unifiée sur les communes disponibles, qu'elles proviennent
 * des fiches de démonstration locales ou de la base Supabase.
 *
 * Tous les résultats sont fusionnés et triés par population décroissante.
 * La logique est isolée ici : remplacer le corps par un appel d'API
 * n'imposera aucune modification aux composants qui l'utilisent.
 *
 * Correspondance par nom, code postal, slug et département, insensible
 * aux accents et à la casse, en saisie partielle.
 */
export async function searchCommunesUnified(
  query: string,
): Promise<SearchResult[]> {
  const q = normalize(query);
  if (!q) return [];

  const [localResults, supabaseResults] = await Promise.all([
    searchLocalCities(q),
    searchSupabaseCommunes(q),
  ]);

  const all = [...localResults, ...supabaseResults];
  const seen = new Set<string>();
  const deduped = all.filter((r) => {
    if (seen.has(r.slug)) return false;
    seen.add(r.slug);
    return true;
  });

  deduped.sort((a, b) => b.population - a.population);
  return deduped;
}

function matchLocal(city: {
  slug: string;
  name: string;
  postalCode: string;
  departmentName: string;
  departmentSlug: string;
  regionName: string;
  population: number;
  isDemo: boolean;
}, q: string): boolean {
  const name = normalize(city.name);
  const slug = city.slug.toLowerCase();
  const postal = city.postalCode;
  const dept = normalize(city.departmentName);
  const deptSlug = city.departmentSlug.toLowerCase();
  const region = normalize(city.regionName);
  return (
    name.includes(q) ||
    slug.includes(q) ||
    postal.startsWith(q) ||
    dept.includes(q) ||
    deptSlug.includes(q) ||
    region.includes(q)
  );
}

function matchSupabase(c: Commune, q: string): boolean {
  const name = normalize(c.name);
  const slug = c.slug.toLowerCase();
  const postal = c.postal_code;
  const region = normalize(c.region);
  return (
    name.includes(q) ||
    slug.includes(q) ||
    postal.startsWith(q) ||
    region.includes(q)
  );
}

async function searchLocalCities(q: string): Promise<SearchResult[]> {
  const cities = getDemoCities();
  return cities
    .filter((city) => matchLocal(city, q))
    .map((city) => ({
      slug: city.slug,
      name: city.name,
      postalCode: city.postalCode,
      departmentName: city.departmentName,
      departmentCode: city.departmentSlug.split('-')[0] ?? null,
      region: city.regionName,
      population: city.population,
      isDemo: city.isDemo,
      source: 'local' as const,
    }));
}

async function searchSupabaseCommunes(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('communes')
    .select('slug, name, postal_code, department_code, region, population, is_demo')
    .order('population', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  const departments = await getDepartmentNames();

  return (data as Commune[])
    .filter((c) => matchSupabase(c, q))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      postalCode: c.postal_code,
      departmentName: departments[c.department_code] ?? c.department_code,
      departmentCode: c.department_code,
      region: c.region,
      population: c.population,
      isDemo: c.is_demo,
      source: 'supabase' as const,
    }));
}

async function getDepartmentNames(): Promise<Record<string, string>> {
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

/**
 * Récupère toutes les communes disponibles (local + Supabase) sans filtre.
 * Tri par population décroissante.
 */
export async function getAllSearchResults(): Promise<SearchResult[]> {
  const [localResults, supabaseResults] = await Promise.all([
    getAllLocalCities(),
    getAllSupabaseCommunes(),
  ]);

  const all = [...localResults, ...supabaseResults];
  const seen = new Set<string>();
  const deduped = all.filter((r) => {
    if (seen.has(r.slug)) return false;
    seen.add(r.slug);
    return true;
  });

  deduped.sort((a, b) => b.population - a.population);
  return deduped;
}

async function getAllLocalCities(): Promise<SearchResult[]> {
  const cities = getDemoCities();
  return cities.map((city) => ({
    slug: city.slug,
    name: city.name,
    postalCode: city.postalCode,
    departmentName: city.departmentName,
    departmentCode: city.departmentSlug.split('-')[0] ?? null,
    region: city.regionName,
    population: city.population,
    isDemo: city.isDemo,
    source: 'local' as const,
  }));
}

async function getAllSupabaseCommunes(): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('communes')
    .select('slug, name, postal_code, department_code, region, population, is_demo')
    .order('population', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  const departments = await getDepartmentNames();

  return (data as Commune[]).map((c) => ({
    slug: c.slug,
    name: c.name,
    postalCode: c.postal_code,
    departmentName: departments[c.department_code] ?? c.department_code,
    departmentCode: c.department_code,
    region: c.region,
    population: c.population,
    isDemo: c.is_demo,
    source: 'supabase' as const,
  }));
}
