import { Compass } from 'lucide-react';
import Link from 'next/link';
import { noindexMetadata } from '@/lib/seo';

export const metadata = noindexMetadata;

export default function NotFound() {
  return (
    <main className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight">
        Page introuvable
      </h1>
      <p className="mt-3 text-muted-foreground text-pretty">
        La page que vous cherchez n’existe pas ou a été déplacée. Revenez à l’accueil
        ou recherchez une commune.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Accueil
        </Link>
        <Link
          href="/recherche"
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:border-primary/40"
        >
          Rechercher une commune
        </Link>
      </div>
    </main>
  );
}
