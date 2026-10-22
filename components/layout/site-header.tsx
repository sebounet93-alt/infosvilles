'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Compass } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/seo';
import { Logo } from '@/components/layout/logo';

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-soft hover:text-foreground hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/recherche"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-4 text-sm font-medium text-primary transition-soft hover:bg-primary/10"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Trouver ma ville
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-soft hover:bg-muted md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-border/60 bg-background px-4 py-3 md:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-soft hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/recherche"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                Trouver ma ville
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
