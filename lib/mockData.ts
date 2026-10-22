import { supabase } from '@/lib/supabase';
import type {
  City,
  Commune,
  CommuneIndicator,
  CommuneWithRelations,
  Department,
  Indicator,
  IndicatorRange,
  Strength,
  Testimonial,
} from '@/lib/types';

/**
 * Couche d'accès aux données.
 *
 * Les composants ne dépendent que des types de lib/types.ts : remplacer
 * ces fonctions par un appel d'API ne nécessitera aucune modification
 * de l'interface.
 */

/* ============================================================
 * Données City — Exemple de démonstration
 *
 * Bordeaux et Annecy : données étiquetées isDemo = true. Elles
 * illustrent le modèle éditorial et seront remplacées par des
 * données officielles réelles. Aucune précision statistique
 * inventée : les valeurs absentes sont marquées comme telles.
 * ============================================================ */

const DEMO_BORDEAUX: City = {
  slug: 'bordeaux-33000',
  name: 'Bordeaux',
  postalCode: '33000',
  inseeCode: '33063',
  departmentName: 'Gironde',
  departmentSlug: '33-gironde',
  regionName: 'Nouvelle-Aquitaine',
  population: 261804,
  density: 4970,
  lastUpdated: '2026-10-01',
  isDemo: true,
  scores: {
    overall: 74,
    security: 62,
    education: 78,
    amenities: 88,
    realEstate: 61,
    nature: 72,
  },
  stats: {
    housePriceM2: {
      value: 4650,
      display: '4 650 €/m²',
      unit: '€/m²',
      referencePeriod: '2025 (T2)',
      scope: 'commune',
      sourceName: 'Notaires de France — bases BIEN (Exemple de source envisagée)',
      definition: 'Prix moyen des ventes de maisons anciennes sur l’année de référence. Chiffre fictif de démonstration.',
    },
    apartmentPriceM2: {
      value: 4380,
      display: '4 380 €/m²',
      unit: '€/m²',
      referencePeriod: '2025 (T2)',
      scope: 'commune',
      sourceName: 'Notaires de France — bases BIEN (Exemple de source envisagée)',
      definition: 'Prix moyen des ventes d’appartements anciens sur l’année de référence. Chiffre fictif de démonstration.',
    },
    propertyTaxRate: {
      value: 44.08,
      display: '44,08 %',
      unit: '%',
      referencePeriod: '2024',
      scope: 'commune',
      sourceName: 'DGCL — données locales (Exemple de source envisagée)',
      definition: 'Taux communal de taxe foncière sur les propriétés bâties, avant revenus. Chiffre fictif de démonstration.',
    },
    crimeRate: {
      value: 74.5,
      display: '74,5 ‰',
      unit: 'pour 1 000 habitants',
      referencePeriod: '2024',
      scope: 'departement',
      sourceName: 'SSMSI — données de la délinquance (Exemple de source envisagée)',
      definition:
        'Faits constatés pour 1 000 habitants, à la maille départementale (Gironde). Les infractions sont comptabilisées au lieu de la commission, pas au lieu de résidence.',
    },
  },
  sources: [
    {
      name: 'Notaires de France — bases BIEN (Exemple de source envisagée)',
      url: 'https://www.immobilier.notaires.fr',
      consultedAt: '2026-10-01',
      indicators: [
        { key: 'housePriceM2', label: 'Prix moyen au m² — maison' },
        { key: 'apartmentPriceM2', label: 'Prix moyen au m² — appartement' },
      ],
    },
    {
      name: 'DGCL — données locales des finances publiques (Exemple de source envisagée)',
      url: 'https://www.collectivites-locales.gouv.fr',
      consultedAt: '2026-10-01',
      indicators: [{ key: 'propertyTaxRate', label: 'Taxe foncière (taux communal)' }],
    },
    {
      name: 'SSMSI — données de la délinquance enregistrée (Exemple de source envisagée)',
      url: 'https://www.interieur.gouv.fr/publications/statistiques-de-la-delinquance',
      consultedAt: '2026-10-01',
      indicators: [{ key: 'crimeRate', label: 'Taux de criminalité (pour 1 000 hab.)' }],
    },
    {
      name: 'INSEE — populations légales et densité (Exemple de source envisagée)',
      url: 'https://www.insee.fr',
      consultedAt: '2026-10-01',
      indicators: [
        { key: 'population', label: 'Population' },
        { key: 'density', label: 'Densité' },
      ],
    },
  ],
  summary: [
    'Bordeaux concentre les attraits d’une grande ville : offre culturelle dense, tramway étendu, commerce de proximité abondant et quartiers animés à proximité du centre historique. La commune attire depuis vingt ans de nouveaux arrivants, ce qui soutient un marché immobilier dynamique et une offre de services en constante évolution.',
    'Cette attractivité a un coût. Les prix au m² restent élevés au regard des revenus médians locaux, l’accès au logement des ménages modestes est tendu, et la densité du trafic comme la pression foncière sont des sujets régulièrement cités par les habitants. La délinquance enregistrée, suivie ici à la maille départementale, place la Gironde dans une position intermédiaire au niveau national : la donnée mérite d’être lue avec cette limite de lecture.',
  ],
  reviews: [
    {
      id: 'bdx-review-1',
      authorName: 'Camille',
      publishedAt: '2026-08-14',
      rating: 4,
      strengths: [
        'Transports en commun fiables (tram et bus)',
        'Nombreux commerces et services de proximité',
      ],
      improvements: ['Trafic aux heures de pointe', 'Coût du logement élevé'],
      moderationStatus: 'approved',
      verificationStatus: 'unverified',
    },
    {
      id: 'bdx-review-2',
      authorName: 'Nicolas',
      publishedAt: '2026-09-02',
      rating: 3,
      strengths: ['Cadre agréable autour de la Garonne', 'Vie associative riche'],
      improvements: ['Stationnement difficile', 'Bruit dans certains quartiers centraux'],
      moderationStatus: 'approved',
      verificationStatus: 'unverified',
    },
  ],
  faq: [
    {
      question: 'Quel est le prix au m² à Bordeaux ?',
      answer:
        'Dans notre démonstration, le prix affiché est d’environ 4 380 €/m² pour un appartement et 4 650 €/m² pour une maison (chiffres fictifs, source envisagée : Notaires de France, bases BIEN). Ces valeurs illustratives ne reflètent pas le marché réel et seront remplacées par des données officielles.',
    },
    {
      question: 'La sécurité à Bordeaux : que faut-il retenir ?',
      answer:
        'L’indicateur de délinquance présenté est suivi à la maille départementale (Gironde) et exprimé pour 1 000 habitants. Il décrit des faits constatés, pas le ressenti de chaque quartier : une lecture locale, à l’échelle du voisinage, reste indispensable.',
    },
    {
      question: 'Comment se déplacer à Bordeaux ?',
      answer:
        'Le réseau de tramway couvre une grande partie de la commune et complète les lignes de bus et les pistes cyclables. La desserte varie selon les quartiers, notamment en périphérie ; les horaires et lignes évoluent chaque année.',
    },
  ],
};

