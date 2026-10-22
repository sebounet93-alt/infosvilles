import { GraduationCap, Landmark, ShieldCheck, Store, Trees, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CityScores, DataScope } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  scores: CityScores;
  securityScope?: DataScope | null;
};

type ScoreTone = 'positive' | 'intermediate' | 'to-watch';

const SCORE_LABELS: Record<ScoreTone, string> = {
  positive: 'Favorable',
  intermediate: 'Intermédiaire',
  'to-watch': 'À surveiller',
};

const TONE_TEXT: Record<ScoreTone, string> = {
  positive: 'text-success',
  intermediate: 'text-warning',
  'to-watch': 'text-destructive',
};

const TONE_BG: Record<ScoreTone, string> = {
  positive: 'bg-success',
  intermediate: 'bg-warning',
  'to-watch': 'bg-destructive',
};

function toneForScore(score: number): ScoreTone {
  if (score >= 66) return 'positive';
  if (score >= 40) return 'intermediate';
  return 'to-watch';
}

type IndicatorItem = {
  key: Exclude<keyof CityScores, 'overall'>;
  label: string;
  icon: LucideIcon;
  interpret: (value: number, tone: ScoreTone) => string;
};

const INDICATORS: IndicatorItem[] = [
  {
    key: 'security',
    label: 'Sécurité',
    icon: ShieldCheck,
    interpret: (v, tone) =>
      `Score de ${v}/100 — ${SCORE_LABELS[tone]} : l’incidence de la délinquance enregistrée.`,
  },
  {
    key: 'education',
    label: 'Éducation',
    icon: GraduationCap,
    interpret: (v, tone) =>
      `Score de ${v}/100 — ${SCORE_LABELS[tone]} : densité et appréciation des établissements scolaires.`,
  },
  {
    key: 'amenities',
    label: 'Commerces et services',
    icon: Store,
    interpret: (v, tone) =>
      `Score de ${v}/100 — ${SCORE_LABELS[tone]} : commerce de proximité, santé, transports du quotidien.`,
  },
  {
    key: 'realEstate',
    label: 'Immobilier',
    icon: Landmark,
    interpret: (v, tone) =>
      `Score de ${v}/100 — ${SCORE_LABELS[tone]} : rapport entre prix pratiqués et revenus locaux.`,
  },
  {
    key: 'nature',
    label: 'Nature et espaces verts',
    icon: Trees,
    interpret: (v, tone) =>
      `Score de ${v}/100 — ${SCORE_LABELS[tone]} : part des espaces verts et accès à la nature.`,
  },
];

export function IndicatorCards({ scores, securityScope = null }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {INDICATORS.map((item) => {
        const value = scores[item.key];
        const tone = toneForScore(value);
        const showSecurityLimit = item.key === 'security' && securityScope === 'departement';
        return (
          <Card key={item.key}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-medium text-foreground">{item.label}</h3>
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold text-foreground">{value}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>

              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label} : score de ${value} sur 100, ${SCORE_LABELS[tone]}`}
              >
                <div
                  className={`h-full rounded-full transition-soft ${TONE_BG[tone]}`}
                  style={{ width: `${Math.max(3, value)}%` }}
                />
              </div>

              <p className={`mt-2 text-[11px] font-medium ${TONE_TEXT[tone]}`}>
                {SCORE_LABELS[tone]}
              </p>

              <p className="mt-2 text-xs text-muted-foreground text-pretty">
                {item.interpret(value, tone)}
              </p>

              {showSecurityLimit && (
                <div className="mt-2 flex items-start gap-1.5 rounded-md bg-warning/10 p-2 text-xs text-warning-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Donnée mesurée à l’échelle départementale, pas communale. La
                    délinquance varie selon les quartiers.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
