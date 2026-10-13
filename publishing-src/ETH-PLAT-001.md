# ETH-PLAT-001 — Platform Evolution Strategy

**Document ID:** ETH-PLAT-001
**Version:** 0.1.0
**Status:** Draft — pending review and approval
**Owner:** Ethaqa FZE LLC
**Date:** October 2026

## 1. Current State
- One Cloudflare Pages project (`ethaqa`) serving ethaqa.com.
- Corporate site: static HTML at repo root.
- Publishing: Astro app at `publishing-src/`.
- Build output: `dist/` (generated during deploy, not committed).

## 2. Target State (Future)
- Monorepo restructure when two or more applications share code.
- Structure: `apps/`, `shared/`, `deploy/`.

## 3. Migration Trigger
Begin monorepo migration when:
- A second business unit begins implementation, AND
- Shared components are used by two applications, AND
- Duplication cost exceeds coordination cost.

## 4. Principle
No restructuring without measurable benefit. Architecture removes
future pain; it must not create present pain.

## 5. Roadmap
- Phase 0: Infrastructure — Complete
- Phase 1: Design System — Complete
- Phase 2: Brand Architecture — Complete
- Phase 3: Information Architecture — Complete
- Phase 4: Platform Architecture — This document (Draft)
- Phase 5: Publishing Build — In progress
- Phase 6: Sourcing — Future
- Monorepo — When Phase 6 begins

## 6. Approval
Signature: ______________________  Date: __________