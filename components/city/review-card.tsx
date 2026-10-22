import { ShieldCheck, ThumbsUp, Wrench } from 'lucide-react';
import type { CityReview } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = { review: CityReview };

export function ReviewCard({ review }: Props) {
  const publishedDate = new Date(review.publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-foreground">{review.authorName}</div>
            <div className="text-xs text-muted-foreground">Publié le {publishedDate}</div>
          </div>
          <div className="flex items-center gap-1" aria-label={`Note : ${review.rating} sur 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-6 rounded-full ${
                  i < review.rating ? 'bg-warning' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> Points forts
            </h4>
            <ul className="mt-1.5 space-y-1">
              {review.strengths.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground">· {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-warning">
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" /> Axes d’amélioration
            </h4>
            <ul className="mt-1.5 space-y-1">
              {review.improvements.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground">· {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <Badge variant="secondary" className="text-[10px]">
            Avis fictif de démonstration
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            Personne et propos inventés à titre illustratif
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
