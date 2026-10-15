// ============================================================
// Ethaqa Publishing - Content Collections Configuration
// Astro 7 (content layer API)
// ============================================================

import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// ------------------------------------------------------------
// Books - Markdown files with rich frontmatter
// ------------------------------------------------------------
const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: ({ image }) => z.object({     // ← schema is now a function
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string(),
    authors: z.array(reference('authors')).default([]),
    categories: z.array(reference('categories')).default([]),
    description: z.string(),
    shortDescription: z.string(),
    cover: z.object({
      src: image(),                      // ← now resolves properly
      alt: z.string(),
    }),
    isbn13: z.string().optional(),
    publicationDate: z.coerce.date(),
    language: z.string().default('en'),
    format: z.array(z.string()).default([]),
    pageCount: z.number().optional(),
    ageRange: z
      .object({
        min: z.number(),
        max: z.number(),
      })
      .optional(),
    publisher: z.string(),
    imprint: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    purchaseLinks: z.record(z.string(), z.string()).default({}),
  }),
});

// ... authors, categories, series unchanged (they don't use image())

// ------------------------------------------------------------
// Authors - JSON data files
// ------------------------------------------------------------
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    bio: z.string().optional(),
    photo: z.string().optional(),
    website: z.url().optional(),
    social: z
      .object({
        twitter: z.string().optional(),
        instagram: z.string().optional(),
      })
      .optional(),
  }),
});

// ------------------------------------------------------------
// Categories - JSON data files
// ------------------------------------------------------------
const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

// ------------------------------------------------------------
// Series - JSON data files (currently empty)
// ------------------------------------------------------------
const series = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/series' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { books, authors, categories, series };