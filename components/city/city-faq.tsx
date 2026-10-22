'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CityFaqItem } from '@/lib/types';

type Props = { items: CityFaqItem[] };

/**
 * Accordéon accessible : chaque question est un <button> avec
 * aria-expanded et aria-controls ; les réponses sont présentes dans le
 * HTML initial (masquées visuellement, pas retirées du DOM).
 */
export function CityFaq({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const buttonId = `faq-button-${i}`;
        const panelId = `faq-panel-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-soft hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.question}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4 text-sm text-muted-foreground text-pretty"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