const DEMO_ANNECY: City = {
  slug: 'annecy-74000',
  name: 'Annecy',
  postalCode: '74000',
  inseeCode: '74010',
  departmentName: 'Haute-Savoie',
  departmentSlug: '74-haute-savoie',
  regionName: 'Auvergne-Rhône-Alpes',
  population: 130721,
  density: 3810,
  lastUpdated: '2026-10-01',
  isDemo: true,
  scores: {
    overall: 79,
    security: 76,
    education: 74,
    amenities: 71,
    realEstate: 43,
    nature: 92,
  },
  stats: {
    housePriceM2: {
      value: 5310,
      display: '5 310 €/m²',
      unit: '€/m²',
      referencePeriod: '2025 (T2)',
      scope: 'commune',
      sourceName: 'Notaires de France — bases BIEN (Exemple de source envisagée)',
      definition: 'Prix moyen des ventes de maisons anciennes sur l’année de référence. Chiffre fictif de démonstration.',
    },
    apartmentPriceM2: {
      value: 5490,
      display: '5 490 €/m²',
      unit: '€/m²',
      referencePeriod: '2025 (T2)',
      scope: 'commune',
      sourceName: 'Notaires de France — bases BIEN (Exemple de source envisagée)',
      definition: 'Prix moyen des ventes d’appartements anciens sur l’année de référence. Chiffre fictif de démonstration.',
    },
    propertyTaxRate: {
      value: 37.62,
      display: '37,62 %',
      unit: '%',
      referencePeriod: '2024',
      scope: 'commune',
      sourceName: 'DGCL — données locales (Exemple de source envisagée)',
      definition: 'Taux communal de taxe foncière sur les propriétés bâties, avant revenus. Chiffre fictif de démonstration.',
    },
    crimeRate: {
      value: 41.8,
      display: '41,8 ‰',
      unit: 'pour 1 000 habitants',
      referencePeriod: '2024',
      scope: 'departement',
      sourceName: 'SSMSI — données de la délinquance (Exemple de source envisagée)',
      definition:
        'Faits constatés pour 1 000 habitants, à la maille départementale (Haute-Savoie). Les infractions sont comptabilisées au lieu de la commission, pas au lieu de résidence.',
    },
  },
  sources: [
    {
      name: 'Notaires de France — bases BIEN (Exemple de source envisagée)',
      url: 'https://www.immobilier.notaires.fr',
      consultedAt: '2026-10-01',
      indicators: [
        { key: 'housePriceM2', label: 'Prix moyen au m² — maison' },
        { key: 'apartmentPriceM2', label: 'Prix moyen au m² — appartement' },
      ],
    },
    {
      name: 'DGCL — données locales des finances publiques (Exemple de source envisagée)',
      url: 'https://www.collectivites-locales.gouv.fr',
      consultedAt: '2026-10-01',
      indicators: [{ key: 'propertyTaxRate', label: 'Taxe foncière (taux communal)' }],
    },
    {
      name: 'SSMSI — données de la délinquance enregistrée (Exemple de source envisagée)',
      url: 'https://www.interieur.gouv.fr/publications/statistiques-de-la-delinquance',
      consultedAt: '2026-10-01',
      indicators: [{ key: 'crimeRate', label: 'Taux de criminalité (pour 1 000 hab.)' }],
    },
    {
      name: 'INSEE — populations légales et densité (Exemple de source envisagée)',
      url: 'https://www.insee.fr',
      consultedAt: '2026-10-01',
      indicators: [
        { key: 'population', label: 'Population' },
        { key: 'density', label: 'Densité' },
      ],
    },
  ],
  summary: [
    'Annecy bénéficie d’un environnement naturel remarquable : lac, montagnes et réseau de pistes cyclables structurent le quotidien. La commune propose une offre scolaire complète et un cadre de vie que beaucoup d’habitants citent comme un motif d’installation durable.',
    'Le marché immobilier est très tendu : les prix au m² dépassent nettement les moyennes régionales, portés par la demande intérieure et la résidence secondaire. Les ménages cherchant un premier logement peuvent en ressentir fortement l’effet, et certaines zones sont exposées à la saturation touristique en saison. L’indicateur de délinquance départemental reste, dans notre exemple, inférieur aux moyennes des grandes métropoles.',
  ],
  reviews: [
    {
      id: 'ncy-review-1',
      authorName: 'Élodie',
      publishedAt: '2026-07-21',
      rating: 5,
      strengths: ['Accès au lac et aux montagnes', 'Réseau cyclable très développé'],
      improvements: ['Immobilier hors de portée pour beaucoup de ménages'],
      moderationStatus: 'approved',
      verificationStatus: 'unverified',
    },
    {
      id: 'ncy-review-2',
      authorName: 'Thomas',
      publishedAt: '2026-08-30',
      rating: 4,
      strengths: ['Écoles bien notées', 'Cadre naturel exceptionnel'],
      improvements: ['Affluence touristique en été', 'Transports en commun à renforcer en périphérie'],
      moderationStatus: 'approved',
      verificationStatus: 'unverified',
    },
  ],
  faq: [
    {
      question: 'Quel est le prix au m² à Annecy ?',
      answer:
        'Dans notre démonstration, le prix affiché est d’environ 5 490 €/m² pour un appartement et 5 310 €/m² pour une maison (chiffres fictifs, source envisagée : Notaires de France, bases BIEN). Ces valeurs illustratives ne reflètent pas le marché réel et seront remplacées par des données officielles.',
    },
    {
      question: 'La sécurité à Annecy : que faut-il retenir ?',
      answer:
        'L’indicateur présenté est départemental (Haute-Savoie) et exprimé en faits constatés pour 1 000 habitants. Il ne remplace pas une lecture quartier par quartier, surtout dans les zones très fréquentées en saison.',
    },
    {
      question: 'Comment se déplacer à Annecy ?',
      answer:
        'Le réseau cyclable est l’un des plus développés de France pour une commune de cette taille, complété par des lignes de bus. La desserte ferroviaire relie Annecy à Lyon et Genève, avec des temps de trajet variables selon les horaires.',
    },
  ],
};

