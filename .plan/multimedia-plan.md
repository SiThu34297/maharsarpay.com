# Mahar Sarpay Multimedia Page Plan (Saved)

## Plan Update

- Date: 2026-04-15
- Summary: Added a dedicated localized multimedia browse page with search, media type filtering, and cursor-based pagination.
- Date: 2026-04-15
- Summary: Added shared Books category dropdown data to multimedia header so hover categories match homepage behavior.

## Goal

Deliver a fast, responsive, Myanmar-first multimedia page at /:lang/multimedia that supports discovery through search, media-type filters, and progressive loading.

## Approved Scope (V1)

- Route: /:lang/multimedia
- Data source: Feature adapter + API route
- UI scope:
  - Editorial hero section
  - Featured multimedia card grid
  - Search and media type filters (all/video/photo)
  - Infinite loading via cursor pagination
- Keep home page media section intact (no replacement)

## Architecture Plan

- Feature module under src/features/multimedia:
  - schemas/multimedia.ts
  - server/multimedia-adapter.ts
  - server/get-multimedia-page-data.ts
  - components/multimedia-page.tsx
  - components/multimedia-list-client.tsx
  - index.ts
- Route page:
  - src/app/[lang]/(marketing)/multimedia/page.tsx
- API route:
  - src/app/api/media/route.ts
- Integration:
  - Update marketing navigation media href to /:lang/multimedia
  - Extend i18n contract and dictionaries with multimediaList copy
  - Add minimal multimedia-specific global styles

## Data and Query Contract

- Query params:
  - q
  - mediaType (video | photo)
  - cursor
  - limit
- Response shape:
  - items
  - total
  - nextCursor
  - appliedFilters

## Validation Checklist

- npm run lint
- npm run typecheck
- Verify /en/multimedia and /my/multimedia
- Verify URL-synced search and mediaType filters
- Verify pagination append behavior without duplicates
- Verify /api/media locale and filter behavior
- Verify no regression on /:lang, /:lang/books, and /:lang/authors

## Plan Artifacts

- Multimedia plan: .plan/multimedia-plan.md
- Plan index: .plan/plan.md
