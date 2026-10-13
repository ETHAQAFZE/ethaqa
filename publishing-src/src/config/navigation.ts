// ============================================================
// Ethaqa Publishing — Navigation Configuration
// Document ID: ETH-IA-001
// Version: 1.0.1
//
// Single source of truth for navigation across every Ethaqa
// digital property. The SiteHeader and SiteFooter components
// consume this config. No navigation is hand-authored in
// component markup.
//
// When a new business unit is added, its link is added here
// once, and every header and footer across the ecosystem
// updates automatically.
// ============================================================

// ============================================================
// TYPES
// ============================================================

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavDropdown {
  label: string;
  items: NavLink[];
}

export interface ContextualCTA {
  label: string;
  href: string;
}

export type NavItem = NavLink | NavDropdown;

export interface BusinessUnit {
  slug: string;
  name: string;
  color: string;
  href: string;
}

// ============================================================
// PRIMARY NAVIGATION
// Appears in the header of every page of every property.
// ============================================================

export const primaryNav: NavItem[] = [
  {
    label: 'Solutions',
    items: [
      { label: 'Systems', href: '/systems/' },
      { label: 'Procurement Operating System', href: '/procurement-os/' },
      { label: 'AI Solutions', href: '/ai/' },
      { label: 'Consulting', href: '/consulting/' },
      { label: 'Sourcing', href: '/sourcing/' },
    ],
  },
  { label: 'Industries', href: '/industries/' },
  {
    label: 'Company',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'Publishing', href: '/publishing/' },
      { label: 'Careers', href: '/careers/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  { label: 'Contact', href: '/contact/' },
];

// ============================================================
// CONTEXT-SENSITIVE CTA
// The header CTA changes based on the current business unit.
// The label and destination are defined here. The SiteHeader
// component resolves the correct entry from the current route.
// ============================================================

export const ctaByContext: Record<string, ContextualCTA> = {
  corporate: {
    label: 'Book a Consultation',
    href: '/contact/',
  },
  publishing: {
    label: 'Browse Books',
    href: '/publishing/books/',
  },
  sourcing: {
    label: 'Request an RFQ',
    href: '/sourcing/rfq/',
  },
  'procurement-os': {
    label: 'Request a Demo',
    href: '/procurement-os/contact/',
  },
  ai: {
    label: 'Talk to an AI Specialist',
    href: '/ai/contact/',
  },
  consulting: {
    label: 'Schedule a Consultation',
    href: '/consulting/contact/',
  },
  systems: {
    label: 'Discuss Your Project',
    href: '/systems/contact/',
  },
};

// ============================================================
// BUSINESS UNITS
// Every business unit of Ethaqa. Used in the footer, sitemap
// index, and cross-navigation.
// ============================================================

export const businessUnits: BusinessUnit[] = [
  { slug: 'publishing',       name: 'Publishing',       color: 'rose',   href: '/publishing/' },
  { slug: 'sourcing',         name: 'Sourcing',         color: 'teal',   href: '/sourcing/' },
  { slug: 'procurement-os',   name: 'Procurement OS',   color: 'copper', href: '/procurement-os/' },
  { slug: 'ai',               name: 'AI',               color: 'purple', href: '/ai/' },
  { slug: 'consulting',       name: 'Consulting',       color: 'gold',   href: '/consulting/' },
  { slug: 'systems',          name: 'Systems',          color: 'blue',   href: '/systems/' },
];

// ============================================================
// FOOTER COLUMNS
// The footer has four areas: Company, Business Units, Legal,
// and the Registered Office block. The first three are defined
// here. The Registered Office block is defined separately below.
// ============================================================

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Industries', href: '/industries/' },
      { label: 'Systems', href: '/systems/' },
      { label: 'AI Solutions', href: '/ai/' },
      { label: 'Careers', href: '/careers/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    title: 'Business Units',
    links: businessUnits.map((unit) => ({
      label: unit.name,
      href: unit.href,
    })),
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy/' },
      { label: 'Terms of Use', href: '/terms/' },
      { label: 'Cookie Policy', href: '/cookies/' },
      { label: 'Copyright & IP', href: '/copyright/' },
    ],
  },
];

// ============================================================
// SOCIAL LINKS
// ============================================================

export const socialLinks: NavLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ethaqa', external: true },
  { label: 'Twitter', href: 'https://twitter.com/ethaqa', external: true },
];

// ============================================================
// REGISTERED OFFICE
// The corporate identity block that appears in the footer of
// every Ethaqa property. Frozen per ETH-BA-001, Section 11.
// ============================================================

export const registeredOffice = {
  name: 'Ethaqa FZE LLC',
  addressLines: [
    '26th Floor, Amber Gem Tower',
    'Sheikh Khalifa Street',
    'P.O. Box 4848',
    'Ajman',
    'United Arab Emirates',
  ],
  phone: '+971 52 439 1126',
  email: 'info@ethaqa.com',
};

// ============================================================
// COPYRIGHT
// ============================================================

export const copyright = {
  year: 2026,
  holder: 'Ethaqa FZE LLC',
  text: '© 2026 Ethaqa FZE LLC. All Rights Reserved.',
};

// ============================================================
// PUBLISHING SUB-NAVIGATION
// The secondary navigation that appears on Publishing pages.
// ============================================================

export const publishingNav: NavLink[] = [
  { label: 'Books', href: '/publishing/books/' },
  { label: 'Categories', href: '/publishing/categories/' },
  { label: 'Authors', href: '/publishing/authors/' },
  { label: 'About', href: '/publishing/about/' },
  { label: 'Contact', href: '/publishing/contact/' },
];

// ============================================================
// HELPERS
// ============================================================

/**
 * Returns the CTA appropriate for the current business context.
 * Resolves by matching the current pathname against the keys
 * of ctaByContext. Falls back to corporate CTA if no match.
 */
export function getCTAForPath(pathname: string): ContextualCTA {
  // Strip trailing slash for consistent matching
  const cleanPath = pathname.replace(/\/$/, '');

  // Match against business unit slugs
  for (const unit of businessUnits) {
    if (cleanPath.startsWith(`/${unit.slug}`)) {
      return ctaByContext[unit.slug] ?? ctaByContext.corporate;
    }
  }

  // Default to corporate CTA
  return ctaByContext.corporate;
}

/**
 * Returns the business context identifier for a given path.
 * Used by the header to switch the logo lockup.
 */
export function getContextForPath(pathname: string): string {
  const cleanPath = pathname.replace(/\/$/, '');

  for (const unit of businessUnits) {
    if (cleanPath.startsWith(`/${unit.slug}`)) {
      return unit.slug;
    }
  }

  return 'corporate';
}