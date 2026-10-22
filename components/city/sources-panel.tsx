import { ExternalLink } from 'lucide-react';
import type { CitySource } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

type Props = { sources: CitySource[] };

export function SourcesPanel({ sources }: Props) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-5">
        <h2 className="text-base font-semibold">Sources envisagées & date indicative</h2>
        <ul className="mt-3 space-y-3">
          {sources.map((src) => (
            <li key={src.name} className="text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">{src.name}</span>
                <span className="text-xs text-muted-foreground">
                  Date indicative :{' '}
                  {new Date(src.consultedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span>Couvre :</span>
                {src.indicators.map((ind) => (
                  <span key={ind.key} className="rounded bg-background px-1.5 py-0.5">
                    {ind.label}
                  </span>
                ))}
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-primary hover:underline"
                >
                  Source envisagée <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
