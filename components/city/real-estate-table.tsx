import type { CityStats } from '@/lib/types';

type Props = { stats: CityStats };

type Row = {
  label: string;
  value: string;
  period: string;
  source: string;
};

export function RealEstateTable({ stats }: Props) {
  const rows: Row[] = [
    {
      label: 'Prix moyen au m² — maison',
      value: stats.housePriceM2?.display ?? 'Donnée non disponible',
      period: stats.housePriceM2?.referencePeriod ?? '—',
      source: stats.housePriceM2?.sourceName ?? '—',
    },
    {
      label: 'Prix moyen au m² — appartement',
      value: stats.apartmentPriceM2?.display ?? 'Donnée non disponible',
      period: stats.apartmentPriceM2?.referencePeriod ?? '—',
      source: stats.apartmentPriceM2?.sourceName ?? '—',
    },
    {
      label: 'Taxe foncière (taux communal)',
      value: stats.propertyTaxRate?.display ?? 'Donnée non disponible',
      period: stats.propertyTaxRate?.referencePeriod ?? '—',
      source: stats.propertyTaxRate?.sourceName ?? '—',
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">
          Immobilier et budget : prix au m², taxe foncière, période de référence et
          sources pour cette commune.
        </caption>
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Indicateur
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Valeur
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Période de référence
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Source envisagée
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/60 last:border-0">
              <th scope="row" className="px-4 py-3 font-medium text-foreground">
                {row.label}
              </th>
              <td className="px-4 py-3 font-semibold text-foreground">{row.value}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.period}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{row.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
