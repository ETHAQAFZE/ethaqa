# ETH-PLAT-001 — Platform Engineering Architecture

**Document ID:** ETH-PLAT-001
**Version:** 1.0.0
**Status:** Draft — pending review
**Owner:** Ethaqa FZE LLC
**Date:** October 2026
**Classification:** Platform Governance — Engineering Standards
**Companions:** ETH-BA-001, ETH-IA-001, ETH-PUB-001, ETH-SEC-001

## 1. Purpose

This document defines the engineering standards for every
digital property under ethaqa.com. It is the technical constitution
for Publishing, Sourcing, Procurement OS, AI, Consulting, and
Systems — current and future.

It does not duplicate the brand (see Brand Standards), the
information architecture (see ETH-IA-001), or the security
baseline (see ETH-SEC-001). It covers implementation.

## 2. Folder Structure (Frozen)

```
publishing-src/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   └── images/
│       ├── social/
│       └── icons/
└── src/
    ├── assets/
    ├── components/
    ├── config/
    ├── content/
    ├── layouts/
    ├── lib/
    ├── pages/
    └── content.config.ts
```

## 3. Astro Conventions

- **Components:** `.astro` files. No framework components unless justified.
- **Interactivity:** islands via `client:visible` or `client:idle`. Never `client:load`.
- **Scoped styles:** default. Global styles only in `BaseLayout` via `<style is:global>`.
- **Props:** typed with an interface. No untyped props.
- **Imports:** relative paths are canonical. Path aliases are optional and may be added in `tsconfig.json` later if the number of `../../` segments becomes unwieldy.

## 4. TypeScript Standards

- **Strict mode:** enabled. Never `any`. Use `unknown` and narrow.
- **Schema types:** derived from `content.config.ts`. Use `CollectionEntry<'books'>` etc.
- **Shared types:** live in `src/lib/*.ts` when reused across pages.
- **Null safety:** `strictNullChecks: true`. Handle `undefined` explicitly.

## 5. Component Design Principles

Three rules:

1. **One responsibility per component.** If it does two things, split it.
2. **Configuration over duplication.** A component that takes `variant` is better than two components.
3. **No business logic in components.** Components render. Business logic lives in `lib/`.

### Canonical Components

| Component | Purpose | Variants |
|---|---|---|
| `SiteHeader` | Global header | config-driven, no variants |
| `SiteFooter` | Global footer | config-driven, no variants |
| `PageHero` | Interior hero | content via props |
| `BookCard` | Book grid card | single layout |
| `SEO` | Metadata block | data-driven |
| `JsonLd` | Structured data | data-driven |
| `Breadcrumbs` | Route-aware navigation | data-driven |

## 6. Configuration Files

- **`src/config/navigation.ts`** — all navigation, CTAs, business units
- **`src/config/site.ts`** — site metadata, contact details, social links
- **`astro.config.mjs`** — build config, `site`, `base`, integrations
- **`tsconfig.json`** — strict mode, optional aliases
- **`.node-version`** — pinned Node version
- **`.env.example`** — documented environment variables

## 7. Environment Variables

| Variable | Purpose | Public | Source of truth |
|---|---|---|---|
| `PUBLIC_SITE_URL` | Canonical origin | Yes | `astro.config.mjs` (or `loadEnv`) |
| `PUBLIC_GA_ID` | Google Analytics 4 ID | Yes | `.env` / Cloudflare env |
| `PUBLIC_WEB3FORMS_KEY` | Web3Forms submission key | Yes | `.env` / Cloudflare env |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare Analytics token | Yes | `.env` / Cloudflare env |

**Note:** `Astro.site` is set from `site` in `astro.config.mjs`.
That config does **not** read `.env` automatically. If site URL
must be dynamic per environment, use `loadEnv` in the config.
Otherwise, hardcode `site: 'https://www.ethaqa.com'` in the config
and let it be the single source of truth.

No private keys exist in the static build. If any are needed later
(e.g., for a server function), they are documented here and set in
Cloudflare's environment variables.

## 8. Asset Organization

- **`public/images/`** — served as-is at their exact path. Use for favicons, PWA icons, social images that must be at a fixed URL.
- **`src/assets/`** — imported by components, optimized by `astro:assets`. Use for book covers, author photos, series artwork.
- **Brand assets** — shared, from corporate, at `/assets/brand/` on the deploy root.

Cover images and author photos use `<Image>` or `<Picture>` from
`astro:assets` with explicit dimensions. No raw `<img>` unless the
source is external.

## 9. Performance Budget

| Metric | Target | Enforcement |
|---|---|---|
| JS per page (gzipped) | < 150 KB | Manual, until CI |
| CSS per page (gzipped) | < 80 KB | Manual, until CI |
| LCP | < 2.0 s | Manual, until CI |
| CLS | < 0.05 | Manual, until CI |
| TBT | < 200 ms | Manual, until CI |
| Lighthouse Performance | ≥ 95 | Manual, until CI |
| Lighthouse Accessibility | ≥ 95 | Manual, until CI |
| Lighthouse Best Practices | ≥ 95 | Manual, until CI |
| Lighthouse SEO | 100 | Manual, until CI |

CI enforcement will be added in Phase 7 or later.

## 10. Accessibility Requirements

- WCAG 2.1 Level AA minimum
- Keyboard navigation on every interactive element
- Focus ring visible on every focusable element
- `prefers-reduced-motion` respected
- `prefers-contrast: more` respected
- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`
- One `<h1>` per page, no skipped levels
- Every image has meaningful alt text
- Every form field has a programmatically associated label
- Every landmark has an accessible name

## 11. Testing Strategy

| Phase | Tool | Scope |
|---|---|---|
| Now | `astro check` + `npm run build` | TypeScript + Astro syntax |
| Phase 6 | Manual browser QA | Every page at every breakpoint |
| Phase 7+ | Vitest | Utilities in `lib/` |
| Phase 8+ | Playwright | Critical user flows |

Do not add Vitest or Playwright before there is code worth testing.

## 12. Release Process

- **Versioning:** semantic (`MAJOR.MINOR.PATCH`)
- **Changelog:** `CHANGELOG.md` at repo root, kept up to date
- **Branching:** `main` is deployable at all times. Features use `feat/*` branches with preview deploys on Cloudflare Pages.
- **Commits:** conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- **Docs-only changes** may be committed directly to `main`.
- **Code changes** go through a feature branch and a preview deploy before merge.
- **Releases:** tagged in Git (`v1.0.0`, `v1.1.0`, etc.)
- **Rollback:** Cloudflare Pages keeps every deploy; any prior deploy can be restored in one click.

## 13. Deployment Workflow

1. Push to `main` (or merge a feature branch)
2. Cloudflare Pages runs `npm run build`
3. Build output `dist/` is deployed
4. Preview deploys run automatically for feature branches
5. Failed builds keep the previous deploy live

## 14. Content Workflow (Publishing)

- **Authoring:** Markdown/MDX files in `src/content/books/`
- **Schema:** enforced at build time via Zod in `content.config.ts`
- **Review:** pull request + preview deploy
- **Publishing:** merge to `main` → auto-deploy
- **Future CMS:** when Keystatic or Decap is added, it writes to the same content folder with the same schema

## 15. Inheritance

Every future business unit inherits this document. Additions are
permitted; weakening is not. Changes require a formal change
request and a version bump.

## 16. Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | October 2026 | Initial standard |

## 17. Approval

Signature: ______________________  Date: __________