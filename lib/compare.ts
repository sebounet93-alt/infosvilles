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

export const COMPARE_METRICS: CompareMetric[] = [
  { key: 'overall', label: 'Note globale', category: 'Synthèse', higherIsBetter: true },
  { key: 'security', label: 'Sécurité', category: 'Synthèse', higherIsBetter: true },
  { key: 'education', label: 'Éducation', category: 'Synthèse', higherIsBetter: true },
  { key: 'amenities', label: 'Commerces et services', category: 'Synthèse', higherIsBetter: true },
  { key: 'apartmentPriceM2', label: 'Prix au m² — appartement', category: 'Immobilier', higherIsBetter: false },
  { key: 'housePriceM2', label: 'Prix au m² — maison', category: 'Immobilier', higherIsBetter: false },
  { key: 'medianIncome', label: 'Revenu médian annuel', category: 'Économie', higherIsBetter: true },
  { key: 'povertyRate', label: 'Taux de pauvreté', category: 'Économie', higherIsBetter: false },
  { key: 'population', label: 'Population', category: 'Démographie', higherIsBetter: true },
];

export const MAX_COMMUNES = 4;

export function rowToCompareColumn(row: any): CompareColumn {
  const pop = Number(row.population) || 0;
  const aptPrice = row.avg_price_sqm_apt ? Number(row.avg_price_sqm_apt) : null;
  const housePrice = row.avg_price_sqm_house ? Number(row.avg_price_sqm_house) : null;
  const medianIncome = row.median_income_eur ? Number(row.median_income_eur) : null;
  const poverty = row.poverty_rate ? Number(row.poverty_rate) : null;

  return {
    slug: row.slug,
    name: row.name,
    postalCode: row.postal_code || '',
    departmentName: row.department_name || '',
    region: row.region_name || '',
    population: pop,
    density: null,
    isDemo: false,
    source: 'local',
    values: {
      overall: {
        display: row.score_overall ? `${Number(row.score_overall).toFixed(1)} / 10` : 'N.C.',
        value: row.score_overall ? Number(row.score_overall) : null,
      },
      security: {
        display: row.score_security ? `${Number(row.score_security).toFixed(1)} / 10` : 'N.C.',
        value: row.score_security ? Number(row.score_security) : null,
      },
      education: {
        display: row.score_education ? `${Number(row.score_education).toFixed(1)} / 10` : 'N.C.',
        value: row.score_education ? Number(row.score_education) : null,
      },
      amenities: {
        display: row.score_amenities ? `${Number(row.score_amenities).toFixed(1)} / 10` : 'N.C.',
        value: row.score_amenities ? Number(row.score_amenities) : null,
      },
      apartmentPriceM2: {
        display: aptPrice ? `${aptPrice.toLocaleString('fr-FR')} €` : 'N.C.',
        value: aptPrice,
      },
      housePriceM2: {
        display: housePrice ? `${housePrice.toLocaleString('fr-FR')} €` : 'N.C.',
        value: housePrice,
      },
      medianIncome: {
        display: medianIncome ? `${medianIncome.toLocaleString('fr-FR')} €` : 'N.C.',
        value: medianIncome,
      },
      povertyRate: {
        display: poverty ? `${poverty} %` : 'N.C.',
        value: poverty,
      },
      population: {
        display: pop.toLocaleString('fr-FR'),
        value: pop,
      },
    },
  };
}