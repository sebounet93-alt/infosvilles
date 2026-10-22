import Link from 'next/link';
import { MessageSquarePlus } from 'lucide-react';

export function HomeCta() {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-20 text-center">
      <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl text-balance">
        Vous habitez l’une de ces communes&nbsp;?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
        À terme, vous pourrez partager votre expérience pour aider d’autres
        personnes à mieux comprendre le quotidien de votre commune.
      </p>
      <Link
        href="/recherche"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-6 py-3 text-sm font-medium text-primary transition-soft hover:bg-primary/10"
      >
        <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
        Trouver ma ville
      </Link>
    </section>
  );
}
