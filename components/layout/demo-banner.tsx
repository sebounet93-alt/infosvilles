import { HardHat } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="bg-warning/15 text-warning-foreground border-b border-warning/30">
      <div className="container mx-auto max-w-6xl px-4 py-2 text-center text-xs font-medium">
        <HardHat className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
        Prototype en cours de construction — les chiffres affichés sont fictifs.
        Les sources et indicateurs présentés illustrent le fonctionnement futur d’InfosVilles.
      </div>
    </div>
  );
}
