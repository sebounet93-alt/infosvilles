import './globals.css';
import { Inter } from 'next/font/google';
import { SiteHeader, SiteFooter, DemoBanner } from '@/components/layout';
import { defaultMetadata, websiteJsonLd } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-sans', display: 'swap', preload: true });

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Aller au contenu
        </a>
        <DemoBanner />
        <SiteHeader />
        <div id="contenu">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
