import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryIds } from './data/categories';

// One Markdown file per project in src/content/projects/.
// Unknown facts stay absent: optional fields are omitted, and the templates hide
// any control (link, button, date) whose value is missing.
const link = z.object({
  label: z.string(),
  url: z.url(),
  note: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // One or two sentences shown on cards and at the top of the case study.
      summary: z.string(),
      // Search/social description; falls back to summary.
      description: z.string().optional(),
      // What I personally did, in one line, for cards.
      contribution: z.string(),
      categories: z.array(z.enum(categoryIds)).min(1),
      // coursework = individual course lab, team = team project (course or not),
      // homework = individual course assignment,
      // individual = solo build whose course/independent status is unconfirmed,
      // independent = self-directed outside coursework.
      setting: z.enum(['coursework', 'homework', 'course-project', 'team', 'individual', 'independent']),
      role: z.string(),
      context: z.string(),
      team: z.string().optional(),
      // Human-readable period, only when supported by a source (e.g. "Fall 2025").
      period: z.string().optional(),
      // Used for ordering only; never displayed.
      sortDate: z.coerce.date().optional(),
      tools: z.array(z.string()).default([]),
      status: z.enum(['complete', 'prototype', 'in-progress']).default('complete'),
      // 1, 2, 3... marks a homepage featured case study. Lower shows first.
      featured: z.number().int().positive().optional(),
      // Ordering for the projects index (lower first).
      order: z.number().default(100),
      // Supporting coursework gets a secondary index and stays out of homepage grids.
      placement: z.enum(['projects', 'coursework', 'business']).default('projects'),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Scientific chart covers can retain complete axes inside the card frame.
      coverFit: z.enum(['cover', 'contain']).default('cover'),
      // SVG diagram components (src/components/diagrams/, registered in
      // src/components/diagrams/index.ts). The first one is the card visual when
      // there is no cover; all are shown in the case study with their captions.
      diagrams: z.array(z.enum(['hexapod-stack', 'tripod-gait', 'hps-fpga-path'])).default([]),
      figures: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            group: z.string().optional(),
          })
        )
        .default([]),
      videos: z
        .array(
          z.object({
            // Path inside public/, without a leading slash.
            src: z.string(),
            poster: z.string(),
            width: z.number(),
            height: z.number(),
            title: z.string(),
            caption: z.string(),
          })
        )
        .default([]),
      reports: z.array(link).default([]),
      repositories: z.array(link).default([]),
      demos: z.array(link).default([]),
      downloads: z.array(z.object({
        label: z.string(),
        // A reviewed local file inside public/downloads/, resolved with href().
        path: z.string().regex(/^downloads\/[a-zA-Z0-9_./-]+$/).refine((p) => !p.includes('..')),
        note: z.string().optional(),
      })).default([]),
      // Where the content came from (provenance). Rendered as a quiet footnote.
      sources: z.array(link).default([]),
      related: z.array(reference('projects')).default([]),
      series: z.object({ name: z.string(), part: z.string() }).optional(),
      // Facts awaiting confirmation. Never rendered; listed in docs/content-inventory.md.
      openQuestions: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
