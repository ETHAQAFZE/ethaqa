# Changelog

All notable changes to the Ethaqa platform.

Format based on [Keep a Changelog](https://keepachangelog.com/),
versioning follows [Semantic Versioning](https://semver.org/).

Only shipped changes are recorded. Planned work is not listed here.

## [Unreleased]

### Added
- Phase 6.1 — Books listing page (`/publishing/books/`)
- Phase 6.2 — `BookCard` component
- Phase 6.3 — Shared `PageHero` component
- Phase 6.4 — Shared books library (`src/lib/books.ts`)

### Changed
- Books listing uses shared `getPublishedBooks()` helper
- Books listing uses `Astro.site` for JSON-LD URLs
- Empty catalogue state now serves `noindex` to search engines
- Breadcrumb contrast bumped to WCAG AA compliance

## [1.0.0] — 2026-10-13

### Added
- Corporate website live at ethaqa.com
- Cloudflare Pages deployment with auto-deploy from GitHub
- Security headers — Grade A (ETH-SEC-001)
- Content-Security-Policy with Cloudflare Insights allowance
- Branded 404 page with proper HTTP status
- Publishing site scaffolded at /publishing/

### Infrastructure
- Node 22.12.0 pinned for Astro 7
- Cloudflare Pages build via `scripts/build.mjs`
- Merged corporate + publishing deploy