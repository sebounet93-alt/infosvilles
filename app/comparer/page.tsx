import { CompareClient } from "@/components/search/compare-client";
import { pageMetadata } from "@/lib/seo";
import { loadCompareColumns, getAllCompareEntries } from "@/app/comparer/actions";

export const metadata = pageMetadata({
  title: "Comparer deux ou plusieurs communes — InfosVilles",
  description: "Outil comparatif multicritères officiel : budget immobilier, taux d’infractions, revenus et équipements publics.",
  path: "/comparer",
});

interface Props {
  searchParams: Promise<{ villes?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const { villes } = await searchParams;

  const allEntries = await getAllCompareEntries();

  const parsedSlugs = villes ? villes.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const initialSlugs = parsedSlugs.length > 0 
    ? parsedSlugs 
    : [allEntries[0]?.slug, allEntries[1]?.slug].filter(Boolean);

  const initialColumns = await loadCompareColumns(initialSlugs);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Comparateur territorial
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mettez en parallèle les communes selon les données officielles certifiées (DVF, INSEE, SSMSI).
        </p>
      </div>

      <CompareClient
        allEntries={allEntries}
        initialSlugs={initialSlugs}
        initialColumns={initialColumns}
      />
    </main>
  );
}