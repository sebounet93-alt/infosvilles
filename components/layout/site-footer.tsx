import Link from 'next/link';
import { Mail } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/seo';
import { Logo } from '@/components/layout/logo';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm text-muted-foreground text-pretty">
              InfosVilles prÃ©pare un outil de comparaison des communes franÃ§aises Ã 
              partir de donnÃ©es publiques documentÃ©es. Cette version prÃ©sente une
              dÃ©monstration du produit.
            </p>
            <p className="mt-3 max-w-md text-xs italic text-muted-foreground">
              Â« Les chiffres sont utiles. Leur contexte lâ€™est encore plus. Â»
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-medium text-warning-foreground">
              DonnÃ©es fictives de dÃ©monstration
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explorer</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-soft hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Informations</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/methodologie" className="text-muted-foreground hover:text-foreground">MÃ©thodologie & sources</Link></li>
              <li><Link href="/a-propos" className="text-muted-foreground hover:text-foreground">Ã€ propos</Link></li>
              <li><Link href="/mentions-legales" className="text-muted-foreground hover:text-foreground">Mentions lÃ©gales</Link></li>
              <li><Link href="/politique-confidentialite" className="text-muted-foreground hover:text-foreground">ConfidentialitÃ©</Link></li>
              <li><Link href="/a-propos#contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            Â© {year} InfosVilles.com â€” Plateforme indÃ©pendante dâ€™analyse territoriale.
          </p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="mailto:contact@infosvilles.com" aria-label="Envoyer un email Ã  lâ€™Ã©quipe InfosVilles" className="hover:text-foreground"><Mail className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