const DEMO_CITIES: City[] = [DEMO_BORDEAUX, DEMO_ANNECY];

export function getDemoCities(): City[] {
  return DEMO_CITIES;
}

export async function getCitySlugs(): Promise<string[]> {
  return DEMO_CITIES.map((c) => c.slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return DEMO_CITIES.find((c) => c.slug === slug);
}

/* ============================================================
 * Données issues de Supabase (fiches et listes)
 * ============================================================ */

export async function getFeaturedCommunes(limit = 6): Promise<CommuneWithRelations[]> {
  const { data, error } = await supabase
    .from('communes')
    .select('*, commune_indicators(*)')
    .order('population', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as CommuneWithRelations[];
}

export async function searchCommunes(params: {
  query?: string;
  limit?: number;
}): Promise<CommuneWithRelations[]> {
  const { query, limit = 24 } = params;
  let q = supabase
    .from('communes')
    .select('*, commune_indicators(*)')
    .order('population', { ascending: false });
  if (query) {
    q = q.or(`name.ilike.%${query}%,postal_code.ilike.%${query}%,region.ilike.%${query}%`);
  }
  const { data, error } = await q.limit(limit);
  if (error) return [];
  return (data ?? []) as CommuneWithRelations[];
}

export async function getCommuneBySlug(slug: string): Promise<Commune | null> {
  const { data, error } = await supabase
    .from('communes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as Commune;
}

export async function getAllIndicators(): Promise<Indicator[]> {
  const { data, error } = await supabase.from('indicators').select('*').order('category');
  if (error) return [];
  return (data ?? []) as Indicator[];
}

export async function getCommuneIndicators(communeId: string): Promise<CommuneIndicator[]> {
  const { data, error } = await supabase
    .from('commune_indicators')
    .select('*')
    .eq('commune_id', communeId);
  if (error) return [];
  return (data ?? []) as CommuneIndicator[];
}

export async function getStrengths(communeId: string): Promise<Strength[]> {
  const { data, error } = await supabase
    .from('strengths')
    .select('*')
    .eq('commune_id', communeId)
    .order('type');
  if (error) return [];
  return (data ?? []) as Strength[];
}

export async function getApprovedTestimonials(communeId: string, limit = 8): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('commune_id', communeId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as Testimonial[];
}

export async function getIndicatorRanges(): Promise<Record<string, IndicatorRange>> {
  const { data, error } = await supabase.from('commune_indicators').select('indicator_key, value');
  if (error) return {};
  const ranges: Record<string, IndicatorRange> = {};
  for (const row of data ?? []) {
    const r = ranges[row.indicator_key] ?? { min: Infinity, max: -Infinity };
    r.min = Math.min(r.min, row.value);
    r.max = Math.max(r.max, row.value);
    ranges[row.indicator_key] = r;
  }
  return ranges;
}

export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from('departments').select('*').order('name');
  if (error) return [];
  return (data ?? []) as Department[];
}

export async function getDepartmentByCode(code: string): Promise<Department | null> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('code', code)
    .maybeSingle();
  if (error || !data) return null;
  return data as Department;
}

export async function getCommunesByDepartment(code: string): Promise<CommuneWithRelations[]> {
  const { data, error } = await supabase
    .from('communes')
    .select('*, commune_indicators(*)')
    .eq('department_code', code)
    .order('population', { ascending: false });
  if (error) return [];
  return (data ?? []) as CommuneWithRelations[];
}

export async function getCommunesBySlugs(slugs: string[]): Promise<CommuneWithRelations[]> {
  if (!slugs.length) return [];
  const { data, error } = await supabase
    .from('communes')
    .select('*, commune_indicators(*)')
    .in('slug', slugs);
  if (error) return [];
  const ordered = (data ?? []) as CommuneWithRelations[];
  ordered.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
  return ordered;
}

export async function getCommuneCount(): Promise<number> {
  const { count, error } = await supabase
    .from('communes')
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function getIndicatorCount(): Promise<number> {
  const { count, error } = await supabase
    .from('indicators')
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}
