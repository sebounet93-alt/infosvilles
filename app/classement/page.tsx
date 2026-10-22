import { pageMetadata } from '@/lib/seo';
import { getAllIndicators, getCommunesBySlugs } from '@/lib/mockData';
import { RankingClient } from '@/components/search';
import type { Commune, CommuneIndicator } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'Classement des communes',
  description:
    'Classez les communes françaises analysées par InfosVilles selon vos critères : prix immobilier, emploi, transports, éducation, sécurité, cadre de vie. Prototype en démonstration — données fictives.',
  path: '/classement',
});

export default async function ClassementPage() {
  const [indicators, fallbackCommunes] = await Promise.all([
    getAllIndicators(),
    getCommunesBySlugs(['bordeaux-33000', 'annecy-74000']),
  ]);

  const fallbackRows = fallbackCommunes as (Commune & {
    commune_indicators: CommuneIndicator[];
  })[];

  return <RankingClient indicators={indicators} fallbackRows={fallbackRows} />;
}
