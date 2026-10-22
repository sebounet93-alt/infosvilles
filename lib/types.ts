export type Department = {
  id: string;
  code: string;
  name: string;
  region: string;
  slug: string;
  is_demo: boolean;
};

export type Commune = {
  id: string;
  slug: string;
  name: string;
  postal_code: string;
  department_code: string;
  region: string;
  population: number;
  area_km2: number | null;
  latitude: number | null;
  longitude: number | null;
  short_description: string | null;
  is_demo: boolean;
};

export type Indicator = {
  id: string;
  key: string;
  label: string;
  category: string;
  unit: string | null;
  source_name: string;
  source_url: string | null;
  description: string | null;
  is_demo: boolean;
};

export type CommuneIndicator = {
  id: string;
  commune_id: string;
  indicator_key: string;
  value: number;
  value_label: string | null;
  updated_at: string;
  is_demo: boolean;
};

export type Strength = {
  id: string;
  commune_id: string;
  label: string;
  type: 'strength' | 'limitation';
  category: string;
  is_demo: boolean;
};

export type Testimonial = {
  id: string;
  commune_id: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  resident_since: number | null;
  status: 'pending' | 'approved' | 'rejected';
  is_demo: boolean;
  created_at: string;
};

export type CommuneWithRelations = Commune & {
  commune_indicators: CommuneIndicator[];
  indicators: CommuneIndicator[];
  strengths: Strength[];
  testimonials: Testimonial[];
  department?: Department;
};

export type IndicatorRange = {
  min: number;
  max: number;
};

export type NavItem = {
  label: string;
  href: string;
};

/**
 * Résultat de recherche unifié, indépendant du stockage.
 * Issu soit des fiches City locales (démo), soit des communes Supabase.
 */
export type SearchResult = {
  slug: string;
  name: string;
  postalCode: string;
  departmentName: string;
  departmentCode: string | null;
  region: string;
  population: number;
  isDemo: boolean;
  /** Source d'origine pour audit : 'local' (fiche démo) ou 'supabase'. */
  source: 'local' | 'supabase';
};

/* ============================================================
 * Modèle City — v2
 *
 * Représentation éditoriale d'une commune, indépendante du stockage
 * (Supabase aujourd'hui, API demain). Toutes les données numériques
 * sont optionnelles : une valeur indisponible se rend « Donnée non
 * disponible », jamais un nombre inventé.
 * ============================================================ */

/** Niveau territorial d'une donnée : communale, départementale ou nationale. */
export type DataScope = 'commune' | 'departement' | 'national';

export type CityScores = {
  /** Score global sur 100. */
  overall: number;
  security: number;
  education: number;
  amenities: number;
  realEstate: number;
  nature: number;
};

export type CityStatValue = {
  /** Valeur numérique si disponible. Absent => « Donnée non disponible ». */
  value?: number;
  /** Libellé affiché si disponible (ex. « 4 650 €/m² »). */
  display?: string;
  /** Unité et période de référence, affichées systématiquement. */
  unit: string;
  /** Année ou période de référence de la donnée. */
  referencePeriod: string;
  /** Portée de la donnée (commune, département ou national). */
  scope: DataScope;
  /** Source qui fonde cette statistique. */
  sourceName: string;
  /** Définition courte affichée en aide contextuelle. */
  definition?: string;
};

export type CityStats = {
  /** Prix moyen au m² — maison. */
  housePriceM2: CityStatValue;
  /** Prix moyen au m² — appartement. */
  apartmentPriceM2: CityStatValue;
  /** Taxe foncière (taux communal, en %). */
  propertyTaxRate: CityStatValue;
  /** Taux de criminalité pour 1 000 habitants, si la source est clairement définie. */
  crimeRate: CityStatValue | null;
};

export type SourceIndicator = {
  /** Clé de l'indicateur couvert (ex. 'housePriceM2'). */
  key: string;
  label: string;
};

export type CitySource = {
  name: string;
  url: string;
  /** Date de consultation au format ISO. */
  consultedAt: string;
  indicators: SourceIndicator[];
};

export type CityReview = {
  id: string;
  /** Prénom ou pseudonyme. */
  authorName: string;
  /** Date de publication ISO. */
  publishedAt: string;
  /** Note de 1 à 5. */
  rating: number;
  strengths: string[];
  improvements: string[];
  moderationStatus: 'pending' | 'approved' | 'rejected';
  /**
   * Statut de vérification. Le site ne vérifiant ni l'identité ni la
   * résidence, la valeur est toujours 'unverified' et l'interface affiche
   * « Avis publié après modération ».
   */
  verificationStatus: 'unverified' | 'verified';
};

export type CityFaqItem = {
  question: string;
  answer: string;
};

export type City = {
  slug: string;
  name: string;
  postalCode: string;
  inseeCode: string;
  departmentName: string;
  departmentSlug: string;
  regionName: string;
  population: number;
  /** Densité en habitants/km². */
  density: number;
  /** Date de dernière mise à jour des données, ISO. */
  lastUpdated: string;
  isDemo: boolean;
  scores: CityScores;
  stats: CityStats;
  sources: CitySource[];
  /** Synthèse éditoriale en deux paragraphes, équilibrée et non promotionnelle. */
  summary: [string, string];
  reviews: CityReview[];
  faq: CityFaqItem[];
};
