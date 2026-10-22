export type ScoreTone = 'positive' | 'intermediate' | 'to-watch';

export const SCORE_LABELS: Record<ScoreTone, string> = {
  positive: 'Favorable',
  intermediate: 'Intermédiaire',
  'to-watch': 'À surveiller',
};

/**
 * Seuils éditoriaux partagés : ≥ 66 favorable, 40–65 intermédiaire,
 * < 40 à surveiller. Jamais la couleur seule — la formulation
 * textuelle accompagne toujours la valeur.
 */
export function toneForScore(score: number): ScoreTone {
  if (score >= 66) return 'positive';
  if (score >= 40) return 'intermediate';
  return 'to-watch';
}
