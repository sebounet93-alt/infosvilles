import { pageMetadata } from '@/lib/seo';
import {
  loadCompareColumns,
  getAllCompareEntries,
  MAX_COMMUNES,
} from '@/lib/compare';
import { CompareClient } from '@/components/search';

type Props = { searchParams: { with?: string } };

export const metadata = pageMetadata({
  title: 'Comparer des communes',
  description:
    'Comparez le cadre de vie, l’immobilier et les services de plusieurs communes françaises côte à côte. Comparaison de démonstration.',
  path: '/comparer',
});

export default async function ComparePage({ searchParams }: Props) {
  const slugs = (searchParams.with ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_COMMUNES);

  const effectiveSlugs = slugs.length >= 2 ? slugs : ['bordeaux-33000', 'annecy-74000'];

  const [initialColumns, allEntries] = await Promise.all([
    loadCompareColumns(effectiveSlugs),
    getAllCompareEntries(),
  ]);

  return (
    <CompareClient
      initialSlugs={slugs}
      initialColumns={initialColumns}
      allEntries={allEntries}
    />
  );
}
