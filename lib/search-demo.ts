import type { City } from '@/lib/types';

/**
 * Recherche locale sur les fiches de démonstration, isolée derrière une
 * fonction : remplacer son corps par un appel serveur n'imposera aucune
 * modification aux composants qui l'utilisent.
 *
 * Correspondance par nom, code postal et slug, insensible aux accents
 * et à la casse.
 */
export async function searchDemoCities(
  query: string,
  cities: City[],
): Promise<City[]> {
  const normalized = query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (!normalized) return [];

  return cities.filter((city) => {
    const name = city.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const slug = city.slug.toLowerCase();
    const postal = city.postalCode;
    return (
      name.includes(normalized) || postal.startsWith(normalized) || slug.includes(normalized)
    );
  });
}
