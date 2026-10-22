import { Info } from 'lucide-react';

/** Note visible sur toutes les pages de commune : les données n'engagent rien. */
export function DataDisclaimer() {
  return (
    <div
      className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground"
      role="note"
    >
      <Info className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
      Les indicateurs sont informatifs et ne constituent ni un conseil immobilier ni une
      garantie.
    </div>
  );
}
