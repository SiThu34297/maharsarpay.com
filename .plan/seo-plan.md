# Mahar Sarpay SEO Plan

## Date

- 2026-04-18

## Goals

- Improve technical crawl/indexing health.
- Improve on-page metadata coverage for key routes.
- Keep both `/my` and `/en` locale paths indexable.

## Week 1 Scope

1. Add canonical host configuration and metadata base setup.
2. Add `robots` and `sitemap` metadata routes.
3. Fix locale routing behavior to preserve explicit locale paths.
4. Add missing `generateMetadata` for Home, Books, Authors, Multimedia, and Cart routes.
5. Add canonical + language alternates on key route metadata.
6. Add noindex policy on Login, Register, Profile, and Cart routes.

## In Progress

- [x] Plan saved under `.plan`.
- [x] SEO foundations implemented in app-level metadata routes.
- [x] Route-level metadata/noindex upgrades implemented.
- [x] Lint/typecheck/build validation completed.

## Validation Checklist

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Confirm `/robots.txt` and `/sitemap.xml` output.
- Confirm canonical and alternate language tags on representative locale pages.
- Confirm `noindex` appears on auth/user utility pages.
