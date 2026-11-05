import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { profile } from '../data/profile';
import { selectedSlugs } from '../data/organization';

export type Project = CollectionEntry<'projects'>;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path with the configured base path (GitHub project pages). */
export function href(path = ''): string {
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export function projectHref(id: string): string {
  return href(`projects/${id}/`);
}

/** Published (non-draft) projects, ordered by `order`, then newest first. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      (b.data.sortDate?.getTime() ?? 0) - (a.data.sortDate?.getTime() ?? 0) ||
      a.data.title.localeCompare(b.data.title)
  );
}

export async function getFeatured(): Promise<Project[]> {
  const projects = await getProjects();
  return selectedSlugs.map(id => projects.find(p => p.id === id)).filter((p): p is Project => Boolean(p));
}

/** Resume URL only when the PDF actually exists in public/. */
export function resumeHref(): string | undefined {
  if (!profile.resume) return undefined;
  return existsSync(join(process.cwd(), 'public', profile.resume)) ? href(profile.resume) : undefined;
}

/** Drive "view" URLs get a direct-download fallback for when the preview fails. */
export function driveFallback(url: string): string | undefined {
  const m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : undefined;
}
