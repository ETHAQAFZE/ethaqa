// ============================================================
// Ethaqa Publishing — Books Library
// Shared queries for the books content collection.
// Used by every page that lists or links to books.
// ============================================================

import { getCollection, type CollectionEntry } from 'astro:content';

export type Book = CollectionEntry<'books'>;

/**
 * Returns all published books, sorted by publication date
 * (newest first). Draft and archived books are excluded.
 *
 * This is the single source of truth for "what's public".
 */
export async function getPublishedBooks(): Promise<Book[]> {
  const books = await getCollection(
    'books',
    ({ data }) => data.status === 'published'
  );
  return books.sort(
    (a, b) =>
      b.data.publicationDate.getTime() - a.data.publicationDate.getTime()
  );
}

/**
 * Returns a single published book by slug.
 * Returns undefined if the book is not published.
 */
export async function getPublishedBookBySlug(
  slug: string
): Promise<Book | undefined> {
  const books = await getPublishedBooks();
  return books.find((book) => book.id === slug);
}

/**
 * Groups published books by a category reference.
 */
export async function getBooksByCategory(
  categorySlug: string
): Promise<Book[]> {
  const books = await getPublishedBooks();
  return books.filter((book) =>
    book.data.categories.some((cat) => cat.id === categorySlug)
  );
}

/**
 * Groups published books by an author reference.
 */
export async function getBooksByAuthor(
  authorSlug: string
): Promise<Book[]> {
  const books = await getPublishedBooks();
  return books.filter((book) =>
    book.data.authors.some((auth) => auth.id === authorSlug)
  );
}