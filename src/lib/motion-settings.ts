/** Measured dimensions/colors; timing approximates the live reference capture. */
export const motion = {
  accent: '#7fa8ff', dot: 6, ring: 88, idleScale: .35,
  followMs: 85, scaleMs: 90, coverMs: 510, revealMs: 650, staggerMs: 40,
  holdMs: 180, ease: 'cubic-bezier(.76,0,.24,1)',
  storageKey: 'portfolio:page-motion', maxAgeMs: 10000,
} as const;

/** Downloads, modifiers, external URLs and same-document links stay native. */
export function pageDestination(href: string, current: string): URL | null {
  const url = new URL(href, current), here = new URL(current);
  if (url.origin !== here.origin || !/^https?:$/.test(url.protocol)) return null;
  if (url.pathname === here.pathname) return null;
  if (/\.[a-z0-9]+$/i.test(url.pathname) && !/\.html$/i.test(url.pathname)) return null;
  if (/\/(downloads|media|_astro|licenses)\//.test(url.pathname)) return null;
  return url;
}
