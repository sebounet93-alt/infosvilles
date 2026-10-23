import { HeroSearch } from "@/components/home/hero-search";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero({ communeCount, indicatorCount }: { communeCount: number; indicatorCount: number }) {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          {indicatorCount} indicateurs sur {communeCount} communes
        </div>
        <h1 className="text-balance font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          Trouvez une commune adaptée 
          à votre <span className="text-primary">projet de vie</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
          Comparez le budget immobilier, les services, les transports et le cadre de vie avant de choisir où vous installer.
        </p>
        <div className="mx-auto mt-10 max-w-xl">
          <HeroSearch />
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Recherches fréquentes :</span>
            <Link href="/ville/paris-75001" className="rounded-full border border-border bg-background px-3 py-1 hover:bg-muted transition-colors">Paris</Link>
            <Link href="/ville/lyon-69001" className="rounded-full border border-border bg-background px-3 py-1 hover:bg-muted transition-colors">Lyon</Link>
          </div>
        </div>
      </div>
    </section>
  );
}