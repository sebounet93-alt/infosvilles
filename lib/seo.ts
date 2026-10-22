import type { Metadata } from 'next';
import type { NavItem } from '@/lib/types';

/**
 * Originie publique du site. Le canonical absolu n'est émis que si cette
 * valeur reflète l'origine réelle configurée — sinon on garde des chemins
 * relatifs pour éviter des canonicals incorrects.
 */
export const SITE_URL = 'https://infosvilles.com';
export const SITE_NAME = 'InfosVilles';
export const SITE_DESCRIPTION =
  'InfosVilles : prototype de comparaison des communes françaises selon le budget immobilier, les services, les transports et le cadre de vie. Données fictives de démonstration, sources envisagées.';
export const SITE_TWITTER = '@infosvilles';

const OG_IMAGE = `${SITE_URL}/og-default.webp`;
const OG_IMAGE_ALT = 'InfosVilles — analyse du cadre de vie des communes françaises';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Choisir sa ville : cadre de vie, immobilier et services',
    template: '%s · InfosVilles',
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Choisir sa ville : cadre de vie, immobilier et services',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_TWITTER,
    title: 'Choisir sa ville : cadre de vie, immobilier et services',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  robots?: Metadata['robots'];
};

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  image,
  robots,
}: PageMetaInput): Metadata {
  const ogImage = image
    ? { url: image, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT }
    : { url: OG_IMAGE, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT };

  return {
    title,
    description,
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      title,
      description,
      type,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      ...(path ? { url: `${SITE_URL}${path}` } : {}),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_TWITTER,
      title,
      description,
      images: [ogImage.url],
    },
    ...(robots ? { robots } : {}),
  };
}

/** noindex pour les pages d'erreur et routes non indexables */
export const noindexMetadata: Metadata = {
  title: 'Page introuvable · InfosVilles',
  description: 'Cette page n’existe pas ou a été déplacée.',
  robots: { index: false, follow: false },
};

/* ---------- JSON-LD helpers ---------- */

function escapeJsonLd(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/recherche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: escapeJsonLd(item.name),
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function placeJsonLd(opts: {
  name: string;
  region: string;
  postalCode: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: escapeJsonLd(opts.name),
    address: {
      '@type': 'PostalAddress',
      addressRegion: escapeJsonLd(opts.region),
      postalCode: opts.postalCode,
      addressCountry: 'FR',
    },
    ...(opts.description ? { description: escapeJsonLd(opts.description) } : {}),
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: escapeJsonLd(item.question),
      acceptedAnswer: { '@type': 'Answer', text: escapeJsonLd(item.answer) },
    })),
  };
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Découvrir', href: '/recherche' },
  { label: 'Départements', href: '/departements' },
  { label: 'Classements', href: '/classement' },
  { label: 'Comparer', href: '/comparer' },
  { label: 'Méthodologie', href: '/methodologie' },
  { label: 'À propos', href: '/a-propos' },
];
