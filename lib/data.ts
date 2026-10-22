import type { CommuneIndicator, Indicator } from '@/lib/types';

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('fr-FR', opts).format(n);
}

export function formatPopulation(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function latestIndicatorDate(values: CommuneIndicator[]): string {
  if (!values.length) return '—';
  const d = values.reduce(
    (acc, v) => (v.updated_at > acc ? v.updated_at : acc),
    values[0].updated_at,
  );
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(d));
}

export const INDICATOR_KEYS = [
  'median_price_m2',
  'rental_yield',
  'unemployment_rate',
  'average_income',
  'crime_rate',
  'school_score',
  'transport_score',
  'green_space_pct',
  'air_quality',
  'shops_per_1000',
] as const;

export const INDICATOR_CATEGORIES = [
  'Logement',
  'Emploi',
  'Économie',
  'Sécurité',
  'Éducation',
  'Transport',
  'Cadre de vie',
  'Services',
] as const;

export function indicatorByKey(indicators: Indicator[], key: string): Indicator | undefined {
  return indicators.find((i) => i.key === key);
}

export function communeIndicatorValue(
  values: CommuneIndicator[],
  key: string,
): CommuneIndicator | undefined {
  return values.find((v) => v.indicator_key === key);
}

// Higher = better for these keys; lower = better for the others.
export const HIGHER_IS_BETTER: Record<string, boolean> = {
  school_score: true,
  transport_score: true,
  green_space_pct: true,
  air_quality: true,
  shops_per_1000: true,
  rental_yield: true,
  average_income: true,
  median_price_m2: false,
  unemployment_rate: false,
  crime_rate: false,
};

export function ratingStars(rating: number): { filled: number; empty: number } {
  return { filled: Math.round(rating), empty: 5 - Math.round(rating) };
}

export function normalizeValue(
  value: number,
  range: { min: number; max: number } | undefined,
): number {
  if (!range || range.max === range.min) return 0.5;
  return Math.max(0, Math.min(1, (value - range.min) / (range.max - range.min)));
}
